import { describe, expect, it } from 'vitest';
import { listByJsonIdStatement, searchContentStatement, searchPlaylistStatement, searchProfilesStatement } from '../src/db/search';

const table = '"cube"."content"';

describe('search SQL', () => {
  it('ANDs content terms and keeps expiry and live windows', () => {
    const statement = searchContentStatement(table, 0, 10, { category: 'video', profileId: 'pid', tags: 'a, b' }, 'jazz & blues', '2026-11-15T00:00:00.000Z');
    expect(statement.text).toContain(`("data"#>>'{title}') ILIKE $1`);
    expect(statement.text).toContain(`("data"#>>'{title}') ILIKE $2`);
    expect(statement.text).toContain(`("data"#>>'{category}') ILIKE $3`);
    expect(statement.text).toContain(`("data"#>>'{profileId}') = $4`);
    expect(statement.text).toContain(`("data"#>>'{tags}') ILIKE $5`);
    expect(statement.text).toContain(`("data"#>>'{tags}') ILIKE $6`);
    expect(statement.text).toContain(`("data"#>>'{expiry}') IS NULL`);
    expect(statement.text).toContain(`("data"#>>'{live}') <= $8`);
    expect(statement.text).toContain('ORDER BY "created_at" DESC');
    expect(statement.params.slice(0, 6)).toEqual(['%jazz%', '%blues%', '%video%', 'pid', '%a%', '%b%']);
  });

  it('ORs profile terms and matches nothing when the term is empty', () => {
    const found = searchProfilesStatement('"cube"."profiles"', 0, 10, 'jazz');
    expect(found.text).toContain('"organization" ILIKE $1 OR "website" ILIKE $1');
    expect(found.text).not.toContain('"status" ILIKE');
    const empty = searchProfilesStatement('"cube"."profiles"', 3, 10, '   ');
    expect(empty.text).toContain('WHERE FALSE');
  });

  it('omits the playlist WHERE clause when there is nothing to filter', () => {
    const statement = searchPlaylistStatement('"cube"."playlists"', 0, 10, {}, '');
    expect(statement.text).not.toContain('WHERE');
    const filtered = searchPlaylistStatement('"cube"."playlists"', 0, 10, { profileId: 'pid' }, 'jazz');
    expect(filtered.text).toContain(`("data"#>>'{title}') ILIKE $1`);
    expect(filtered.text).toContain(`("data"#>>'{profileId}') = $2`);
  });

  it('lists content by profile or category and returns no rows when neither is set', () => {
    const both = listByJsonIdStatement(table, 0, 10, [
      { column: 'profileId', value: 'pid' },
      { column: 'category', value: 'video' }
    ], false);
    expect(both.text).toContain(`("data"#>>'{profileId}') = $1 OR ("data"#>'{category}') @> $2::jsonb`);
    expect(both.params[1]).toBe(JSON.stringify('video'));
    expect(both.text).not.toContain('ORDER BY');

    const none = listByJsonIdStatement(table, 0, 10, [], true);
    expect(none.text).toContain('WHERE FALSE');
    expect(none.text).toContain('ORDER BY "created_at" DESC');
  });
});
