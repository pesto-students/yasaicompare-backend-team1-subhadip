import { Sequelize } from 'sequelize';
import database from '../database';

const ShopsModel = database.define(
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
    active: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    latitude: {
      type: Sequelize.DOUBLE,
      allowNull: false,
    },
    longitude: {
      type: Sequelize.DOUBLE,
      allowNull: false,
    },
    image: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue:
        'https://cdn.pixabay.com/photo/2015/12/09/17/11/vegetables-1085063_640.jpg',
    },
    transaction_id: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'pending',
    },
    draft: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    timestamps: true,
    tableName: 'shops',
  }
);

export default ShopsModel;
