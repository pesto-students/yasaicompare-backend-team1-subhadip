import * as dotenv from 'dotenv';
import acl from './roles.config';
import database from './database.config';

dotenv.config();

export default {
  SERVER_PORT: process.env.SERVER_PORT,
  DATABASE: database,
  ROLES: acl.rolesList,
  ACCESS_LIST: acl.accessList,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
  TOKEN_HEADER_KEY: process.env.TOKEN_HEADER_KEY,
  SALT_ROUNDS: parseInt(process.env.SALTS, 10),
  ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY,
};
