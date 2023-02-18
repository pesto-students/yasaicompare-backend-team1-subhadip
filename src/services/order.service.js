import Models from '../models';

const { OrderModel } = Models;

/**
 * Get all Orders
 * @returns object
 */
const getAllOrders = (params) => OrderModel.findAll(params);

/**
 * Create an Inventory
 * @returns object
 */
const createOrder = (data, transaction) => OrderModel.create(data, transaction);

/**
 * Get Shop By ID
 * @param { string } id
 * @returns object
 */
const getOrderById = (id) => OrderModel.findByPk(id);

/**
 * Get Order Count
 * @param {object} filter
 * @returns object
 */
const getOrdersCount = (filter) => OrderModel.count(filter);

export default {
  getAllOrders,
  createOrder,
  getOrderById,
  getOrdersCount,
};
