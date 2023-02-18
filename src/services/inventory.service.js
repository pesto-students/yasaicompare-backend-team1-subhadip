import Models from '../models';

const { InventoryModel } = Models;

/**
 * Get all Inventory Items
 * @returns object
 */
const getAllInventory = (params) => InventoryModel.findAll(params);

/**
 * Get all Inventory Items
 * @returns object
 */
const getInventory = (params) => InventoryModel.findOne(params);

/**
 * Create an Inventory
 * @returns object
 */
const createInventory = (data) => InventoryModel.create(data);

/**
 * Update an Inventory
 * @returns object
 */
const updateInventory = (data, filter) => InventoryModel.update(data, filter);

/**
 * Get Item By ID
 * @param { string } id
 * @returns object
 */
const getInventoryById = (id) => InventoryModel.findByPk(id);

export default {
  getAllInventory,
  getInventoryById,
  createInventory,
  getInventory,
  updateInventory,
};
