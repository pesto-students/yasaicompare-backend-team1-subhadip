import Models from '../models';

const { ShopsModel } = Models;

/**
 * Get all Shops
 * @returns object
 */
const getAllShops = (params) => ShopsModel.findAll(params);

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
const getShopById = (id) => ShopsModel.findByPk(id);

/**
 * Update Shop By Id
 * @param {object} body
 * @param {object} filter
 * @returns object
 */
const updateShopById = (body, filter) =>
  ShopsModel.update(body, {
    where: filter,
  });

export default {
  getAllShops,
  getShopById,
  createShop,
  updateShopById,
};
