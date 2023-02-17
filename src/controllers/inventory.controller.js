// import querystring from 'querystring';
import Services from '../services';

/**
 * Get All Items
 * @param {object} req
 * @param {object} res
 * @returns object
 */
const getAllInventoryAction = async (req, res) => {
  /**
   * Missing Shop ID
   */
  if (!Object.prototype.hasOwnProperty.call(req.query, 'shop_id')) {
    const response = { success: false };
    response.message = 'Shop Id is Required';
    res.locals.errorMessage = JSON.stringify(response);
    return res.status(400).send(response);
  }

  /**
   * Filter Data
   */
  const filter = {
    where: {
      shop_id: req.query.shop_id,
    },
    // attributes: [
    //   'shop_id',
    //   'name',
    //   'home_delievery_distance',
    //   'home_delievery_cost',
    //   'active',
    // ],
  };

  /**
   * If in stock Set
   */
  if (Object.prototype.hasOwnProperty.call(req.query, 'in_stock')) {
    filter.where.in_stock = req.query.in_stock.toLowerCase() === 'true';
  }

  try {
    /**
     * Hitting Service
     */
    const inventory = await Services.InventoryService.getAllInventory(filter);

    /**
     * If Inventory Could Not be Found
     */
    if (inventory === null) {
      const returnResponse = {
        success: false,
        message: 'Inventory not found',
      };
      res.locals.errorMessage = JSON.stringify(returnResponse);
      return res.status(404).send(returnResponse);
    }

    /**
     * Inventory Found
     */
    const returnData = {
      success: true,
      message: `Inventory Found`,
      data: inventory,
    };
    res.locals.errorMessage = JSON.stringify(returnData);

    return res.status(200).send(returnData);
  } catch (error) {
    /**
     * Error Occured
     */
    const response = {
      success: false,
      message: 'An error Occured while retrieving Inventory',
      data: error,
    };
    res.locals.errorMessage = JSON.stringify(response);

    return res.status(500).send(response);
  }
};

/**
 * Get Inventory By ID
 * @param {object} req
 * @param {object} res
 * @returns object
 */
const getInventoryByIdAction = async (req, res) => {
  /**
   * Missing Shop ID
   */
  if (!Object.prototype.hasOwnProperty.call(req.params, 'shop_id')) {
    const response = { success: false, message: 'Shop Id is Required' };
    res.locals.errorMessage = JSON.stringify(response);
    return res.status(400).send(response);
  }

  /**
   * Inventory Id is Required
   */
  if (!Object.prototype.hasOwnProperty.call(req.query, 'item_id')) {
    const validationResponse = {
      success: false,
      message: 'Item Id is Required',
    };
    res.locals.errorMessage = JSON.stringify(validationResponse);
    return res.status(400).send(validationResponse);
  }

  /**
   * Filter Data
   */
  const filter = {
    where: {
      shop_id: req.params.shop_id,
      inventory_id: req.query.item_id,
    },
  };

  try {
    const response = await Services.InventoryService.getAllInventory(filter);

    /**
     * If Inventory Could Not be Found
     */
    if (response === null) {
      const returnResponse = {
        success: false,
        message: 'Inventory not found',
      };
      res.locals.errorMessage = JSON.stringify(returnResponse);
      return res.status(404).send(returnResponse);
    }

    /**
     * Inventory Found
     */
    const returnData = {
      success: true,
      message: `Inventory Found`,
      data: response,
    };
    res.locals.errorMessage = JSON.stringify(returnData);

    return res.status(200).send(returnData);
  } catch (error) {
    /**
     * Error Occured
     */
    console.log(error);
    const response = {
      success: false,
      message: 'An error Occured while retrieving Inventory Item',
      data: error,
    };
    res.locals.errorMessage = JSON.stringify(response);

    return res.status(500).send(response);
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
  response.data.shop_id = object.shop_id;

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
    response.data.in_stock = object.in_stock.toLowerCase() === 'true';
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

    return res.status(500).send(response);
  }
};

export default {
  getAllInventoryAction,
  getInventoryByIdAction,
  createInventoryAction,
};
