import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import * as settings from '../settings';

/**
 * Interface representing the payload of a JWT used in the application.
 */
interface CubeJwtPayload {
  sub: string;
  aud: string[];
  iss: string;
}

/**
 * Interface representing an Express request that includes a user property.
 */
interface UserRequest extends Request {
  user?: {
    uuid: string;
    permissionIds: string[];
    token: string;
  };
}

/**
 * Type guard to check if an object is of type CubeJwtPayload.
 *
 * @function
 * @name isCubeJwtPayload
 * @param {any} x - The object to check.
 * @returns {boolean} True if the object is a CubeJwtPayload, false otherwise.
 */
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

/**
 * Middleware to authenticate a JWT token from the authorization header or query parameter.
 *
 * @function
 * @name authenticateToken
 * @param {UserRequest} req - The Express request object, extended with a user property.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {void}
 */
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
      permissionIds: data.aud,
      token: token
    };

    next();
  });
};

/**
 * Middleware to allow access if the user has any of the specified permissions.
 *
 * @function
 * @name allowIfAnyOf
 * @param {...string[]} allowList - The list of permissions to check against.
 * @returns {Function[]} An array of middleware functions.
 */
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

/**
 * Utility function to extract the user object from the request.
 *
 * @function
 * @name extractUser
 * @param {UserRequest} req - The Express request object, extended with a user property.
 * @returns {Object} The user object from the request.
 * @throws {Error} If the request or user object is missing.
 */
export const extractUser = (req: UserRequest) => {
  if (!req) {
    throw new Error('Request object is missing');
  }

  if (!req.user) {
    throw new Error('User object is missing from request');
  }

  return req.user;
};
