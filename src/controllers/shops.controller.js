import Services from '../services';

/**
 * Get All Shops for vendot
 * @param {object} req
 * @param {object} res
 * @returns object
 */
const getShopsAction = async (req, res) => {
  /**
   * Filter Data
   */
  const filter = {
    where: req.body,
    attributes: [
      'shop_id',
      'name',
      'home_delievery_distance',
      'home_delievery_cost',
      'active',
    ],
  };

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
        error: 'Shop(s) not found',
      };
      return res.status(404).send(returnResponse);
    }

    /**
     * Shops Found
     */
    const returnData = {
      shops,
    };

    return res.status(200).send(returnData);
  } catch (error) {
    /**
     * Error Occured
     */
    const response = {
      error: 'An error Occured while retrieving Shop(s)',
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
  const { id } = req.params;
  try {
    const response = await Services.ShopsService.getShopById(id);

    /**
     * If Shop Could Not be Found
     */
    if (response === null) {
      const returnResponse = {
        error: 'Shop not found',
      };
      return res.status(404).send(returnResponse);
    }

    /**
     * Shop Found
     */
    const returnData = response;

    return res.status(200).send(returnData);
  } catch (error) {
    /**
     * Error Occured
     */
    const response = {
      error: 'An error Occured while retrieving Shop',
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
    if (response === null) {
      const returnResponse = {
        error: 'Shop Could not be created',
      };
      return res.status(500).send(returnResponse);
    }

    /**
     * Shop Created Successfully
     */
    const returnData = {
      message: 'Shop Created Successfully',
      data: response,
    };

    return res.status(201).send(returnData);
  } catch (error) {
    /**
     * Error Occured
     */
    const response = {
      error: 'An error Occured while creating Shop',
      data: error,
    };

    return res.status(502).send(response);
  }
};

/**
 * Update shop
 * @param {object} req
 * @param {object} res
 * @returns object
 */
const updateShopAction = async (req, res) => {
  /**
   * Destructuring Body
   */
  const { body, filter } = req.body;

  try {
    const response = await Services.ShopsService.updateShopById(body, filter);

    /**
     * If Shop Could Not be created
     */
    if (response === null) {
      const returnResponse = {
        error: 'Shop Could not be updated',
      };
      return res.status(500).send(returnResponse);
    }

    /**
     * Shop Created Successfully
     */
    const returnData = {
      message: 'Shop updated Successfully',
      data: response,
    };

    return res.status(201).send(returnData);
  } catch (error) {
    /**
     * Error Occured
     */
    const response = {
      error: 'An error Occured while updating Shop',
      data: error,
    };

    return res.status(502).send(response);
  }
};

export default {
  getShopsAction,
  registerShopAction,
  getShopByIdAction,
  updateShopAction,
};
