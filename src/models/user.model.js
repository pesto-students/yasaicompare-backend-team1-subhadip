import { Sequelize } from 'sequelize';
import config from '../config';
import database from '../database';

const { ROLES } = config;

const UserModel = database.define(
  'user',
  {
    user_id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      uniqueKey: false,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
      uniqueKey: false,
    },
    first_name: {
      type: Sequelize.STRING,
      allowNull: false,
      uniqueKey: false,
    },
    last_name: {
      type: Sequelize.STRING,
      allowNull: true,
      uniqueKey: false,
    },
    image: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue:
        'https://www.nicepng.com/png/detail/933-9332131_profile-picture-default-png.png',
    },
    contact_no: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    role: {
      type: Sequelize.STRING,
      enum: ROLES,
      defaultValue: 'customer',
    },
  },
  {
    timestamps: true,
    tableName: 'user',
  }
);

export default UserModel;
