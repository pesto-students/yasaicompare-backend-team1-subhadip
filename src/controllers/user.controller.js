import Services from '../services';

const userAttributes = [
  'user_id',
  'email',
  'first_name',
  'last_name',
  'image',
  'contact_no',
  'role',
];

const userAddressAttributes = [
  'id',
  'address_line_1',
  'address_line_2',
  'city',
  'state',
  'country',
  'latitude',
  'longitude',
  'pincode',
  'is_active',
];

/**
 * Get User By ID
 * @param {object} req
 * @param {object} res
 * @returns object
 */
const getUserById = async (req, res) => {
  const { userId } = req.body;

  try {
    const response = await Services.UserService.getUserById(userId, {
      attributes: userAttributes,
    });

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
  const { limit, userId } = req.body;
  const pageInfo = req.body.page_info;
  delete req.body.limit;

  try {
    const userAddressFilter = {
      where: {
        user_id: userId,
      },
      attributes: userAddressAttributes,
      offset: pageInfo,
      limit,
    };

    const addresses = await Services.UserAddressService.getAllAddress(
      userAddressFilter
    );

    const returnData = {
      addresses,
    };

    return res.status(200).send(returnData);
  } catch (error) {
    /**
     * Error Occured
     */
    return res.status(500).send({
      error: 'An error Occured while retrieving User Addresses',
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
    const response = await Services.UserAddressService.createAddress(body, userAddressAttributes);

    /**
     * If Address Could Not be added
     */
    if (response === null) {
      const returnResponse = {
        error: 'Address Could not be Saved',
      };
      return res.status(500).send(returnResponse);
    }

    return res.status(201).send({
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

const updateAddress = async (req, res) => {
  const { body } = req;

  try {

    const response = await Services.UserAddressService.updateAddress(body, userAddressAttributes);
    
    /**
     * If Address Could Not be updated
     */
    if (response === null) {
      const returnResponse = {
        error: 'Address Could not be updated',
      };
      return res.status(500).send(returnResponse);
    }

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

export default {
  getUserById,
  getAddresses,
  createAddress,
  updateAddress,
};
