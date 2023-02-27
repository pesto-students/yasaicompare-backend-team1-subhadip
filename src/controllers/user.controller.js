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
// eslint-disable-next-line consistent-return
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
    res.status(500).send({
      error: 'An error Occured while retrieving User',
      data: error,
    });
  }
};

export default {
  getUsers,
  getUserById,
};
