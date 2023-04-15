import Models from '../models';

const { CartModel } = Models;

/**
 * Get all Cart Items of User
 * @returns object
 */
const getAllCarts = (params) => CartModel.findAll(params);

/**
 * Get a Cart Item of User
 * @returns object
 */
const searchACartItem = (params) => CartModel.findOne(params);

/**
 * Get a Cart Item of User
 * @returns object
 */
const getACartItem = (id, options = {}) => CartModel.findByPk(id, options);

/**
 * Update a Cart Item
 * @returns object
 */
const updateCartItem = (data, filter) => CartModel.update(data, filter);

/**
 * Create a Cart Item
 * @returns object
 */
const createCartItem = (data, options = {}) => CartModel.create(data, options);

/**
 * Delete Cart By ID
 * @param { object } filter
 * @returns object
 */
const deleteCartById = (filter) => CartModel.destroy(filter);

export default {
  getAllCarts,
  getACartItem,
  searchACartItem,
  createCartItem,
  deleteCartById,
  updateCartItem,
};
