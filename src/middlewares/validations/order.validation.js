import Joi from 'joi';

/**
 * Get Orders Validator for Customer
 * @param {object} req
 * @returns object
 */
// eslint-disable-next-line consistent-return
const getOrdersValidator = async (req, res, next) => {
  /**
   * User ID set in Authentication
   */
  const { userId } = req.body;
  delete req.body.userId;

  /**
   * Get Shop Schema
   */
  const querySchema = Joi.object({
    page_info: Joi.number().default(0),
    limit: Joi.number().min(1).max(10).default(5),
    order_status: Joi.string().min(2).max(50),
    payment_status: Joi.string().min(2).max(50),
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
    filter.customer_id = userId;

    req.body = filter;

    next();
  } else {
    return res.status(400).send({
      error: isValidQuery.error.details[0].message,
    });
  }
};

/**
 * Get Order Validator
 * @param {object} req
 */
// eslint-disable-next-line consistent-return
const getOrderValidator = async (req, res, next) => {
  /**
   * User ID set in Authentication
   */
  const { userId } = req.body;

  /**
   * Get Shop
   */
  const paramSchema = Joi.object({
    id: Joi.string().min(3).max(255).required(),
  });

  const isValidParam = paramSchema.validate(req.params);

  /**
   * If Request is valid
   */
  if (!isValidParam?.error) {
    // Proceed to Route
    const filter = {
      order_group_id: isValidParam.value.id,
      customer_id: userId,
    };

    req.body = filter;

    next();
  } else {
    return res.status(400).send({
      error: isValidParam.error.details[0].message,
    });
  }
};

/**
 * Create Order Validator
 * @param {object} req
 */
// eslint-disable-next-line consistent-return
const createOrderValidator = async (req, res, next) => {
  const { userId } = req.body;
  delete req.body.userId;

  /**
   * Prepared Response
   */
  const preparedResponse = {};

  preparedResponse.customer_id = userId;

  const ordersSchema = Joi.object().keys({
    orders: Joi.array().required(),
    delievery_address: Joi.string().min(3).max(255).required(),
  });
  const isValidOrdersSchema = ordersSchema.validate(req.body);

  /**
   * If Order Schema is incorrect
   */
  if (isValidOrdersSchema?.error) {
    return res.status(400).send({
      error: isValidOrdersSchema.error.details[0].message,
    });
  }

  const formattedOrder = isValidOrdersSchema.value.orders.map((order) => {
    const orderSchema = Joi.object().keys({
      shop_id: Joi.string().min(3).max(255).required(),
      items: Joi.array().required(),
    });

    const isValidOrderSchema = orderSchema.validate(order);

    if (isValidOrderSchema?.error) {
      return false;
    }

    const items = isValidOrderSchema.value.items.map((item) => {
      /**
       * Item Schema
       */
      const itemSchema = Joi.object({
        item_id: Joi.string().min(3).max(255).required(),
        quantity: Joi.number().precision(0).default(1),
      });

      const isValidItem = itemSchema.validate(item);

      if (isValidItem?.error) {
        return false;
      }
      return isValidItem.value;
    });

    const data = {
      shop_id: isValidOrderSchema.value.shop_id,
      items,
    };

    return data;
  });

  req.body = {
    orders: formattedOrder,
    customer_id: userId,
    delieveryAddress: isValidOrdersSchema.value.delievery_address,
  };
  next();
};

/**
 * Confirm Order Validator
 * @param {object} req
 * @param {object} res
 * @param {function} next
 */
const confirmOrderValidator = async (req, res, next) => {
  /**
   * User Id set in Authentication
   */
  const { userId } = req.body;

  const querySchema = Joi.object({
    user_token: Joi.string().min(3).max(255).required(),
    order_group_id: Joi.string().min(3).max(255).required(),
    payment_intent: Joi.string().min(3).max(255).required(),
    payment_intent_client_secret: Joi.string().min(3).max(255).required(),
    redirect_status: Joi.string().min(3).max(20).required(),
  });

  const isValidQuery = querySchema.validate(req.query);

  if (!isValidQuery?.error) {
    const filter = isValidQuery.value;
    filter.customer_id = userId;

    req.body = filter;

    next();
  } else {
    return res.status(400).send({
      error: isValidQuery.error.details[0].message,
    });
  }
};

/**
 * Delete Order Validator
 * @param {objectDelete Order Validator} req
 * @param {functionject} res
 */
const deleteOrderValidator = async (req, res, next) => {
  /**
   * User Id set in Authentication
   */
  const { userId } = req.body;
  delete req.body.userId;

  const paramSchema = Joi.object({
    id: Joi.string().min(3).max(255).required(),
  });
  const isValidParam = paramSchema.validate(req.params);

  if (!isValidParam?.error) {
    const filter = {
      customer_id: userId,
      order_group_id: isValidParam.value.id,
    };

    req.body = filter;
    next();
  } else {
    return res.status(400).send({
      error: isValidParam.error.details[0].message,
    });
  }
};

/**
 * Update Order User
 * @param {object} req
 * @param {object} res
 * @param {*} next
 */
const updateOrderValidator = async (req, res, next) => {
  /**
   * User ID set in Authentication
   */
  const { userId } = req.body;
  delete req.body.userId;

  /**
   * Param Schema
   */
  const paramSchema = Joi.object({
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
     * Update Body
     */
    const filter = {
      customer_id: userId,
      order_group_id: isValidParam.value.order_id,
    };

    const data = isValidBody.value;

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
  getOrdersValidator,
  createOrderValidator,
  getOrderValidator,
  confirmOrderValidator,
  deleteOrderValidator,
  updateOrderValidator,
};
