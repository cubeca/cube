import * as bcrypt from 'bcrypt';
import * as CryptoJS from 'crypto-js';
import * as settings from './settings';
import { body } from 'express-validator';
import { AxiosHeaders } from 'axios';
import { Request } from 'express'

export const hashPassword = async (password: string) => await bcrypt.hash(password, 10);
export const comparePassword = async (password: string, hash: string) => await bcrypt.compare(password, hash);
export const encryptString = (hash: string) => CryptoJS.AES.encrypt(hash, settings.ENCRYPT_SECRET).toString();

export const decryptString = (hash: string) =>
  CryptoJS.AES.decrypt(hash, settings.ENCRYPT_SECRET).toString(CryptoJS.enc.Utf8);

export const validateUserCreateInput = [
  body('name').notEmpty().trim().escape().withMessage('Name is required.'),
  body('email').isEmail().normalizeEmail().withMessage('Invalid email.'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long.'),
  body('organization').optional().trim().escape(),
  body('website').optional().trim().escape(),
  body('tag').optional().trim().escape()
];

export const filterHeadersToForward = (req: Request, ...allowList: string[]): AxiosHeaders => {
  return new AxiosHeaders(filterObject(req.headers, ...allowList) as { [key: string]: string });
};

const filterObject = (obj: any, ...allowedKeys: string[]) =>
  Object.fromEntries(Object.entries(obj).filter(([key, _]: [key: string, _: any]) => allowedKeys.includes(key)));