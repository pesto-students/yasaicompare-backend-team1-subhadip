import { Sequelize } from 'sequelize';
import database from '../database';

const OrderModel = database.define(
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
    delievery_address: {
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
      enum: [
        'draft',
        'pending',
        'confirmed',
        'in_transit',
        'delievered',
        'rejected',
      ],
      allowNull: false,
      defaultValue: 'draft',
    },
    payment_status: {
      type: Sequelize.STRING,
      enum: ['pending', 'paid', 'refunded'],
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
    draft: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    payment_intent: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    rejection_reason: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: '',
    },
  },
  {
    timestamps: true,
    tableName: 'order',
  }
);

export default OrderModel;
