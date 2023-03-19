import Models from '../models';

const { UserAddressModel } = Models;

const createAddress = (data, options) => UserAddressModel.create(data, options);

/**
 * Get all Addresses
 * @returns object
 */
const getAllAddress = (params) => UserAddressModel.findAll(params);

/**
 * Get Address By Id
 * @returns object
 */
const getAddressById = (filter) => UserAddressModel.findOne(filter);

/**
 * Update Address by id
 * @returns object
 */
const updateAddress = (data, options) =>
  UserAddressModel.update(data, {
    where: { id: data.id, user_id: data.user_id },
    options,
  });

export default {
  createAddress,
  getAllAddress,
  updateAddress,
  getAddressById,
};
