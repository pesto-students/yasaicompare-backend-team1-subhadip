import { Sequelize } from 'sequelize';
import config from '../config';

const { DATABASE } = config;

const InventoryModel = DATABASE.define(
  'inventory',
  {
    inventory_id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    shop_id: {
      type: Sequelize.STRING,
      allowNull: false,
      uniqueKey: false,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      uniqueKey: false,
    },
    category_id: {
      type: Sequelize.STRING,
      allowNull: false,
      uniqueKey: false,
    },
    price: {
      type: Sequelize.DOUBLE,
      allowNull: false,
      uniqueKey: false,
    },
    quantity: {
      type: Sequelize.BIGINT,
      allowNull: false,
      uniqueKey: false,
    },
    in_stock: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    image: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue:
        'https://cdn.pixabay.com/photo/2015/12/09/17/11/vegetables-1085063_640.jpg',
    },
  },
  {
    timestamps: true,
    tableName: 'inventory',
  }
);

export default InventoryModel;
