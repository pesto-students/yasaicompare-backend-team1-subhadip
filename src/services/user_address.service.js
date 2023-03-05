import Models from '../models';

const { UserAddressModel } = Models;

const createAddress = (data) => UserAddressModel.create(data);

/**
 * Get all Addresses
 * @returns object
 */
const getAllAddress = (findOptions = {}, offset = 0, limit = 100) =>
  UserAddressModel.findAndCountAll({
    where: {
      ...findOptions,
    },
    offset,
    limit,
  });

/**
 * Update Address by id
 * @returns object
 */
const updateAddress = (data) =>
  UserAddressModel.update(data, { where: { id: data.id } });

export default {
  createAddress,
  getAllAddress,
  updateAddress,
};
