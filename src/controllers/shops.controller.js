// import querystring from 'querystring';
import { type } from 'os';
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
    filter.where.active = req.query.active.toLowerCase() === 'true';
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
 * Create / Update Shop Parameter
 * @param {object} request
 * @returns object
 */
const createUpdateShopParamValidator = async (request) => {
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

  /**
   * If Set shop_status
   */
  if (Object.prototype.hasOwnProperty.call(object, 'active')) {
    response.data.active = Boolean(object.active);
  }

  return response;
};

/**
 * Create shop
 * @param {object} req
 * @param {object} res
 * @returns object
 */
const createShopAction = async (req, res) => {
  /**
   * Params Validation
   */
  const validation = await createUpdateShopParamValidator(req);
  if (!validation.success) {
    res.locals.errorMessage = JSON.stringify(validation);
    return res.status(400).send(validation);
  }

  try {
    const response = await Services.ShopsService.createShop(validation.data);
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

/**
 * Create / Update Shop Inventory
 * @param {object} request
 * @returns object
 */
const createUpdateInventoryParamValidator = async (request, mode) => {
  /**
   * ValidationResponse
   */
  const response = {
    success: false,
    message: '',
    data: {},
  };

  const object = request.body;

  /**
   * Missing Shop ID
   */
  if (!Object.prototype.hasOwnProperty.call(object, 'shop_id')) {
    response.message = 'Shop Id is Required';
    return response;
  }

  /**
   * If Item ID is set
   */
  if (
    Object.prototype.hasOwnProperty.call(object, 'inventory_id') &&
    mode === 'update'
  ) {
    response.data.inventory_id = object.inventory_id;
  }

  /**
   * If Name is Set
   */
  if (
    Object.prototype.hasOwnProperty.call(object, 'name') ||
    mode === 'update'
  ) {
    response.data.name = object.name;
  } else {
    response.message = 'Name is Required';
    return response;
  }

  /**
   * If Category is Set
   */
  if (
    Object.prototype.hasOwnProperty.call(object, 'category') ||
    mode === 'update'
  ) {
    response.data.category_id = object.category;
  } else {
    response.message = 'Category is Required';
    return response;
  }

  /**
   * If Price is Set
   */
  if (
    Object.prototype.hasOwnProperty.call(object, 'price') ||
    mode === 'update'
  ) {
    response.data.price = object.price;
  } else {
    response.message = 'Price is Required';
    return response;
  }

  /**
   * If Quantity is Set
   */
  if (
    Object.prototype.hasOwnProperty.call(object, 'quantity') ||
    mode === 'update'
  ) {
    response.data.quantity = object.quantity;
  } else {
    response.message = 'Quantity is Required';
    return response;
  }

  /**
   * If In Stock
   */
  if (
    Object.prototype.hasOwnProperty.call(object, 'in_stock') ||
    mode === 'update'
  ) {
    response.data.in_stock = Boolean(object.in_stock);
  }

  /**
   * If Image Url is set
   */
  if (
    Object.prototype.hasOwnProperty.call(object, 'image_path') ||
    mode === 'update'
  ) {
    response.data.image = object.image_path;
  }

  response.success = true;
  return response;
};

/**
 * Create an Item
 * @param {object} req
 * @param {object} res
 * @returns object
 */
const createInventoryAction = async (req, res) => {
  /**
   * Params Validation
   */
  const validation = await createUpdateInventoryParamValidator(req, 'create');
  if (!validation.success) {
    res.locals.errorMessage = JSON.stringify(validation);
    delete validation.data;
    return res.status(400).send(validation);
  }

  try {
    const response = await Services.InventoryService.createInventory(
      validation.data
    );
    /**
     * If Inventory Could Not be created
     */
    const returnResponse = {
      success: false,
      message: 'Item Could not be created',
    };
    res.locals.errorMessage = JSON.stringify(returnResponse);
    if (response === null) {
      return res.status(500).send(returnResponse);
    }
    /**
     * Item Created Successfully
     */
    const returnData = {
      success: true,
      message: 'Item Created Successfully',
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
      message: 'An error Occured while creating Item',
      data: error,
    };
    res.locals.errorMessage = JSON.stringify(response);
    return res.status(502).send(response);
  }
};

export default {
  getShopsAction,
  createShopAction,
  getShopByIdAction,
  createInventoryAction,
};
