// eslint-disable-next-line import/no-extraneous-dependencies
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

dotenv.config();

const { JWT_SECRET_KEY } = process.env;
// const { TOKEN_HEADER_KEY } = process.env;

const createJWTToken = (data, expiresIn) => {
  const randomString = JWT_SECRET_KEY;
  return jwt.sign(data, randomString, { expiresIn });
};

const decodeJWTToken = async (token) => {
  const response = {
    success: true,
  };

  return jwt.verify(token, JWT_SECRET_KEY, (error, decoded) => {
    if (error) {
      response.success = false;
      response.message = 'token expired';
      response.data = {
        expiredAt: error.expiredAt,
      };
    } else {
      response.message = 'token authenticated';
      response.data = decoded;
    }
    return response;
  });
};

export default {
  createJWTToken,
  decodeJWTToken,
};
