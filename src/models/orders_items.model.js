import { Sequelize } from 'sequelize';
import config from '../config';

const { DATABASE } = config;

const OrderItemsModel = DATABASE.define(
  'order_items',
  {
    item_id: {
      type: Sequelize.STRING,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
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
    quantity: {
      type: Sequelize.BIGINT,
      allowNull: false,
      uniqueKey: false,
      defaultValue: 1,
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
