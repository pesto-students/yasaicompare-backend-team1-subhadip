import Joi from 'joi';

/**
 * Get All Cart Items of user
 * @param {object} req
 * @returns object
 */
// eslint-disable-next-line consistent-return
const getAllCartValidator = async (req, res, next) => {
  /**
   * User ID set in Authentication
   */
  const { userId } = req.body;
  delete req.body.userId;

  /**
   * Get Cart Schema
   */
  const querySchema = Joi.object({
    page_info: Joi.number().default(0),
    limit: Joi.number().min(1).max(25).default(10),
  });

  const isValidQuery = querySchema.validate(req.query);

  /**
   * Schema is Valid
   */
  if (!isValidQuery?.error) {
    /**
     * Updated Body Params as Required
     */
    const filter = {
      customer_id: userId,
    };

    req.body = filter;

    next();
  } else {
    return res.status(400).send({
      error: isValidQuery.error.details[0].message,
    });
  }
};

/**
 * Add Item in Cart Validator
 * @param {object} req
 */
// eslint-disable-next-line consistent-return
const addItemCartValidator = async (req, res, next) => {
  /**
   * User ID set in Authentication
   */
  const { userId } = req.body;
  delete req.body.userId;

  /**
   * Add2Cart Schema
   */
  const bodySchema = Joi.object({
    shop_id: Joi.string().min(3).max(255).required(),
    item_id: Joi.string().min(3).max(255).required(),
    quantity: Joi.number().integer().default(1),
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
    req.body.customer_id = userId;

    next();
  } else {
    return res.status(400).send({
      error: isValidBody.error.details[0].message,
    });
  }
};

/**
 * Update Item in Cart Validator
 * @param {object} req
 */
// eslint-disable-next-line consistent-return
const updateItemCartValidator = async (req, res, next) => {
  /**
   * User ID set in Authentication
   */
  delete req.body.userId;

  /**
   * Update Cart Schema
   */
  const bodySchema = Joi.object({
    quantity: Joi.number().integer().required(),
  });

  const paramSchema = Joi.object({
    id: Joi.string().min(3).max(255).required(),
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
    req.body.cart_id = isValidParam.value.id;

    next();
  } else {
    return res.status(400).send({
      error:
        isValidBody.error.details[0].message ||
        isValidParam.error.details[0].message,
    });
  }
};

/**
 * Delete Item from Cart Validator
 * @param {object} req
 */
// eslint-disable-next-line consistent-return
const deleteItemCartValidator = async (req, res, next) => {
  /**
   * User ID set in Authentication
   */
  const { userId } = req.body;
  delete req.body.userId;

  /**
   * Schema
   */
  const paramSchema = Joi.object({
    id: Joi.string().min(3).max(255).required(),
  });

  const isValidParam = paramSchema.validate(req.params);

  /**
   * If Request is valid
   */
  if (!isValidParam?.error) {
    /**
     * Update Body Params as Required
     */

    const filter = {
      cart_id: isValidParam.value.id,
      customer_id: userId,
    };
    req.body = filter;

    next();
  } else {
    return res.status(400).send({
      error: isValidParam?.error.details[0].message,
    });
  }
};

export default {
  getAllCartValidator,
  addItemCartValidator,
  updateItemCartValidator,
  deleteItemCartValidator,
};
