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
 * Get User By Email & Password
 * @param { string } id
 * @returns object
 */
const loginUser = (email, password) =>
  UserModel.findOne({
    where: {
      email,
      password,
    },
  });

/**
 * Get User By ID
 * @param { string } id
 * @returns object
 */
const getUserById = (id) => UserModel.findByPk(id);

export default {
  loginUser,
  getAllUsers,
  getUserById,
  createUser,
};
