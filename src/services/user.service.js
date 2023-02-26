import Models from '../models';

const { UserModel } = Models;

/**
 * Get all Users
 * @returns object
 */
const getAllUsers = () => UserModel.findAll();

/**
 * Create a User
 * @returns object
 */
const createUser = (data) => UserModel.create(data);

/**
 * Get User By Email
 * @param { string } id
 * @returns object
 */
const getUserByEmail = (email) =>
  UserModel.findOne({
    where: {
      email,
    },
  });

/**
 * Get User By ID
 * @param { string } id
 * @returns object
 */
const getUserById = (id) => UserModel.findByPk(id);

export default {
  getUserByEmail,
  getAllUsers,
  getUserById,
  createUser,
};
