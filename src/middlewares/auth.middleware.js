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
    const token = Helper.Validator.headerValidator(req);
    if (!token) {
      res.status(401).send({
        error: 'Required Authorization Token',
      });
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
      res.status(403).send({
        error: 'Access Forbidden',
      });
    }
  };

// eslint-disable-next-line consistent-return
const authenticate = async (req, res, next) => {
  const token = Helper.Validator.headerValidator(req);
  if (!token) {
    return res.status(401).send({ error: 'Required Authorization Token' });
  }

  const jwtDecoded = await Helper.JWT.decodeJWTToken(token);
  if (!jwtDecoded.success) {
    return res.status(401).send({
      error: jwtDecoded.error,
      data: jwtDecoded.data,
    });
  }

  next();
};

export default {
  authorize,
  authenticate,
};
