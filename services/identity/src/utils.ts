import * as bcrypt from 'bcrypt';
import * as CryptoJS from 'crypto-js';
import * as settings from './settings';

export const hashPassword = async (password: string) => await bcrypt.hash(password, 10);

export const comparePassword = async (password: string, hash: string) => await bcrypt.compare(password, hash);

export const encryptString = (hash: string) => CryptoJS.AES.encrypt(hash, settings.ENCRYPT_SECRET).toString();

export const decryptString = (hash: string) =>
  CryptoJS.AES.decrypt(hash, settings.ENCRYPT_SECRET).toString(CryptoJS.enc.Utf8);
