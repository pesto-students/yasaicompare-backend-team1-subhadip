import Joi from 'joi';
/**
 * Get User Validator
 * @param {object} req
 */
// eslint-disable-next-line consistent-return
const getUserValidator = async (req, res, next) => {
  next();
};

const createAddressValidator = (req, res, next) => {
  const { body } = req;

  /**
   * Create Address Schema
   */
  const bodySchema = Joi.object({
    address_line_1: Joi.string().min(3).max(255).required(),
    address_line_2: Joi.string().min(3).max(255).required(),
    city: Joi.string().min(3).max(255).required(),
    state: Joi.string().min(3).max(255).required(),
    country: Joi.string().min(3).max(255).required(),
    pincode: Joi.number().required(),
    user_id: Joi.string().uuid().required(),
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
    next();
  } else {
    return res.status(400).send({
      error: isValidBody.error.details[0].message,
    });
  }
};

const updateAddressValidator = (req, res, next) => {
  const { body } = req;

  /**
   * Create Address Schema
   */
  const bodySchema = Joi.object({
    address_line_1: Joi.string().min(3).max(255).optional(),
    address_line_2: Joi.string().min(3).max(255).optional(),
    city: Joi.string().min(3).max(255).optional(),
    state: Joi.string().min(3).max(255).optional(),
    country: Joi.string().min(3).max(255).optional(),
    pincode: Joi.number().optional(),
    user_id: Joi.string().uuid().optional(),
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
    next();
  } else {
    return res.status(400).send({
      error: isValidBody.error.details[0].message,
    });
  }
};

export default {
  getUserValidator,
  createAddressValidator,
  updateAddressValidator,
};
