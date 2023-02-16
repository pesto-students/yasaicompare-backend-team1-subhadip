import Models from '../models';

const { ShopsModel } = Models;

/**
 * Get all Shops
 * @returns object
 */
const getAllShops = () => ShopsModel.findAll();

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

export default {
  getAllShops,
  getShopById,
  createShop,
};
