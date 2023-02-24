import Config from '../config';
import Helper from '../utils/helpers';
import Services from '../services';

const { UserService } = Services;
const { ACCESS_LIST } = Config;

const checkRoleAccess = (req, res, next, accessRights, user) => {
  if (accessRights.length) {
    const userAccessRights = ACCESS_LIST.get(user.role);
    const accessAllowed = accessRights.every((accessRight) =>
      userAccessRights.includes(accessRight)
    );

    /**
     * Access Allowed
     */
    if (accessAllowed) {
      return true;
    }
  }

  return false;
};

const fetchUser = async (jwt) => {
  if (!Object.keys(jwt).length) {
    return false;
  }

  if (!Object.prototype.hasOwnProperty.call(jwt.data, 'user_id')) {
    return false;
  }

  const getUser = await UserService.getUserById(jwt.data.user_id);
  if (getUser === null) {
    return false;
  }

  return {
    user_id: getUser.user_id,
    role: getUser.role,
  };
};

const authorize =
  (...accessRights) =>
  async (req, res, next) => {
    const response = {
      success: false,
    };

    const token = Helper.Validator.headerValidator(req);
    if (!token) {
      response.message = 'Required Authorization Token';
      res.locals.errorMessage = JSON.stringify(response);
      res.status(401).send(response);
      return;
    }

    const jwtDecoded = await Helper.JWT.decodeJWTToken(token);
    if (!jwtDecoded.success) {
      res.locals.errorMessage = JSON.stringify(jwtDecoded);
      res.status(401).send(jwtDecoded);
      return;
    }

    const user = await fetchUser(jwtDecoded);
    const isAllowed = checkRoleAccess(req, res, next, accessRights, user);

    if (isAllowed) {
      next();
    } else {
      response.message = 'Access Forbidden';
      res.locals.errorMessage = JSON.stringify(response);
      res.status(403).send(response);
    }
  };

const authenticate = async () => {
  const token = Helper.Validator.headerValidator(req);
  if (!token) {
    response.message = 'Required Authorization Token';
    return res.status(401).send(response);
  }

  const jwtDecoded = await Helper.JWT.decodeJWTToken(token);
  if (!jwtDecoded.success) {
    return res.status(401).send(jwtDecoded);
  }
};

export default {
  authorize,
  authenticate,
};
