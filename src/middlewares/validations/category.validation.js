import Joi from 'joi';

/**
 * Get Categories Validator
 * @param {object} req
 */
// eslint-disable-next-line consistent-return
const getCategoriesValidator = async (req, res, next) => {
  const querySchema = Joi.object({
    page_info: Joi.number().default(0),
    limit: Joi.number().min(1).max(10).default(5),
  });

  const isValidQuery = querySchema.validate(req.query);

  if (!isValidQuery?.error) {
    /**
     * Updated Body Params as Required
     */
    const filter = isValidQuery.value;
    req.body = filter;

    next();
  } else {
    return res.status(400).send({
      error: isValidQuery.error.details[0].message,
    });
  }

  next();
};

export default {
  getCategoriesValidator,
};
