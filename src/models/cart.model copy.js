import { Sequelize } from 'sequelize';
import config from '../config';

const { DATABASE } = config;

const CartModel = DATABASE.define(
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
  },
  {
    timestamps: true,
    tableName: 'cart',
  }
);

export default CartModel;
