import Services from '../services';
import Helpers from '../utils/helpers';
import config from '../config';

/**
 * Login Action
 * @param {object} req
 * @param {object} res
 * @returns
 */
const loginAction = async (req, res) => {
  try {
    /**
     * Logging in using email & password
     */
    const { email, password } = req.body;

    /**
     * Hitting Database
     */
    const user = await Services.UserService.getUserByEmail(email);

    /**
     * If User Could Not be Found
     */
    if (user === null) {
      return res.status(404).send({
        error: 'User not found',
      });
    }

    const isValid = await Helpers.StringSalt.compareString(
      password,
      user.password
    );

    if (!isValid) {
      return res.status(400).send({
        error: 'Email/Password is Incorrect',
      });
    }

    /**
     * Creating Access Token
     */
    let jwtData = {
      user_id: user.user_id,
      role: user.role,
    };
    const accessToken = Helpers.JWT.createJWTToken(
      jwtData,
      config.ACCESS_TOKEN_EXPIRY
    );

    /**
     * Creating Refresh Token
     */
    jwtData = {
      user_id: user.user_id,
    };
    const refreshToken = Helpers.JWT.createJWTToken(
      jwtData,
      config.REFRESH_TOKEN_EXPIRY
    );

    /**
     * User Found
     */
    const returnData = {
      accessToken,
    };

    const options = {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    };

    res.cookie('refreshToken', refreshToken, options);
    return res.status(200).send(returnData);
  } catch (error) {
    /**
     * Error Occured
     */
    return res.status(500).send({
      error: 'An error Occured while retrieving User',
      data: error,
    });
  }
};

/**
 * Create user
 * @param {object} req
 * @param {object} res
 * @returns object
 */
const registerAction = async (req, res) => {
  const user = req.body;

  const name = user.name.split(' ');
  delete user.name;

  user.first_name = name.join(' ');
  user.last_name = name.pop();

  /**
   * Hashing Password
   */
  user.password = await Helpers.StringSalt.generateSaltedString(user.password);

  try {
    const response = await Services.UserService.createUser(user);
    /**
     * If User Could Not be created
     */
    if (response === null) {
      const returnResponse = {
        error: 'User Could not be created',
      };
      res.locals.errorMessage = JSON.stringify(returnResponse);
      return res.status(500).send(returnResponse);
    }
    /**
     * User Created Successfully
     */
    const returnData = {
      message: 'User Created Successfully',
    };
    return res.status(201).send(returnData);
  } catch (error) {
    /**
     * Error Occured
     */
    const response = {
      error: 'An error Occured while creating user',
      data: error,
    };
    return res.status(500).send(response);
  }
};

/**
 * Refresh Token Action
 * @param {object} req
 * @param {object} res
 * @returns
 */
const refreshTokenAction = async (req, res) => {
  const userId = req.body.user_id;

  try {
    const user = await Services.UserService.getUserById(userId);

    /**
     * If User Could Not be Found
     */
    if (user === null) {
      return res.status(404).send({
        error: 'User not found',
      });
    }

    /**
     * Creating Access Token
     */
    let jwtData = {
      user_id: user.user_id,
      role: user.role,
    };
    const accessToken = Helpers.JWT.createJWTToken(
      jwtData,
      config.ACCESS_TOKEN_EXPIRY
    );

    /**
     * Creating Refresh Token
     */
    jwtData = {
      user_id: user.user_id,
    };
    const refreshToken = Helpers.JWT.createJWTToken(
      jwtData,
      config.REFRESH_TOKEN_EXPIRY
    );

    /**
     * User Found
     */
    const returnData = {
      accessToken,
    };

    const options = {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    };
    res.cookie('refreshToken', refreshToken, options);
    return res.status(200).send(returnData);
  } catch (error) {
    /**
     * Error Occured
     */
    return res.status(500).send({
      error: 'An error Occured while retrieving User',
      data: error,
    });
  }
};

export default {
  registerAction,
  loginAction,
  refreshTokenAction,
};
