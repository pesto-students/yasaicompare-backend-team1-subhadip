import { Sequelize } from 'sequelize';
import database from '../database';

const OrderItemsModel = database.define(
  'order_items',
  {
    item_id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    inventory_id: {
      type: Sequelize.STRING,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
    },
    order_id: {
      type: Sequelize.STRING,
      allowNull: false,
      uniqueKey: false,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
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
