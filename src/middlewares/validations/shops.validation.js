import Joi from 'joi';
import Helpers from '../../utils/helpers';

/**
 * Get Shops Validator
 * @param {object} req
 * @returns object
 */
// eslint-disable-next-line consistent-return
const getShopsValidator = async (req, res, next) => {
  /**
   * Get Shop Schema
   */
  const querySchema = Joi.object({
    active: Joi.boolean().default(true),
    page_info: Joi.number().default(0),
    limit: Joi.number().min(1).max(10).default(5),
    latitude: Joi.number().precision(10).required(),
    longitude: Joi.number().precision(10).required(),
    pincode: Joi.string().min(6).max(6).required(),
    distance: Joi.number().min(1).max(10).default(1),
  });

  const isValidQuery = querySchema.validate(req.query);

  /**
   * Schema is Valid
   */
  if (!isValidQuery?.error) {
    /**
     * Updated Body Params as Required
     */
    const filter = isValidQuery.value;

    req.body = filter;

    next();
  } else {
    return res.status(400).send({
      error: isValidQuery.error.details[0].message,
    });
  }
};

/**
 * Get Shop Validator
 * @param {object} req
 */
// eslint-disable-next-line consistent-return
const getShopValidator = async (req, res, next) => {
  /**
   * User ID set in Authentication
   */
  // const { userId } = req.body;
  delete req.body.userId;

  /**
   * Get Shop
   */
  const paramSchema = Joi.object({
    id: Joi.string().min(3).max(255).required(),
  });
  const querySchema = Joi.object({
    latitude: Joi.number().precision(10).required(),
    longitude: Joi.number().precision(10).required(),
    pincode: Joi.string().min(5).max(8).required(),
  });

  const isValidParam = paramSchema.validate(req.params);
  const isValidQuery = querySchema.validate(req.query);

  /**
   * If Request is valid
   */
  if (!isValidParam?.error && !isValidQuery?.error) {
    // Proceed to Route
    next();
  } else {
    return res.status(400).send({
      error:
        isValidQuery?.error.details[0].message ||
        isValidParam?.error.details[0].message,
    });
  }
};

/**
 * Register Shop Validator
 * @param {object} req
 */
// eslint-disable-next-line consistent-return
const registerShopValidator = async (req, res, next) => {
  /**
   * User ID set in Authentication
   */
  const { userId } = req.body;
  delete req.body.userId;

  /**
   * Register Schema
   */
  const bodySchema = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    address: Joi.string().min(3).max(100).required(),
    city: Joi.string().min(3).max(100).required(),
    state: Joi.string().min(3).max(100).required(),
    pincode: Joi.string().min(5).max(8).required(),
    country: Joi.string().min(2).max(10).required(),
    gstin: Joi.string().min(2).max(30),
    home_delievery_cost: Joi.number().precision(4).default(3.52),
    home_delievery_distance: Joi.number().integer().default(1),
    image: Joi.string()
      .min(3)
      .max(255)
      .default(
        'https://cdn.pixabay.com/photo/2015/12/09/17/11/vegetables-1085063_640.jpg'
      ),
    latitude: Joi.number().precision(10).required(),
    longitude: Joi.number().precision(10).required(),
    active: Joi.boolean().default(true),
  });

  const isValidBody = bodySchema.validate(req.body);

  /**
   * If Request is valid
   */
  if (!isValidBody?.error) {
    /**
     * Update Body Params as Required
     */
    req.body = isValidBody.value;
    req.body.owner_id = userId;

    next();
  } else {
    return res.status(400).send({
      error: isValidBody.error.details[0].message,
    });
  }
};

/**
 * Update Shop Validator
 * @param {object} req
 */
// eslint-disable-next-line consistent-return
const updateShopValidator = async (req, res, next) => {
  /**
   * User ID set in Authentication
   */
  const { userId } = req.body;
  delete req.body.userId;

  /**
   * Shop Id Missing
   */
  const paramSchema = Joi.object({
    id: Joi.string().min(3).max(255).required(),
  });
  const isValidParam = paramSchema.validate(req.params);

  /**
   * Shop Schema
   */
  const bodySchema = Joi.object({
    name: Joi.string().min(3).max(255),
    address: Joi.string().min(3).max(100),
    city: Joi.string().min(3).max(100),
    state: Joi.string().min(3).max(100),
    pincode: Joi.string().min(5).max(8),
    country: Joi.string().min(2).max(10),
    gstin: Joi.string().min(2).max(30),
    home_delievery_cost: Joi.number().precision(4).default(3.52),
    home_delievery_distance: Joi.number().integer().default(1),
    image: Joi.string()
      .min(3)
      .max(255)
      .default(
        'https://cdn.pixabay.com/photo/2015/12/09/17/11/vegetables-1085063_640.jpg'
      ),
    latitude: Joi.number().precision(10),
    longitude: Joi.number().precision(10),
    active: Joi.boolean().default(true),
  });
  const isValidBody = bodySchema.validate(req.body);

  /**
   * If Request is valid
   */
  if (!isValidBody?.error && !isValidParam?.error) {
    /**
     * Update Body Params as Required
     */

    const filter = {
      filter: {
        owner_id: userId,
        shop_id: isValidParam.value.id,
      },
      body: isValidBody.value,
    };
    req.body = filter;

    // Await to Resolve the Promise
    const isOwnerOfShop = await Helpers.Validator.isOwnerOfShop(
      filter.filter.shop_id,
      userId
    );

    /**
     * If Users Owner of Shop
     */
    if (isOwnerOfShop) {
      next();
    } else {
      /**
       * User doesn't own the shop
       */
      return res.status(400).send({
        error: `User cannot update the shop`,
      });
    }
  } else {
    return res.status(400).send({
      error:
        isValidBody?.error.details[0].message ||
        isValidParam?.error.details[0].message,
    });
  }
};

export default {
  registerShopValidator,
  getShopValidator,
  updateShopValidator,
  getShopsValidator,
};
