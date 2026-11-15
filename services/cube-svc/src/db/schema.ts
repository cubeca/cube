/** Reject anything that is not a plain SQL identifier before it is interpolated. */
export function assertSchema(schema: string): string {
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(schema)) {
    throw new Error('Invalid DB_SCHEMA');
  }
  return schema;
}

export function table(schema: string, name: string): string {
  return `"${assertSchema(schema)}"."${name}"`;
}
