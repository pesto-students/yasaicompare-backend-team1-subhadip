import Models from '../models';

const { InventoryModel } = Models;

/**
 * Get all Shops
 * @returns object
 */
const getAllShops = (params) => InventoryModel.findAll(params);

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
const getShopById = (id) => InventoryModel.findByPk(id);

export default {
  getAllShops,
  getShopById,
  createInventory,
};
