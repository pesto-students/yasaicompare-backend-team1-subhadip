import Joi from 'joi';
import Helpers from '../../utils/helpers';

/**
 * Login Validator
 * @param {object} req
 * @returns object
 */
const loginValidator = async (req, res, next) => {
  if (req.cookies?.yasaiLongLivedToken) {
    const tokenData = await Helpers.JWT.decodeJWTToken(
      req.cookies.yasaiLongLivedToken
    );

    if (!tokenData.success) {
      return res.status(401).send({
        success: false,
        message: 'Refresh Token Expired',
        data: tokenData,
      });
    }

    req.body = tokenData.data;
    next();
  } else {
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

    try {
      const isValid = schema.validate(req.body);

      if (isValid?.error) {
        return res.status(400).send({
          success: false,
          message: isValid.error.details[0].message,
        });
      }

      /**
       * Updated Body Params as Required
       */
      req.body = isValid.value;

      next();
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: `An Error Occured`,
        error,
      });
    }
  }
};

/**
 * Register Validator
 * @param {object} req
 * @returns object
 */
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

  try {
    const isValid = schema.validate(req.body);

    if (isValid?.error) {
      return res.status(400).send({
        success: false,
        message: isValid.error.details[0].message,
      });
    }

    /**
     * Updated Body Params as Required
     */
    req.body = isValid.value;

    next();
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: `An Error Occured`,
      error,
    });
  }
};

export default {
  loginValidator,
  registerValidator,
};
