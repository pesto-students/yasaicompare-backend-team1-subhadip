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
  });
  const isValidOrdersSchema = ordersSchema.validate(req.body);

  /**
   * If Order Key is Missing
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
      order_status: Joi.string().min(5).max(50).default('pending'),
      payment_status: Joi.string().min(5).max(50).default('pending'),
      amount: Joi.number().precision(3),
      delievey_charger: Joi.number().precision(3),
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
        amount: Joi.number().precision(2).default(0.0),
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
  };
  next();
};

export default {
  getOrdersValidator,
  createOrderValidator,
  getOrderValidator,
};
