import * as bcrypt from 'bcrypt';
import * as CryptoJS from 'crypto-js';
import * as dotenv from 'dotenv';
import * as settings from './settings';

dotenv.config();

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 10);
};

export const comparePassword = async (password: string, hash: string) => {
  return await bcrypt.compare(password, hash);
};

export const encryptString = (hash: string) => {
  return CryptoJS.AES.encrypt(hash, settings.ENCRYPT_SECRET).toString();
};

export const decryptString = (hash: string) => {
  return CryptoJS.AES.decrypt(hash, settings.ENCRYPT_SECRET).toString(
    CryptoJS.enc.Utf8
  );
};
