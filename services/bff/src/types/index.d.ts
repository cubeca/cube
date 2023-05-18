// to make the file a module and avoid the TypeScript error
export {};

export interface RequestUser {
  id: string;
  permissions: string[];
}

declare global {
  namespace Express {
    export interface Request {
      user?: RequestUser;
    }
  }
}
