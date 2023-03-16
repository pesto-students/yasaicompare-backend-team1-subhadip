import Joi from 'joi';

/**
 * Get Shops Validator
 * @param {object} req
 * @returns object
 */
// eslint-disable-next-line consistent-return
const getShopsValidator = async (req, res, next) => {
  /**
   * User ID set in Authentication
   */
  const { userId } = req.body;
  delete req.body.userId;

  /**
   * Get Shop Schema
   */
  const querySchema = Joi.object({
    active: Joi.boolean().default(true),
    page_info: Joi.number().default(0),
    limit: Joi.number().min(1).max(10).default(5),
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
    filter.owner_id = userId;

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
  const { userId } = req.body;
  delete req.body.userId;

  /**
   * Get Shop
   */
  const paramSchema = Joi.object({
    shop_id: Joi.string().min(3).max(255).required(),
  });

  const isValidParam = paramSchema.validate(req.params);

  /**
   * If Request is valid
   */
  if (!isValidParam?.error) {
    const filter = isValidParam.value;
    filter.owner_id = userId;

    req.body = filter;
    next();
  } else {
    return res.status(400).send({
      error: isValidParam.error.details[0].message,
    });
  }
};

/**
 * Get Shops Validator
 * @param {object} req
 * @returns object
 */
// eslint-disable-next-line consistent-return
const getShopOrdersValidator = async (req, res, next) => {
  /**
   * User ID set in Authentication
   */
  // const { userId } = req.body;
  delete req.body.userId;

  /**
   * Param Schema
   */
  const paramSchema = Joi.object({
    shop_id: Joi.string().min(3).max(100),
  });

  /**
   * Get Order Schema
   */
  const querySchema = Joi.object({
    page_info: Joi.number().default(0),
    limit: Joi.number().min(1).max(10).default(5),
    order_status: Joi.string().min(3).max(50),
    payment_status: Joi.string().min(3).max(50),
    customer_id: Joi.string().min(3).max(100),
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
    filter.shop_id = isValidParam.value.shop_id;

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
 * Get Shop Order Validator
 * @param {object} req
 */
// eslint-disable-next-line consistent-return
const getShopOrderValidator = async (req, res, next) => {
  /**
   * User ID set in Authentication
   */
  // const { userId } = req.body;
  delete req.body.userId;

  /**
   * Param Schema
   */
  const paramSchema = Joi.object({
    shop_id: Joi.string().min(3).max(100),
    order_id: Joi.string().min(3).max(100),
  });

  const isValidParam = paramSchema.validate(req.params);

  /**
   * Schema is Valid
   */
  if (!isValidParam?.error) {
    /**
     * Updated Body Params as Required
     */
    const filter = isValidParam.value;

    req.body = filter;

    next();
  } else {
    return res.status(400).send({
      error: isValidParam.error.details[0].message,
    });
  }
};

/**
 * Update Shop Order Validator
 * @param {object} req
 */
// eslint-disable-next-line consistent-return
const updateShopOrderValidator = async (req, res, next) => {
  /**
   * User ID set in Authentication
   */
  // const { userId } = req.body;
  delete req.body.userId;

  /**
   * Param Schema
   */
  const paramSchema = Joi.object({
    shop_id: Joi.string().min(3).max(100).required(),
    order_id: Joi.string().min(3).max(100).required(),
  });

  /**
   * Body Schema
   */
  const bodySchema = Joi.object({
    order_status: Joi.string().min(3).max(50).required(),
  });

  const isValidParam = paramSchema.validate(req.params);
  const isValidBody = bodySchema.validate(req.body);

  /**
   * Schema is Valid
   */
  if (!isValidParam?.error && !isValidBody?.error) {
    /**
     * Updated Body Params as Required
     */
    const filter = isValidParam.value;
    const data = isValidParam.value;

    req.body = {
      filter,
      data,
    };

    next();
  } else {
    return res.status(400).send({
      error:
        isValidParam.error.details[0].message ||
        isValidBody.error.details[0].message,
    });
  }
};

export default {
  getShopValidator,
  getShopsValidator,
  getShopOrdersValidator,
  getShopOrderValidator,
  updateShopOrderValidator,
};
