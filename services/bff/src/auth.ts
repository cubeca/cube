import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import * as settings from './settings';

interface CubeJwtPayload {
  sub: string;
  aud: string[];
  iss: string;
}

interface UserRequest extends Request {
  user?: {
    uuid: string;
    permissionIds: string[];
  };
}

function isCubeJwtPayload(x: any): x is CubeJwtPayload {
  return (
    'sub' in x &&
    'string' === typeof x.sub &&
    x.sub !== '' &&
    'aud' in x &&
    Array.isArray(x.aud) &&
    x.aud.length > 0 &&
    x.aud.every((x: any) => 'string' === typeof x && x !== '') &&
    x.iss === 'CUBE'
  );
}

const authenticateToken = (req: UserRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const authQuery = req.query?.authorization ? String(req.query?.authorization) : undefined;
  const token = authHeader?.split(' ')[1] || authQuery;

  if (!token) {
    return res.status(403).send('Authorization header or query parameter missing or malformed');
  }

  jwt.verify(token, settings.JWT_TOKEN_SECRET, (err, data) => {
    if (err) {
      return res.status(403).send('Invalid token');
    }

    if (!isCubeJwtPayload(data)) {
      return res.status(403).send('Authorization header or query parameter is malformed');
    }

    req.user = {
      uuid: data.sub,
      permissionIds: data.aud
    };

    next();
  });
};

export const allowIfAnyOf = (...allowList: string[]) => [
  authenticateToken,
  (req: UserRequest, res: Response, next: NextFunction) => {
    const isOnAllowList = (permission: string) => allowList.includes(permission);
    if (!req.user) {
      return res.status(403).send('No user object found in request');
    }

    if (!req.user.permissionIds || !req.user.permissionIds.some(isOnAllowList)) {
      return res.status(403).send('User does not have sufficient permissions');
    }

    next();
  }
];

export const extractUser = (req: UserRequest) => {
  if (!req) {
    throw new Error('Request object is missing');
  }

  if (!req.user) {
    throw new Error('User object is missing from request');
  }

  return req.user;
};
