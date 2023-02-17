import Models from '../models';

const { InventoryModel } = Models;

/**
 * Get all Shops
 * @returns object
 */
const getAllInventory = (params) => InventoryModel.findAll(params);

/**
 * Create an Inventory
 * @returns object
 */
const createInventory = (data) => InventoryModel.create(data);

/**
 * Get Shop By ID
 * @param { string } id
 * @returns object
 */
const getInventoryById = (id) => InventoryModel.findByPk(id);

export default {
  getAllInventory,
  getInventoryById,
  createInventory,
};
