import Services from '../services';

const attributes = ['category_id', 'name'];

/**
 * Get Categories
 * @param {object} req
 * @param {object} res
 * @returns object
 */

const getCategoriesAction = async (req, res) => {
  const { limit } = req.body;
  const pageInfo = req.body.page_info;
  delete req.body.limit;

  try {
    const userAddressFilter = {
      where: {
        user_id: userId,
      },
      attributes: userAddressAttributes,
      offset: pageInfo,
      limit,
    };

    const addresses = await Services.UserAddressService.getAllAddress(
      userAddressFilter
    );

    const returnData = {
      addresses,
    };

    return res.status(200).send(returnData);
  } catch (error) {
    /**
     * Error Occured
     */
    return res.status(500).send({
      error: 'An error Occured while retrieving User Addresses',
      data: error,
    });
  }
};

export default {
  getCategoriesAction,
};
