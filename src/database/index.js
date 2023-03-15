import { Sequelize } from 'sequelize';
import dbConfig from './config';
import config from '../config';

const database = new Sequelize({
  ...dbConfig[config.ENV],
  pool: {
    max: 5,
    min: 0,
    idle: 10000,
  },
});

export default database;
