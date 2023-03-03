import * as dotenv from 'dotenv';
import acl from './roles.config';

dotenv.config();

export default {
  SERVER_PORT: process.env.SERVER_PORT,
  DATABASE_HOST: process.env.DATABASE_HOST,
  DATABASE_POST: process.env.DATABASE_PORT,
  DATABASE_NAME: process.env.DATABASE_NAME,
  DATABASE_USERNAME: process.env.DATABASE_USERNAME,
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
  ROLES: acl.rolesList,
  ACCESS_LIST: acl.accessList,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
  TOKEN_HEADER_KEY: process.env.TOKEN_HEADER_KEY,
  SALT_ROUNDS: parseInt(process.env.SALTS, 10),
  ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY,
  ENV: process.env.NODE_ENV || 'development',
};
