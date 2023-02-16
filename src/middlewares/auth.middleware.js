import ACCESS_LIST from '../config';
import Helper from '../utils/helpers';
import UserService from '../services';

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
  if (!getUser.success) {
    return false;
  }

  return {
    user_id: getUser.data.user_id,
    role: getUser.data.role,
  };
};

const auth =
  (...accessRights) =>
  async (req, res, next) => {
    const response = {
      success: false,
    };

    const token = Helper.Validator.headerValidator(req);
    if (!token) {
      response.message = 'Required Authorization Token';
      res.status(401).send(response);
      return;
    }

    const jwtDecoded = await Helper.JWT.decodeJWTToken(token);
    if (!jwtDecoded.success) {
      res.status(401).send(jwtDecoded);
      return;
    }

    const user = await fetchUser(jwtDecoded);
    const isAllowed = checkRoleAccess(req, res, next, accessRights, user);

    if (isAllowed) {
      next();
    } else {
      response.message = 'Access Forbidden';
      res.status(403).send(response);
    }
  };

export default {
  auth,
};
