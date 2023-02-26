import Joi from 'joi';
import Helpers from '../../utils/helpers';

/**
 * Get Shops Validator for Vendor
 * @param {object} req
 * @returns object
 */
// eslint-disable-next-line consistent-return
const getShopsValidator = async (req, res, next) => {
  /**
   * Get Shop Schema
   */
  const schema = Joi.object({
    active: Joi.boolean().default(true),
  });

  const isValid = schema.validate(req.body);
  const jwtDecoded = await Helpers.JWT.decodeJWTToken(
    Helpers.Validator.headerValidator(req)
  );

  /**
   * Schema is Valid
   */
  if (!isValid?.error) {
    /**
     * Updated Body Params as Required
     */
    req.body = isValid.value;
    req.body.owner_id = jwtDecoded.data.user_id;

    next();
  } else {
    return res.status(400).send({
      success: false,
      message: isValid.error.details[0].message,
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
   * Get Shop
   */
  const schema = Joi.object({
    id: Joi.string().alphanum().min(3).max(255).required(),
  });

  const isValid = schema.validate(req.params);

  /**
   * If Request is valid
   */
  if (!isValid?.error) {
    /**
     * Update Body Params as Required
     */
    req.body = isValid.value;
    next();
  } else {
    return res.status(400).send({
      error: isValid.error.details[0].message,
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
   * Register Schema
   */
  const schema = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    address: Joi.string().min(3).max(100).required(),
    city: Joi.string().min(3).max(100).required(),
    state: Joi.string().min(3).max(100).required(),
    pincode: Joi.string().min(5).max(8).required(),
    country: Joi.string().min(2).max(10).required(),
    gstin: Joi.string().min(2).max(30),
    home_delievery_cost: Joi.number().precision(4).default(3.52),
    home_delievery_distance: Joi.number().integer().default(1),
    active: Joi.boolean().default(true),
  });

  const isValid = schema.validate(req.body);
  const jwtDecoded = await Helpers.JWT.decodeJWTToken(
    Helpers.Validator.headerValidator(req)
  );

  /**
   * If Request is valid
   */
  if (!isValid?.error) {
    /**
     * Update Body Params as Required
     */
    req.body = isValid.value;
    req.body.owner_id = jwtDecoded.data.user_id;

    next();
  } else {
    return res.status(400).send({
      success: false,
      message: isValid.error.details[0].message,
    });
  }
};

export default {
  getShopsValidator,
  registerShopValidator,
  getShopValidator,
};
