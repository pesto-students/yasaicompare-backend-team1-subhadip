import Services from '../../services';

/**
 * Finds and return Header
 * @param {object} request
 * @returns string/bool
 */
const headerValidator = (request) => {
  if (!Object.keys(request.headers).length) {
    return false;
  }

  if (!Object.prototype.hasOwnProperty.call(request.headers, 'authorization')) {
    return false;
  }

  if (request.headers.authorization.includes('Bearer ')) {
    return request.headers.authorization.replace('Bearer ', '');
  }

  return request.headers.authorization;
};

/**
 * Checks if User has Access of Shop
 * @param {string} shopId
 * @param {string} ownerId
 * @returns {boolean}
 */
const isOwnerOfShop = async (shopId, ownerId) => {
  /**
   * Filter for Shop and Owner
   */
  const filter = {
    where: {
      shop_id: shopId,
      owner_id: ownerId,
    },
  };

  try {
    const shop = await Services.ShopsService.getShop(filter);

    if (shop === null) {
      return false;
    }

    /**
     * Shop Found
     */
    return true;
  } catch (error) {
    return false;
  }
};

export default {
  headerValidator,
  isOwnerOfShop,
};
