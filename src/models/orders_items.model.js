import { Sequelize } from 'sequelize';
import config from '../config';

const { DATABASE } = config;

const OrderItemsModel = DATABASE.define(
  'order_items',
  {
    item_id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    order_id: {
      type: Sequelize.STRING,
      allowNull: false,
      uniqueKey: false,
    },
    price: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 0.0,
    },
    fulfilled: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    rejection_reason: {
      type: Sequelize.STRING,
      enum: ['stock_unavailable'],
      allowNull: true,
    },
  },
  {
    timestamps: true,
    tableName: 'order_items',
  }
);

export default OrderItemsModel;
