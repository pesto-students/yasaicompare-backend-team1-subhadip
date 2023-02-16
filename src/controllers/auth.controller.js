import querystring from 'querystring';
import Services from '../services';
import Helpers from '../utils/helpers';

/**
 * Login Validator
 * @param {object} req
 * @returns object
 */
const loginValidator = (req) => {
  /**
   * Return Response
   */
  const response = { success: false };

  if (
    !Object.prototype.hasOwnProperty.call(req.body, 'email') ||
    !Object.prototype.hasOwnProperty.call(req.body, 'password') ||
    req.body.email === null ||
    req.body.email === '' ||
    req.body.password === null ||
    req.body.password === ''
  ) {
    response.message = 'Email/Password is Required';
    return response;
  }

  return { success: true };
};

/**
 * Login Controller
 * @param {object} req
 * @param {object} res
 * @returns
 */
const loginAction = async (req, res) => {
  /**
   * Request Validation
   */
  const validationResponse = loginValidator(req);
  if (!validationResponse.success) {
    return res.status(400).send(validationResponse);
  }

  /**
   * Login User
   */
  try {
    /**
     * Escape Email and Password
     */
    req.body.email = querystring.escape(req.body.email);
    req.body.email = req.body.email.replace('%40', '@');
    req.body.email = req.body.email.replace('%2B', '+');

    const response = await Services.UserService.loginUser(
      req.body.email,
      querystring.escape(req.body.password)
    );
    /**
     * If User Could Not be Found
     */
    if (response === null) {
      return res.status(404).send({
        success: false,
        message: 'User not found',
      });
    }
    /**
     * Creating Token
     */
    const jwtData = {
      user_id: response.user_id,
      role: response.role,
    };
    const token = Helpers.JWT.createJWTToken(jwtData, '1800s');
    /**
     * User Found
     */
    return res.status(200).send({
      success: true,
      message: `User Successfully Logged In`,
      data: {
        token,
      },
    });
  } catch (error) {
    /**
     * Error Occured
     */
    return res.status(500).send({
      success: false,
      message: 'An error Occured while retrieving User',
      data: error,
    });
  }
};

/**
 * Register Validator
 * @param {object} req
 * @returns object
 */
const registerValidator = (req) => {
  /**
   * Return Response
   */
  const response = { success: false };

  if (
    !Object.prototype.hasOwnProperty.call(req.body, 'email') ||
    !Object.prototype.hasOwnProperty.call(req.body, 'password') ||
    req.body.email === null ||
    req.body.email === '' ||
    req.body.password === null ||
    req.body.password === ''
  ) {
    response.message = 'Email/Password is Required';
    return response;
  }

  if (
    !Object.prototype.hasOwnProperty.call(req.body, 'name') ||
    req.body.name === null ||
    req.body.name === ''
  ) {
    response.message = 'Name is Required';
    return response;
  }
  return { success: true };
};

/**
 * Create user
 * @param {object} req
 * @param {object} res
 * @returns object
 */
const registerAction = async (req, res) => {
  /**
   * Request Validation
   */
  const validationResponse = registerValidator(req);
  if (!validationResponse.success) {
    return res.status(400).send(validationResponse);
  }

  const name = req.body.name.split(' ');

  const user = {
    email: querystring.escape(req.body.email),
    password: querystring.escape(req.body.password),
    last_name: querystring.escape(name.pop()),
    first_name: querystring.escape(name.join(' ')),
  };
  user.email = user.email.replace('%40', '@');
  user.email = user.email.replace('%2B', '+');
  user.first_name = user.first_name.replace('%20', ' ');

  if (Object.prototype.hasOwnProperty.call(req.body, 'contact')) {
    user.contact_no = querystring.escape(req.body.contact);
  }

  try {
    const response = await Services.UserService.createUser(user);
    /**
     * If User Could Not be created
     */
    if (response === null) {
      return res.status(500).send({
        success: false,
        message: 'User Could not be created',
      });
    }
    /**
     * User Created Successfully
     */
    return res.status(201).send({
      success: true,
      message: 'User Created Successfully',
      data: response,
    });
  } catch (error) {
    /**
     * Error Occured
     */
    return res.status(502).send({
      success: false,
      message: 'An error Occured while creating user',
      data: error,
    });
  }
};

export default {
  registerAction,
  loginAction,
};
