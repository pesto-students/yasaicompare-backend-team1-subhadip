import bcrypt from 'bcrypt';
import config from '../../config';

const generateSaltedString = async (string) => {
  try {
    const salt = bcrypt.genSaltSync(config.SALT_ROUNDS);
    const hashedString = bcrypt.hashSync(string, salt);

    return hashedString;
  } catch (error) {
    return false;
  }
};

// const compareString = async (stringFrom, stringTo) => {
//   // return bcrypt.compareSync(stringFrom, stringTo);
//   return bcrypt.compareSync(stringTo, stringFrom);
// };

const compareString = async (stringFrom, stringTo) => {
  return bcrypt.compareSync(stringFrom, stringTo);
};

export default {
  generateSaltedString,
  compareString,
};
