import Models from '../models';

const { ShopsModel } = Models;

/**
 * Get all Shops
 * @returns object
 */
const getAllShops = (params) => ShopsModel.findAll(params);

/**
 * Get Shop
 * @returns object
 */
const getShop = (params) => ShopsModel.findOne(params);

/**
 * Create a Shop
 * @returns object
 */
const createShop = (data) => ShopsModel.create(data);

/**
 * Get Shop By ID
 * @param { string } id
 * @returns object
 */
const getShopById = (id, options) => ShopsModel.findByPk(id, options);

/**
 * Update Shop By Id
 * @param {object} body
 * @param {object} filter
 * @returns object
 */
const updateShopById = (body, filter) => ShopsModel.update(body, filter);

export default {
  getAllShops,
  getShopById,
  createShop,
  updateShopById,
  getShop,
};
