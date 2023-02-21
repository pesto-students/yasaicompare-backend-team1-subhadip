import Models from '../models';

const { OrderItemsModel } = Models;

/**
 * Get all Order Items
 * @returns object
 */
const getOrderItems = (params) => OrderItemsModel.findAll(params);

/**
 * Create an Inventory
 * @returns object
 */
const createOrderItem = (data, transaction) =>
  OrderItemsModel.create(data, transaction);

/**
 * Get Shop By ID
 * @param { string } id
 * @returns object
 */
const getOrderById = (id) => OrderItemsModel.findByPk(id);

/**
 * Get Order Count
 * @param {object} filter
 * @returns object
 */
const getOrdersCount = (filter) => OrderItemsModel.count(filter);

export default {
  getOrderItems,
  createOrderItem,
  getOrderById,
  getOrdersCount,
};
