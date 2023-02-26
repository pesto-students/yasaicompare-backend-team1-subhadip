import * as dotenv from 'dotenv';
import { Sequelize } from 'sequelize';
import databaseConfig from '../database/config';

dotenv.config();

var database = {};

switch (process.env.ENV) {
  case 'production':
    database = new Sequelize({
      ...databaseConfig.production,
      pool: {
        max: 5,
        min: 0,
        idle: 10000,
      },
    });
    break;

  case 'anugrah-dev':
    database = new Sequelize({
      ...databaseConfig.anugrahDev,
      pool: {
        max: 5,
        min: 0,
        idle: 10000,
      },
    });
    break;

  default:
    database = new Sequelize({
      ...databaseConfig.development,
      pool: {
        max: 5,
        min: 0,
        idle: 10000,
      },
    });
}

export default database;
