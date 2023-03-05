import Sequelize from 'sequelize';
import database from '../database';

const UserAddressModel = database.define(
  'user-address',
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    address_line_1: {
      type: Sequelize.STRING,
      allowNull: false,
      uniqueKey: false,
    },
    address_line_2: {
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
      allowNull: true,
      uniqueKey: false,
    },
    country: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    latitude: {
      type: Sequelize.DOUBLE,
      allowNull: false,
    },
    longitude: {
      type: Sequelize.DOUBLE,
      allowNull: false,
    },
    pincode: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    is_active: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },
    user_id: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    tableName: 'user-address',
  }
);

export default UserAddressModel;
