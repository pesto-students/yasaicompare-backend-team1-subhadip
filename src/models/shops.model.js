import { Sequelize } from 'sequelize';
import config from '../config';

const { DATABASE } = config;

const ShopsModel = DATABASE.define(
  'shops',
  {
    shop_id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      uniqueKey: false,
    },
    address: {
      type: Sequelize.STRING,
      allowNull: false,
      uniqueKey: false,
    },
    city: {
      type: Sequelize.STRING,
      allowNull: false,
      uniqueKey: false,
    },
    state: {
      type: Sequelize.STRING,
      allowNull: false,
      uniqueKey: false,
    },
    pincode: {
      type: Sequelize.STRING,
      allowNull: false,
      uniqueKey: false,
    },
    country: {
      type: Sequelize.STRING,
      allowNull: false,
      uniqueKey: false,
    },
    gstin: {
      type: Sequelize.STRING,
      allowNull: true,
      uniqueKey: false,
    },
    owner_id: {
      type: Sequelize.STRING,
      allowNull: false,
      uniqueKey: false,
    },
    home_delievery_cost: {
      type: Sequelize.DOUBLE,
      allowNull: false,
      defaultValue: 3.52,
      uniqueKey: false,
    },
    home_delievery_distance: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
      uniqueKey: false,
    },
  },
  {
    timestamps: true,
    tableName: 'shops',
  }
);

export default ShopsModel;
