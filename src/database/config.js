import * as dotenv from 'dotenv';

dotenv.config();

const database = {
  development: {
    dialect: 'mysql',
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
  },
  test: {
    dialect: 'mysql',
    host: process.env.DATABASE_HOST,
    port: process.env.DATABSE_PORT,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
  },
  production: {
    dialect: 'mysql',
    host: process.env.DATABASE_HOST,
    port: process.env.DATABSE_PORT,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
  },
};

export default database;
