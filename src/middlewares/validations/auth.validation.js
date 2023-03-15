import Joi from 'joi';
import Helpers from '../../utils/helpers';

/**
 * Login Validator
 * @param {object} req
 * @returns object
 */
// eslint-disable-next-line consistent-return
const loginValidator = async (req, res, next) => {
  /**
   * Login Schema
   */
  const schema = Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .min(5)
      .max(100)
      .required(),
    password: Joi.string().alphanum().min(3).max(255).required(),
  });

  const isValid = schema.validate(req.body);

  /**
   * Schema is Valid
   */
  if (!isValid?.error) {
    /**
     * Updated Body Params as Required
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
 * Refresh Validator
 * @param {object} req
 */
// eslint-disable-next-line consistent-return
const refreshValidator = async (req, res, next) => {
  /**
   * If Refresh Token isn't in the Request
   */
  if (req.cookies?.refreshToken) {
    const tokenData = await Helpers.JWT.decodeJWTToken(
      req.cookies.refreshToken
    );

    if (!tokenData.success) {
      return res.status(400).send({
        error: 'Refresh Token Expired',
        data: tokenData.data,
      });
    }

    req.body = tokenData.data;
    next();
  } else {
    return res.status(400).send({
      error: 'Missing Refresh Token',
    });
  }
};

/**
 * Register Validator
 * @param {object} req
 */
// eslint-disable-next-line consistent-return
const registerValidator = (req, res, next) => {
  /**
   * Register Schema
   */
  const schema = Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .min(5)
      .max(100)
      .required(),
    password: Joi.string().alphanum().min(3).max(255).required(),
    name: Joi.string().min(3).max(255).required(),
    contact: Joi.string().min(0).max(13).default(''),
    role: Joi.string().default('customer'),
  });

  const isValid = schema.validate(req.body);

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

export default {
  loginValidator,
  registerValidator,
  refreshValidator,
};
