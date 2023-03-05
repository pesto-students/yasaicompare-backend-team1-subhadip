import Services from '../services';

const getUsers = async (req, res) => {
  const users = await Services.UserService.getAllUsers();
  res.status(200).send({
    success: true,
    data: users,
  });
};

/**
 * Get User By ID
 * @param {object} req
 * @param {object} res
 * @returns object
 */
const getUserById = async (req, res) => {
  const { userId } = req.body;

  try {
    const response = await Services.UserService.getUserById(userId);
    /**
     * If User Could Not be Found
     */
    if (response === null) {
      return res.status(404).send({
        error: 'User not found',
      });
    }

    /**
     * User Found
     */
    return res.status(200).send({
      response,
    });
  } catch (error) {
    /**
     * Error Occured
     */
    return res.status(500).send({
      error: 'An error Occured while retrieving User',
      data: error,
    });
  }
};

/**
 * Get Addresses
 * @param {object} req
 * @param {object} res
 * @returns object
 */
const getAddresses = async (req, res) => {
  const { userId, offset, limit } = req.query;

  try {
    const response = await Services.UserAddressService.getAllAddress(
      { user_id: userId },
      parseInt(offset, 10),
      parseInt(limit, 10)
    );
    return res.status(200).send(response);
  } catch (error) {
    /**
     * Error Occured
     */
    return res.status(500).send({
      error: 'An error Occured while retrieving User',
      data: error,
    });
  }
};

/**
 * Create Addresses
 * @param {object} req
 * @param {object} res
 * @returns object
 */
const createAddress = async (req, res) => {
  const { body } = req;

  try {
    const response = await Services.UserAddressService.createAddress(body);
    return res.status(201).send(response);
  } catch (error) {
    /**
     * Error Occured
     */
    return res.status(500).send({
      error: 'An error Occured while retrieving User',
      data: error,
    });
  }
};

const updateAddress = async (req, res) => {
  const { body } = req;

  try {
    const response = await Services.UserAddressService.updateAddress(body);
    return res.status(200).send(response);
  } catch (error) {
    /**
     * Error Occured
     */
    return res.status(500).send({
      error: 'An error Occured while retrieving User',
      data: error,
    });
  }
};

export default {
  getUsers,
  getUserById,
  getAddresses,
  createAddress,
  updateAddress,
};
