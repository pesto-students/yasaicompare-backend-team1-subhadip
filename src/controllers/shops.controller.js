import sequelize from 'sequelize';
import Services from '../services';
import Helpers from '../utils/helpers';

/**
 * Attributes for Shop to return
 */
const attributes = [
  'shop_id',
  'name',
  'address',
  'city',
  'state',
  'pincode',
  'country',
  'gstin',
  'home_delievery_distance',
  'home_delievery_cost',
  'image',
  'longitude',
  'latitude',
  'active',
];

const Operator = sequelize.Op;

/**
 * Get All Shops (vendor)
 * @param {object} req
 * @param {object} res
 * @returns object
 */
const getShopsAction = async (req, res) => {
  /**
   * Destructuring Query
   */
  const { active, limit, latitude, longitude, pincode, distance } = req.body;
  const pageInfo = req.body.page_info;
  const parsedPincode = parseInt(pincode);

  /**
   * Filter Data
   */
  const filter = {
    where: {
      active,
      pincode: {
        [Operator.between]: [parsedPincode - distance, parsedPincode + distance],
      },
    },
    attributes,
    offset: pageInfo,
    limit,
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

    const shopData = shops.map((shop) => {
      const updatedShop = shop.dataValues;

      const userLocation = {
        latitude,
        longitude,
      };

      const shopLocation = {
        latitude: updatedShop.latitude,
        longitude: updatedShop.longitude,
      };

      const distance = Helpers.DistanceHelper.getDistanceOfShop(
        userLocation,
        shopLocation
      );

      delete updatedShop.latitude;
      delete updatedShop.longitude;
      updatedShop.distance = distance;

      return updatedShop;
    });

    /**
     * Shops Found
     */
    const returnData = {
      shops: shopData,
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
  /**
   * Dsstructuring Params
   */
  const { id } = req.params;
  const { latitude, longitude, pincode } = req.query;

  try {
    const response = await Services.ShopsService.getShopById(id, {
      attributes,
    });

    /**
     * If Shop Could Not be Found
     */
    if (response === null) {
      const returnResponse = {
        error: 'Shop not found',
      };
      return res.status(404).send(returnResponse);
    }

    if (response.dataValues.pincode !== pincode) {
      return res.status(404).send({
        error: 'Sorry the Shop Cannot deliever to your address',
      });
    }

    /**
     * Shop Found
     */
    const updatedShop = response.dataValues;

    const userLocation = {
      latitude,
      longitude,
    };

    const shopLocation = {
      latitude: updatedShop.latitude,
      longitude: updatedShop.longitude,
    };

    const distance = Helpers.DistanceHelper.getDistanceOfShop(
      userLocation,
      shopLocation
    );

    delete updatedShop.latitude;
    delete updatedShop.longitude;
    updatedShop.distance = distance;

    return res.status(200).send(updatedShop);
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
 * Create shop (vendor)
 * @param {object} req
 * @param {object} res
 * @returns object
 */
const registerShopAction = async (req, res) => {
  /**
   * Destructuring Body
   */
  const { body } = req;

  try {
    const response = await Services.ShopsService.createShop(body, {
      attributes,
    });

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
 * Update shop (vendor)
 * @param {object} req
 * @param {object} res
 * @returns object
 */
const updateShopAction = async (req, res) => {
  /**
   * Destructuring Body
   */
  const { body } = req.body;

  const filter = {
    where: req.body.filter,
    attributes,
  };

  try {
    const response = await Services.ShopsService.updateShopById(body, filter);

    /**
     * If Shop Could Not be updated
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
