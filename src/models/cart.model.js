import { Sequelize } from 'sequelize';
import database from '../database';

const CartModel = database.define(
  'cart',
  {
    cart_id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    shop_id: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    customer_id: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    item_id: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    quantity: {
      type: Sequelize.BIGINT,
      allowNull: false,
      defaultValue: 1,
    },
    price: {
      type: Sequelize.DOUBLE,
      allowNull: false,
      defaultValue: 1,
    },
    image: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: '',
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: '',
    },
  },
  {
    timestamps: true,
    tableName: 'cart',
  }
);

export default CartModel;
