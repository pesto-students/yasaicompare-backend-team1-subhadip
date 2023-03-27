import Joi from 'joi';

/**
 * Get User Validator
 * @param {object} req
 */
// eslint-disable-next-line consistent-return
const getUserValidator = async (req, res, next) => {
  /**
   * User ID set in Authentication
   */

  next();
};

/**
 * Get Addresses Validator
 * @param {object} req
 */
// eslint-disable-next-line consistent-return
const getAddressesValidator = async (req, res, next) => {
  /**
   * User ID set in Authentication
   */
  const { userId } = req.body;
  delete req.body.userId;

  /**
   * Get User Schema
   */
  const querySchema = Joi.object({
    page_info: Joi.number().default(0),
    limit: Joi.number().min(1).max(10).default(10),
  });

  const isValidQuery = querySchema.validate(req.query);

  if (!isValidQuery?.error) {
    const filter = isValidQuery.value;
    filter.userId = userId;

    req.body = filter;
    next();
  } else {
    return res.status(400).send({
      error: isValidQuery.error.details[0].message,
    });
  }
};

/**
 * Get Address Validator
 * @param {object} req
 * @param {object} res
 * @param {function} next
 */
const getAddressValidator = async (req, res, next) => {
  /**
   * User ID set in Authentication
   */
  const { userId } = req.body;
  delete req.body.userId;

  const paramSchema = Joi.object({
    id: Joi.string().min(3).max(255).required(),
  });
  const isValidParam = paramSchema.validate(req.params);

  if (!isValidParam?.error) {
    const filter = isValidParam.value;
    filter.user_id = userId;

    req.body = filter;
    next();
  } else {
    return res.status(400).send({
      error: isValidParam.error.details[0].message,
    });
  }
};

/**
 * Create Address Validator
 * @param {object} req
 * @param {object} res
 * @param {func} next
 * @returns
 */
const createAddressValidator = (req, res, next) => {
  /**
   * User ID set in Authentication
   */
  const { userId } = req.body;
  delete req.body.userId;

  const { body } = req;

  /**
   * Create Address Schema
   */
  const bodySchema = Joi.object({
    address_line_1: Joi.string().min(3).max(255).required(),
    address_line_2: Joi.string().min(3).max(255).default(''),
    city: Joi.string().min(3).max(255).required(),
    state: Joi.string().min(3).max(255).required(),
    country: Joi.string().min(3).max(255).required(),
    pincode: Joi.number().required(),
    name: Joi.string().min(3).max(255).required(),
    address: Joi.string().min(3).max(100).required(),
    latitude: Joi.number().precision(10).required(),
    longitude: Joi.number().precision(10).required(),
    active: Joi.boolean().default(true),
  });

  const isValidBody = bodySchema.validate(body);

  /**
   * If Request is valid
   */
  if (!isValidBody?.error) {
    req.body = isValidBody.value;
    req.body.user_id = userId;

    next();
  } else {
    return res.status(400).send({
      error: isValidBody.error.details[0].message,
    });
  }
};

/**
 * Update Address
 * @param {object} req
 * @param {object} res
 * @param {func} next
 * @returns
 */
const updateAddressValidator = (req, res, next) => {
  /**
   * User ID set in Authentication
   */
  const { userId } = req.body;
  delete req.body.userId;

  const { body } = req;

  /**
   * Update Address Schema
   */
  const bodySchema = Joi.object({
    id: Joi.string().min(3).max(255).required(),
    address_line_1: Joi.string().min(3).max(255).optional(),
    address_line_2: Joi.string().min(3).max(255).optional(),
    city: Joi.string().min(3).max(255).optional(),
    state: Joi.string().min(3).max(255).optional(),
    country: Joi.string().min(3).max(255).optional(),
    pincode: Joi.number().optional(),
    name: Joi.string().min(3).max(255).optional(),
    address: Joi.string().min(3).max(100).optional(),
    latitude: Joi.number().precision(10).optional(),
    longitude: Joi.number().precision(10).optional(),
    active: Joi.boolean().optional(),
  });

  const isValidBody = bodySchema.validate(body);

  /**
   * If Request is valid
   */
  if (!isValidBody?.error) {
    req.body = isValidBody.value;
    req.body.user_id = userId;

    next();
  } else {
    return res.status(400).send({
      error: isValidBody.error.details[0].message,
    });
  }
};

export default {
  getUserValidator,
  getAddressesValidator,
  getAddressValidator,
  createAddressValidator,
  updateAddressValidator,
};
