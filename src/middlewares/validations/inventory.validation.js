import Joi from 'joi';
import Helpers from '../../utils/helpers';

/**
 * Get Inventory of Shop
 * @param {object} req
 * @returns object
 */
// eslint-disable-next-line consistent-return
const getAllInventoryValidator = async (req, res, next) => {
  /**
   * Get Shop Schema
   */
  const querySchema = Joi.object({
    in_stock: Joi.boolean().default(true),
    page_info: Joi.number().default(0),
    limit: Joi.number().min(1).max(25).default(10),
  });

  const paramSchema = Joi.object({
    shop_id: Joi.string().min(3).max(255).required(),
  });

  const isValidQuery = querySchema.validate(req.query);
  const isValidParam = paramSchema.validate(req.params);

  /**
   * Schema is Valid
   */
  if (!isValidQuery?.error && !isValidParam?.error) {
    /**
     * Updated Body Params as Required
     */
    const filter = isValidQuery.value;
    filter.shop_id = req.params.shop_id;

    req.body = filter;

    next();
  } else {
    return res.status(400).send({
      error:
        isValidQuery.error.details[0].message ||
        isValidParam.error.details[0].message,
    });
  }
};

/**
 * Get Inventory Validator
 * @param {object} req
 */
// eslint-disable-next-line consistent-return
const getInventoryValidator = async (req, res, next) => {
  /**
   * Get inventory
   */
  const paramSchema = Joi.object({
    shop_id: Joi.string().min(3).max(255).required(),
    inventory_id: Joi.string().min(3).max(255).required(),
  });

  const isValidParam = paramSchema.validate(req.params);

  /**
   * If Request is valid
   */
  if (!isValidParam?.error) {
    // Proceed to Route
    req.body = isValidParam.value;

    next();
  } else {
    return res.status(400).send({
      error: isValidParam.error.details[0].message,
    });
  }
};

/**
 * Create Inventory Validator
 * @param {object} req
 */
// eslint-disable-next-line consistent-return
const createInventoryValidator = async (req, res, next) => {
  /**
   * User ID set in Authentication
   */
  const { userId } = req.body;
  delete req.body.userId;

  /**
   * Create Schema
   */
  const bodySchema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    category_id: Joi.string().min(3).max(100).required(),
    price: Joi.number().precision(4).required(),
    quantity: Joi.number().integer().required(),
    in_stock: Joi.boolean().default(false),
    unit: Joi.string().min(2).max(20).required(),
    image: Joi.string()
      .min(3)
      .max(255)
      .default(
        'https://cdn.pixabay.com/photo/2015/12/09/17/11/vegetables-1085063_640.jpg'
      ),
  });

  const paramSchema = Joi.object({
    shop_id: Joi.string().min(3).max(255).required(),
  });

  const isValidBody = bodySchema.validate(req.body);
  const isValidParam = paramSchema.validate(req.params);

  /**
   * If Request is valid
   */
  if (!isValidBody?.error && !isValidParam?.error) {
    /**
     * Update Body Params as Required
     */
    req.body = isValidBody.value;
    req.body.shop_id = isValidParam.value.shop_id;
    req.body.owner_id = userId;

    /**
     * Checking if User is owner of Shop
     */
    const isOwnerOfShop = await Helpers.Validator.isOwnerOfShop(
      req.body.shop_id,
      userId
    );

    /**
     * If User is Owner of Shop
     */
    if (isOwnerOfShop) {
      next();
    } else {
      /**
       * User doesn't own the shop
       */
      return res.status(400).send({
        error: `User cannot Create Inventory in the shop`,
      });
    }
  } else {
    return res.status(400).send({
      error:
        isValidBody.error.details[0].message ||
        isValidParam.error.details[0].message,
    });
  }
};

/**
 * Update Inventory Validator
 * @param {object} req
 */
// eslint-disable-next-line consistent-return
const updateInventoryValidator = async (req, res, next) => {
  /**
   * User ID set in Authentication
   */
  const { userId } = req.body;
  delete req.body.userId;

  /**
   * Schema
   */
  const bodySchema = Joi.object({
    name: Joi.string().min(3).max(100),
    category_id: Joi.string().min(3).max(100),
    price: Joi.number().precision(4),
    quantity: Joi.number().integer(),
    in_stock: Joi.boolean().default(false),
    unit: Joi.string().min(2).max(20),
    image: Joi.string()
      .min(3)
      .max(255)
      .default(
        'https://cdn.pixabay.com/photo/2015/12/09/17/11/vegetables-1085063_640.jpg'
      ),
  });

  const paramSchema = Joi.object({
    shop_id: Joi.string().min(3).max(255).required(),
    inventory_id: Joi.string().min(3).max(255).required(),
  });

  const isValidBody = bodySchema.validate(req.body);
  const isValidParam = paramSchema.validate(req.params);

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

    /**
     * Checking if User is owner of Shop
     */
    const isOwnerOfShop = await Helpers.Validator.isOwnerOfShop(
      req.body.shop_id,
      userId
    );

    /**
     * If User is Owner of Shop
     */
    if (isOwnerOfShop) {
      next();
    } else {
      /**
       * User doesn't own the shop
       */
      return res.status(400).send({
        error: `User cannot Update Inventory in the shop`,
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
  getAllInventoryValidator,
  createInventoryValidator,
  getInventoryValidator,
  updateInventoryValidator,
};
