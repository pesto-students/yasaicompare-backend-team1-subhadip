import Services from '../services';
import Helpers from '../utils/helpers';

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
    const hashedPassword = await Helpers.StringSalt.generateSaltedString(
      password
    );

    /**
     * Hitting Database
     */
    const user = await Services.UserService.loginUser(email, hashedPassword);

    /**
     * If User Could Not be Found
     */
    if (user === null) {
      return res.status(404).send({
        success: false,
        message: 'User not found',
      });
    }

    /**
     * Creating Access Token
     */
    let jwtData = {
      user_id: user.user_id,
      role: user.role,
      grant_type: 'client_credentials',
    };
    const accessToken = Helpers.JWT.createJWTToken(jwtData, '3600s');

    /**
     * Creating Refresh Token
     */
    jwtData = {
      user_id: user.user_id,
      grant_type: 'refresh_token',
    };
    const refreshToken = Helpers.JWT.createJWTToken(jwtData, '30d');

    /**
     * User Found
     */
    const returnData = {
      success: true,
      message: `User Successfully Logged In`,
      data: {
        accessToken,
      },
    };

    res.cookie('refresh-token-yasai', refreshToken);
    return res.status(200).send(returnData);
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
        success: false,
        message: 'User Could not be created',
      };
      res.locals.errorMessage = JSON.stringify(returnResponse);
      return res.status(500).send(returnResponse);
    }
    /**
     * User Created Successfully
     */
    const returnData = {
      success: true,
      message: 'User Created Successfully',
      data: response,
    };
    res.locals.errorMessage = JSON.stringify(returnData);
    return res.status(201).send(returnData);
  } catch (error) {
    /**
     * Error Occured
     */
    const response = {
      success: false,
      message: 'An error Occured while creating user',
      data: error,
    };
    res.locals.errorMessage = JSON.stringify(response);
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
  const { userId } = req.body;

  try {
    const user = await Services.UserService.getUserById(userId);

    /**
     * If User Could Not be Found
     */
    if (user === null) {
      return res.status(404).send({
        success: false,
        message: 'User not found',
      });
    }

    const userUpdatedAt = new Date(Date.parse(user.updatedAt)).getTime() / 1000;

    if (userUpdatedAt >= req.body.iat) {
      return res.status(401).send({
        success: false,
        message: 'Refresh Token Expired',
        data: req.body,
      });
    }

    /**
     * Creating Access Token
     */
    let jwtData = {
      user_id: user.user_id,
      role: user.role,
      grant_type: 'client_credentials',
    };
    const accessToken = Helpers.JWT.createJWTToken(jwtData, '3600s');

    /**
     * Creating Refresh Token
     */
    jwtData = {
      user_id: user.user_id,
      grant_type: 'refresh_token',
    };
    const refreshToken = Helpers.JWT.createJWTToken(jwtData, '30d');

    /**
     * User Found
     */
    const returnData = {
      success: true,
      message: `User Successfully Logged In`,
      data: {
        accessToken,
      },
    };

    res.cookie('refresh-token-yasai', refreshToken);
    return res.status(200).send(returnData);
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

export default {
  registerAction,
  loginAction,
  refreshTokenAction,
};
