// eslint-disable-next-line import/no-extraneous-dependencies
import * as dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const saltRounds = parseInt(process.env.SALTS, 10);
const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(saltRounds * 2);
const iv = crypto.randomBytes(Math.floor(saltRounds / 2));

const generateSaltedString = async (string) => {
  try {
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
    let encrypted = cipher.update(string);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return {
      iv: iv.toString('base64'),
      encryptedData: encrypted.toString('base64'),
    };
  } catch (error) {
    return error.toString();
  }
};

export default {
  generateSaltedString,
};
