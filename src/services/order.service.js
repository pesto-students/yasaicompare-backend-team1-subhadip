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
const getOrderById = (filter) => OrderModel.findAll(filter);

/**
 * Get Order Count
 * @param {object} filter
 * @returns object
 */
const getOrdersCount = (filter) => OrderModel.count(filter);

/**
 * Update Order
 * @returns object
 */
const updateOrder = (data, filter) => OrderModel.update(data, filter);

/**
 * Delete Order
 * @param {object} filter
 * @returns
 */
const deleteOrderById = (filter) => OrderModel.destroy(filter);

export default {
  getAllOrders,
  createOrder,
  getOrderById,
  getOrdersCount,
  updateOrder,
  deleteOrderById,
};
