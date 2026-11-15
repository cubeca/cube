import { commaList } from '../utils/query';

export type SqlStatement = { text: string; params: unknown[] };

const CONTENT_FIELDS = ['title', 'type', 'tags', 'languageTags', 'description', 'coverImageText', 'contributors'] as const;

function ilikeAny(column: string, fields: readonly string[], param: string): string {
  return `(${fields.map((field) => `(${column}#>>'{${field}}') ILIKE ${param}`).join(' OR ')})`;
}

/**
 * SQL equivalent of the Sequelize `searchContent` where-clause.
 * Terms joined with `&` are ANDed. Expiry must be empty or in the future.
 * Live must be empty or in the past. Comparisons use the `#>>` text extraction,
 * which is what Sequelize generates for JSON paths.
 */
export function searchContentStatement(
  schemaTable: string,
  offset: number,
  limit: number,
  filters: Record<string, unknown>,
  searchTerm: string,
  nowIso: string
): SqlStatement {
  const params: unknown[] = [];
  const clauses: string[] = [];

  const terms = searchTerm
    .split('&')
    .map((term) => term.trim())
    .filter((term) => term.length > 0);

  for (const term of terms) {
    params.push(`%${term}%`);
    clauses.push(ilikeAny('"data"', CONTENT_FIELDS, `$${params.length}`));
  }

  if (filters.category) {
    params.push(`%${String(filters.category)}%`);
    clauses.push(`("data"#>>'{category}') ILIKE $${params.length}`);
  }

  if (filters.profileId) {
    params.push(String(filters.profileId));
    clauses.push(`("data"#>>'{profileId}') = $${params.length}`);
  }

  if (filters.tags) {
    const parts = commaList(filters.tags).map((tag) => {
      params.push(`%${tag}%`);
      return `("data"#>>'{tags}') ILIKE $${params.length}`;
    });
    if (parts.length > 0) clauses.push(`(${parts.join(' OR ')})`);
  }

  if (filters.languageTags) {
    const parts = commaList(filters.languageTags).map((tag) => {
      params.push(`%${tag}%`);
      return `("data"#>>'{languageTags}') ILIKE $${params.length}`;
    });
    if (parts.length > 0) clauses.push(`(${parts.join(' OR ')})`);
  }

  params.push('');
  const empty = `$${params.length}`;
  params.push(nowIso);
  const now = `$${params.length}`;
  clauses.push(`(("data"#>>'{expiry}') IS NULL OR ("data"#>>'{expiry}') = ${empty} OR ("data"#>>'{expiry}') >= ${now})`);
  clauses.push(`(("data"#>>'{live}') IS NULL OR ("data"#>>'{live}') = ${empty} OR ("data"#>>'{live}') <= ${now})`);

  params.push(limit);
  const limitParam = `$${params.length}`;
  params.push(offset);
  const offsetParam = `$${params.length}`;

  return {
    text: `SELECT id, created_at, updated_at, data FROM ${schemaTable} WHERE (${clauses.join(' AND ')}) ORDER BY "created_at" DESC LIMIT ${limitParam} OFFSET ${offsetParam}`,
    params
  };
}

/**
 * Profile search ORs each term across organization, website, tag and description.
 * An empty term matches nothing (`WHERE FALSE`), which is what Sequelize emits for `Op.or` of `[]`.
 * The status filter on the old handler was attached to the array object and Sequelize ignored it.
 */
export function searchProfilesStatement(schemaTable: string, offset: number, limit: number, searchTerm: string): SqlStatement {
  const params: unknown[] = [];
  const terms = searchTerm
    .split('&')
    .map((term) => term.trim())
    .filter((term) => term.length > 0);

  let where = 'FALSE';
  if (terms.length > 0) {
    const groups = terms.map((term) => {
      params.push(`%${term}%`);
      const param = `$${params.length}`;
      return `("organization" ILIKE ${param} OR "website" ILIKE ${param} OR "tag" ILIKE ${param} OR "description" ILIKE ${param})`;
    });
    where = groups.join(' OR ');
  }

  params.push(limit);
  const limitParam = `$${params.length}`;
  params.push(offset);
  const offsetParam = `$${params.length}`;

  return {
    text: `SELECT id, organization, website, tag, herofileid, logofileid, description, descriptionfileid, budget, status FROM ${schemaTable} WHERE ${where} ORDER BY "organization" ASC LIMIT ${limitParam} OFFSET ${offsetParam}`,
    params
  };
}

/** Playlist terms are ANDed. With no term and no filters Sequelize emits no WHERE clause. */
export function searchPlaylistStatement(
  schemaTable: string,
  offset: number,
  limit: number,
  filters: Record<string, unknown>,
  searchTerm: string
): SqlStatement {
  const params: unknown[] = [];
  const clauses: string[] = [];
  const terms = searchTerm
    .split('&')
    .map((term) => term.trim())
    .filter((term) => term.length > 0);

  for (const term of terms) {
    params.push(`%${term}%`);
    const param = `$${params.length}`;
    clauses.push(`(("data"#>>'{title}') ILIKE ${param} OR ("data"#>>'{description}') ILIKE ${param})`);
  }

  if (filters.profileId) {
    params.push(String(filters.profileId));
    clauses.push(`("data"#>>'{profileId}') = $${params.length}`);
  }

  if (filters.contentId) {
    params.push(`%${String(filters.contentId)}%`);
    clauses.push(`("data"#>>'{contentIds}') ILIKE $${params.length}`);
  }

  params.push(limit);
  const limitParam = `$${params.length}`;
  params.push(offset);
  const offsetParam = `$${params.length}`;
  const where = clauses.length > 0 ? `WHERE (${clauses.join(' AND ')}) ` : '';

  return {
    text: `SELECT id, created_at, updated_at, data FROM ${schemaTable} ${where}LIMIT ${limitParam} OFFSET ${offsetParam}`,
    params
  };
}

/**
 * Listing by profile (and optional category) ORs the two predicates.
 * With neither predicate Sequelize generates `WHERE 0 = 1` and the list is empty.
 * Category uses JSON containment (`#> @>`) rather than ILIKE.
 */
export function listByJsonIdStatement(
  schemaTable: string,
  offset: number,
  limit: number,
  matches: { column: string; value: unknown }[],
  orderByCreatedAt: boolean
): SqlStatement {
  const params: unknown[] = [];
  const parts = matches
    .filter((match) => match.value !== undefined && match.value !== null && match.value !== '')
    .map((match) => {
      if (match.column === 'category') {
        params.push(JSON.stringify(match.value));
        return `("data"#>'{category}') @> $${params.length}::jsonb`;
      }
      params.push(String(match.value));
      return `("data"#>>'{${match.column}}') = $${params.length}`;
    });

  const where = parts.length > 0 ? `WHERE (${parts.join(' OR ')}) ` : 'WHERE FALSE ';
  const order = orderByCreatedAt ? 'ORDER BY "created_at" DESC ' : '';
  params.push(limit);
  const limitParam = `$${params.length}`;
  params.push(offset);
  const offsetParam = `$${params.length}`;

  return {
    text: `SELECT id, created_at, updated_at, data FROM ${schemaTable} ${where}${order}LIMIT ${limitParam} OFFSET ${offsetParam}`,
    params
  };
}
