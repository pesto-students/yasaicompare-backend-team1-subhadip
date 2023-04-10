import Services from '../services';

/**
 * Attributes for Inventory to return
 */
const attributes = [
  ['inventory_id', 'item_id'],
  'shop_id',
  'name',
  'price',
  'quantity',
  'in_stock',
  'image',
  'unit',
];

/**
 * Get All Items of Shop
 * @param {object} req
 * @param {object} res
 * @returns object
 */
const getAllInventoryAction = async (req, res) => {
  /**
   * Destructuring Query
   */
  const { limit } = req.body;
  const inStock = req.body.in_stock;
  const pageInfo = req.body.page_info;

  /**
   * Filter Data
   */
  const filter = {
    where: {
      in_stock: inStock,
      shop_id: req.body.shop_id,
    },
    attributes,
    offset: pageInfo,
    limit,
  };

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
        error: 'Shop inventory not found',
      };
      return res.status(404).send(returnResponse);
    }

    /**
     * Inventory Found
     */
    const returnData = {
      inventory,
    };
    res.locals.errorMessage = JSON.stringify(returnData);

    return res.status(200).send(returnData);
  } catch (error) {
    /**
     * Error Occured
     */
    const response = {
      message: 'An error Occured while retrieving Inventory',
      data: error,
    };

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
   * Filter Data
   */
  const filter = {
    where: {
      shop_id: req.params.shop_id,
      inventory_id: req.params.inventory_id,
    },
    attributes,
  };

  try {
    const response = await Services.InventoryService.getInventoryById(filter);

    /**
     * If Inventory Could Not be Found
     */
    if (response === null) {
      const returnResponse = {
        error: 'Inventory item not found',
      };
      return res.status(404).send(returnResponse);
    }

    /**
     * Inventory Found
     */
    const returnData = {
      response,
    };

    return res.status(200).send(returnData);
  } catch (error) {
    /**
     * Error Occured
     */
    const response = {
      error: 'An error Occured while retrieving Inventory Item',
      data: error,
    };

    return res.status(500).send(response);
  }
};

/**
 * Create an Item
 * @param {object} req
 * @param {object} res
 * @returns object
 */
const createInventoryAction = async (req, res) => {
  try {
    const response = await Services.InventoryService.createInventory(req.body, {
      attributes,
    });

    /**
     * If Inventory Could Not be created
     */
    const returnResponse = {
      error: 'Inventory Could not be created',
    };
    if (response === null) {
      return res.status(500).send(returnResponse);
    }

    /**
     * Item Created Successfully
     */
    const returnData = {
      message: 'Inventory Created Successfully',
      data: response,
    };
    return res.status(201).send(returnData);
  } catch (error) {
    /**
     * Error Occured
     */
    const response = {
      error: 'An error Occured while creating Inventory',
      data: error,
    };

    return res.status(500).send(response);
  }
};

/**
 * Update an Item
 * @param {object} req
 * @param {object} res
 * @returns object
 */
const updateInventoryAction = async (req, res) => {
  /**
   * Destructuring Body
   */
  const { body } = req.body;

  const filter = {
    where: req.body.filter,
    attributes,
  };

  try {
    let response = await Services.InventoryService.updateInventory(
      body,
      filter
    );

    /**
     * If Inventory Could Not be updated
     */
    const returnResponse = {
      error: 'Inventory Could not be updated',
    };
    if (response === null) {
      return res.status(500).send(returnResponse);
    }

    response = await Services.InventoryService.getInventoryById(
      req.body.filter.inventory_id,
      { attributes }
    );

    /**
     * Item Created Successfully
     */
    const returnData = {
      message: 'Inventory updated Successfully',
      data: response,
    };
    return res.status(201).send(returnData);
  } catch (error) {
    /**
     * Error Occured
     */
    const response = {
      error: 'An error Occured while updating Inventory',
      data: error,
    };

    return res.status(500).send(response);
  }
};

export default {
  getAllInventoryAction,
  getInventoryByIdAction,
  createInventoryAction,
  updateInventoryAction,
};
