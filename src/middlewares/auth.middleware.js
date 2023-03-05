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

const fetchUser = async (userId) => {
  const getUser = await UserService.getUserById(userId);
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
  // eslint-disable-next-line consistent-return
  async (req, res, next) => {
    try {
      const { userId } = req.body;
      const user = await fetchUser(userId);

      if (!user) {
        return res.status(400).send({
          error: 'Access Forbidden',
        });
      }

      const isAllowed = checkRoleAccess(req, res, next, accessRights, user);

      if (isAllowed) {
        next();
      } else {
        return res.status(403).send({
          error: 'Access Forbidden',
        });
      }
    } catch (error) {
      return res.status(500).send({
        error: 'Some Error Occured while Authorization User',
        data: error,
      });
    }
  };

// eslint-disable-next-line consistent-return
const authenticate = async (req, res, next) => {
  try {
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

    /**
     * Adding user_id in Request for Authorization
     */
    req.body.userId = jwtDecoded.data.user_id;
    next();
  } catch (error) {
    return res.status(500).send({
      error: 'Some Error Occured while authenticating User',
      data: error,
    });
  }
};

export default {
  authorize,
  authenticate,
};
