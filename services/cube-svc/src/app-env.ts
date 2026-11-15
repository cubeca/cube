import type { Env } from './env';
import type { Sql } from './db/sql';

export type AuthUser = {
  uuid: string;
  permissionIds: string[];
  token: string;
};

export type AppEnv = {
  Bindings: Env;
  Variables: {
    sql: Sql;
    user?: AuthUser;
  };
};
