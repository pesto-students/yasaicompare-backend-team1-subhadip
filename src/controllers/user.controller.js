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
  if (!Object.prototype.hasOwnProperty.call(req.params, 'id')) {
    res.status(400).send({ success: false, message: 'Id is Required' });
    return;
  }

  try {
    const response = await Services.UserService.getUserById(req.params.id);
    /**
     * If User Could Not be Found
     */
    if (response === null) {
      res.status(404).send({
        success: false,
        message: 'User not found',
      });
      return;
    }
    /**
     * User Found
     */
    res.status(200).send({
      success: true,
      message: `User Found`,
      data: response,
    });
    return;
  } catch (error) {
    /**
     * Error Occured
     */
    res.status(500).send({
      success: false,
      message: 'An error Occured while retrieving User',
      data: error,
    });
  }
};

export default {
  getUsers,
  getUserById,
};
