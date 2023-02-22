import { Sequelize } from 'sequelize';
import config from '../config';

const { DATABASE } = config;

const OrderModel = DATABASE.define(
  'order',
  {
    order_id: {
      type: Sequelize.STRING,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    order_no: {
      type: Sequelize.STRING,
      allowNull: false,
      uniqueKey: false,
    },
    customer_id: {
      type: Sequelize.STRING,
      allowNull: false,
      uniqueKey: false,
    },
    amount: {
      type: Sequelize.DOUBLE,
      allowNull: false,
      uniqueKey: false,
    },
    order_status: {
      type: Sequelize.STRING,
      enum: ['pending, confirmed, in_transit, delievered'],
      allowNull: false,
      defaultValue: 'pending',
    },
    payment_status: {
      type: Sequelize.STRING,
      enum: ['pending, paid, refunded'],
      allowNull: false,
      defaultValue: 'pending',
    },
    order_group_id: {
      type: Sequelize.STRING,
      allowNull: false,
      uniqueKey: false,
    },
    shop_id: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    delievery_charge: {
      type: Sequelize.DOUBLE,
      allowNull: false,
      defaultValue: 0.0,
    },
  },
  {
    timestamps: true,
    tableName: 'order',
  }
);

export default OrderModel;
