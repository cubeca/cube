import type { Context, MiddlewareHandler } from 'hono';
import type { AppEnv } from '../app-env';
import { InvalidTokenError, MalformedTokenError, verifyCubeJwt } from '../utils/jwt';
import { text } from '../utils/http';

export const allowIfAnyOf = (...allowList: string[]): MiddlewareHandler<AppEnv> => {
  return async (c, next) => {
    const header = c.req.header('authorization');
    const token = header?.split(' ')[1] || c.req.query('authorization');
    if (!token) {
      return text(c, 'Authorization header or query parameter missing or malformed', 403);
    }

    try {
      const data = await verifyCubeJwt(token, c.env.JWT_TOKEN_SECRET);
      if (!data.aud.some((permission) => allowList.includes(permission))) {
        return text(c, 'User does not have sufficient permissions', 403);
      }
      c.set('user', { uuid: data.sub, permissionIds: data.aud, token });
    } catch (error) {
      if (error instanceof MalformedTokenError) {
        return text(c, 'Authorization header or query parameter is malformed', 403);
      }
      if (error instanceof InvalidTokenError) {
        return text(c, 'Invalid token', 403);
      }
      return text(c, 'Invalid token', 403);
    }

    await next();
  };
};

export function extractUser(c: Context<AppEnv>) {
  const user = c.get('user');
  if (!user) throw new Error('User object is missing from request');
  return user;
}
