// import querystring from 'querystring';
import Services from '../services';
import Helpers from '../utils/helpers';

const getShops = async (req, res) => {
  const shops = await Services.ShopsService.getAllShops();
  res.status(200).send({
    success: true,
    data: shops,
  });
};

/**
 * Get Shop By ID
 * @param {object} req
 * @param {object} res
 * @returns object
 */
const getShopById = async (req, res) => {
  if (!Object.prototype.hasOwnProperty.call(req.params, 'id')) {
    res.status(400).send({ success: false, message: 'Id is Required' });
    return;
  }

  try {
    const response = await Services.ShopsService.getShopById(req.params.id);
    /**
     * If Shop Could Not be Found
     */
    if (response === null) {
      res.status(404).send({
        success: false,
        message: 'Shop not found',
      });
      return;
    }
    /**
     * Shop Found
     */
    res.status(200).send({
      success: true,
      message: `Shop Found`,
      data: response,
    });
    return;
  } catch (error) {
    /**
     * Error Occured
     */
    res.status(500).send({
      success: false,
      message: 'An error Occured while retrieving Shop',
      data: error,
    });
  }
};

/**
 * Create / Update Shop Parameter
 * @param {object} request
 * @returns object
 */
const createUpdateParamValidator = async (request) => {
  /**
   * ValidationResponse
   */
  let response = {
    success: false,
  };

  const object = request.body;

  /**
   * Missing Shop Name
   */
  if (!Object.prototype.hasOwnProperty.call(object, 'name')) {
    response.message = 'Shop Name is Required';
    return response;
  }

  /**
   * Missing Address
   */
  if (
    !Object.prototype.hasOwnProperty.call(object, 'address') ||
    !Object.prototype.hasOwnProperty.call(object, 'city') ||
    !Object.prototype.hasOwnProperty.call(object, 'state') ||
    !Object.prototype.hasOwnProperty.call(object, 'pincode') ||
    !Object.prototype.hasOwnProperty.call(object, 'country')
  ) {
    response.message = 'Shop Address is Required';
    return response;
  }

  /**
   * Validating Owner Id
   */
  const tokenData = await Helpers.JWT.decodeJWTToken(
    Helpers.Validator.headerValidator(request)
  );

  /**
   * Get User
   */
  const user = await Services.UserService.getUserById(tokenData.data.user_id);

  if (user.role !== 'vendor') {
    response.message = 'User cannot create Shop';
    return response;
  }

  response = {
    success: true,
    data: {
      name: object.name,
      address: object.address,
      city: object.city,
      state: object.state,
      pincode: object.pincode,
      country: object.country,
      owner_id: tokenData.data.user_id,
    },
  };

  /**
   * If Set GSTIN
   */
  if (Object.prototype.hasOwnProperty.call(object, 'gstin')) {
    response.data.home_delievery_cost = object.gstin;
  }

  /**
   * If Set home_delievery_cost
   */
  if (Object.prototype.hasOwnProperty.call(object, 'home_delievery_cost')) {
    response.data.home_delievery_cost = object.home_delievery_cost;
  }

  /**
   * If Set home_delievery_distance
   */
  if (Object.prototype.hasOwnProperty.call(object, 'home_delievery_distance')) {
    response.data.home_delievery_distance = object.home_delievery_distance;
  }

  return response;
};

/**
 * Create shop
 * @param {object} req
 * @param {object} res
 * @returns object
 */
const createShop = async (req, res) => {
  /**
   * Params Validation
   */
  const validation = await createUpdateParamValidator(req);
  if (!validation.success) {
    res.status(400).send(validation);
    return;
  }

  try {
    const response = await Services.ShopsService.createShop(validation.data);
    /**
     * If Shop Could Not be created
     */
    if (response === null) {
      res.status(500).send({
        success: false,
        message: 'Shop Could not be created',
      });
      return;
    }
    /**
     * Shop Created Successfully
     */
    res.status(201).send({
      success: true,
      message: 'Shop Created Successfully',
      data: response,
    });
    return;
  } catch (error) {
    /**
     * Error Occured
     */
    res.status(502).send({
      success: false,
      message: 'An error Occured while creating Shop',
      data: error,
    });
  }
};

export default {
  getShops,
  createShop,
  getShopById,
};
