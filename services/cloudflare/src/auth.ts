import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import * as settings from './settings';

export interface CubeJwtPayload {
  sub: string;
  aud: string[];
}

function isCubeJwtPayload(x: any): x is CubeJwtPayload {
  return (
    'sub' in x &&
    'string' === typeof x.sub &&
    'aud' in x &&
    Array.isArray(x.aud) &&
    x.aud.every((x: any) => 'string' === typeof x)
  );
}

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers?.authorization;
  let token = authHeader && authHeader.split(' ')[1];

  // For requests without headers, f.e. links in confirmation emails, or the notorious UPLOAD_TUS_ENDPOINT.
  token ??= req.query?.authorization ? String(req.query?.authorization) : undefined;

  if (!token) return res.status(401).send('authorization header or query parameter missing or malformed');

  jwt.verify(token, settings.JWT_TOKEN_SECRET, (err, data) => {
    if (isCubeJwtPayload(data)) {
      req.user = {
        id: data.sub,
        permissions: data.aud
      };
      next();
    } else {
      console.log(403, `Cloudflare MS: Could not recognize JWT payload.`);
      return res.status(403).send(`Cloudflare MS: Could not recognize JWT payload.`);
    }
  });
};

// This *generates* a (composed) middleware which will pass control to the next
// handler (i.e. "allow" the request) only if the JWT carries one of the listed
// permission IDs
export const allowIfAnyOf = (...allowList: string[]) => [
  authenticateToken,
  (req: Request, res: Response, next: NextFunction) => {
    const isOnAllowList = (perm: string) => allowList.includes(perm);
    if (req.user?.permissions.some(isOnAllowList)) {
      next();
    } else {
      console.log(403, `Cloudflare MS: Offered user permission not on allowList.`, { allowList, permissions: req.user?.permissions });
      return res.status(403).send(`Cloudflare MS: Offered user permission not on allowList.`);
    }
  }
];

export const extractUser = (req: Request) => {
  if (!req?.user) {
    throw new Error('user missing from request')
  }
  return req.user;
};
