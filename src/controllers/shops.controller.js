// import querystring from 'querystring';
import Services from '../services';
import Helpers from '../utils/helpers';

const getShopsAction = async (req, res) => {
  /**
   * JWT Token Decoded
   */
  const tokenData = await Helpers.JWT.decodeJWTToken(
    Helpers.Validator.headerValidator(req)
  );

  /**
   * Filter Data
   */
  const filter = {
    where: {
      owner_id: tokenData.data.user_id,
    },
    attributes: [
      'shop_id',
      'name',
      'home_delievery_distance',
      'home_delievery_cost',
      'active',
    ],
  };

  /**
   * If Status Check Set
   */
  if (Object.prototype.hasOwnProperty.call(req.query, 'active')) {
    filter.where.active =
      req.query.active === true || req.query.active === 'true';
  }

  try {
    /**
     * Hitting Service
     */
    const shops = await Services.ShopsService.getAllShops(filter);

    /**
     * If Shops Could Not be Found
     */
    if (shops === null) {
      const returnResponse = {
        success: false,
        message: 'Shop(s) not found',
      };
      res.locals.errorMessage = JSON.stringify(returnResponse);
      return res.status(404).send(returnResponse);
    }

    /**
     * Shops Found
     */
    const returnData = {
      success: true,
      message: `Shop(s) Found`,
      data: shops,
    };
    res.locals.errorMessage = JSON.stringify(returnData);

    return res.status(200).send(returnData);
  } catch (error) {
    /**
     * Error Occured
     */
    const response = {
      success: false,
      message: 'An error Occured while retrieving Shop(s)',
      data: error,
    };
    res.locals.errorMessage = JSON.stringify(response);

    return res.status(500).send(response);
  }
};

/**
 * Get Shop By ID
 * @param {object} req
 * @param {object} res
 * @returns object
 */
const getShopByIdAction = async (req, res) => {
  if (!Object.prototype.hasOwnProperty.call(req.params, 'id')) {
    const validationResponse = { success: false, message: 'Id is Required' };
    res.locals.errorMessage = JSON.stringify(validationResponse);
    return res.status(400).send(validationResponse);
  }

  try {
    const response = await Services.ShopsService.getShopById(req.params.id);

    /**
     * If Shop Could Not be Found
     */
    if (response === null) {
      const returnResponse = {
        success: false,
        message: 'Shop not found',
      };
      res.locals.errorMessage = JSON.stringify(returnResponse);
      return res.status(404).send(returnResponse);
    }

    /**
     * Shop Found
     */
    const returnData = {
      success: true,
      message: `Shop Found`,
      data: response,
    };
    res.locals.errorMessage = JSON.stringify(returnData);

    return res.status(200).send(returnData);
  } catch (error) {
    /**
     * Error Occured
     */
    const response = {
      success: false,
      message: 'An error Occured while retrieving Shop',
      data: error,
    };
    res.locals.errorMessage = JSON.stringify(response);

    return res.status(500).send(response);
  }
};

/**
 * Create shop
 * @param {object} req
 * @param {object} res
 * @returns object
 */
const registerShopAction = async (req, res) => {
  /**
   * Destructuring Body
   */
  const { body } = req.body;

  try {
    const response = await Services.ShopsService.createShop(body);

    /**
     * If Shop Could Not be created
     */
    const returnResponse = {
      success: false,
      message: 'Shop Could not be created',
    };
    res.locals.errorMessage = JSON.stringify(returnResponse);
    if (response === null) {
      return res.status(500).send(returnResponse);
    }

    /**
     * Shop Created Successfully
     */
    const returnData = {
      success: true,
      message: 'Shop Created Successfully',
      data: response,
    };
    res.locals.errorMessage = JSON.stringify(returnData);

    return res.status(201).send(returnData);
  } catch (error) {
    /**
     * Error Occured
     */
    const response = {
      success: false,
      message: 'An error Occured while creating Shop',
      data: error,
    };
    res.locals.errorMessage = JSON.stringify(response);

    return res.status(502).send(response);
  }
};

export default {
  getShopsAction,
  registerShopAction,
  getShopByIdAction,
};
