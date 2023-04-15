import { Sequelize } from 'sequelize';
import database from '../database';

const InventoryModel = database.define(
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
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    category_id: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    price: {
      type: Sequelize.DOUBLE,
      allowNull: false,
    },
    quantity: {
      type: Sequelize.BIGINT,
      allowNull: false,
    },
    unit: {
      type: Sequelize.STRING,
      enum: ['Kg, gram, Litre, ml, no'],
      allowNull: false,
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
