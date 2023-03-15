import { Sequelize } from 'sequelize';
import database from '../database';

const CategoryModel = database.define(
  'category',
  {
    category_id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
      enum: ['vegetables', 'fruits', 'milk'],
      allowNull: false,
    },
  },
  {
    timestamps: true,
    tableName: 'category',
  }
);

export default CategoryModel;
