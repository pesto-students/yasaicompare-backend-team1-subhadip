import Services from '../services';

/**
 * Fields for Order to Return
 */
const orderAttributes = [
  'order_id',
  'shop_id',
  'amount',
  'order_status',
  'payment_status',
  'delievery_charge',
  'rejection_reason',
  'createdAt',
  'updatedAt',
];

/**
 * Fields for Shop to Return
 */
const shopAttributes = [
  'shop_id',
  'name',
  'address',
  'city',
  'state',
  'pincode',
  'country',
  'gstin',
  'home_delievery_distance',
  'home_delievery_cost',
  'image',
  'longitude',
  'latitude',
  'active',
];

/**
 * Fields for Order Items
 */
const orderItemAttributes = [
  'item_id',
  'inventory_id',
  'order_id',
  'price',
  'name',
  'quantity',
  'fulfilled',
  'rejection_reason',
];

/**
 * Get Vendor Shops
 * @param {object} req
 * @param {object} res
 * @returns object
 */
const getShopsAction = async (req, res) => {
  /**
   * Destructuring Query
   */
  const { limit } = req.body;
  const pageInfo = req.body.page_info;
  delete req.body.limit;
  delete req.body.page_info;

  /**
   * Filter Data
   */
  const filter = {
    where: req.body,
    attributes: shopAttributes,
    offset: pageInfo,
    limit,
  };

  try {
    /**
     * Hitting Service
     */
    const shops = await Services.ShopsService.getAllShops(filter);

    /**
     * If Shops Could Not be Found
     */
    if (shops === null) {
      const returnResponse = {
        error: 'Shops(s) not found',
      };
      return res.status(404).send(returnResponse);
    }

    /**
     * Shops Found
     */
    const returnData = {
      shops,
    };

    return res.status(200).send(returnData);
  } catch (error) {
    /**
     * Error Occured
     */
    const response = {
      error: 'An error Occured while retrieving Shop(s)',
      data: error,
    };

    return res.status(500).send(response);
  }
};

/**
 * Get Shop By ID
 * @param {object} req
 * @param {object} res
 * @returns object
 */
const getShopByIdAction = async (req, res) => {
  try {
    /**
     * Filter
     */
    const filter = {
      where: req.body,
      attributes: shopAttributes,
    };

    /**
     * Hitting Service
     */
    const response = await Services.ShopsService.getShopById(filter);

    /**
     * If Shop Could Not be Found
     */
    if (response === null) {
      return res.status(404).send({
        error: 'Shop not found',
      });
    }

    const returnData = {
      response,
    };

    return res.status(200).send(returnData);
  } catch (error) {
    return res.status(500).send({
      data: error,
    });
  }
};

/**
 * Get Shop Orders
 * @param {object} req
 * @param {object} res
 * @returns object
 */
const getOrdersAction = async (req, res) => {
  /**
   * Destructuring Query
   */
  const { limit } = req.body;
  const pageInfo = req.body.page_info;
  delete req.body.limit;
  delete req.body.page_info;

  /**
   * Filter Data
   */
  const filter = {
    where: req.body,
    attributes: orderAttributes,
    offset: pageInfo,
    limit,
  };

  try {
    /**
     * Hitting Service
     */
    const orders = await Services.OrderService.getAllOrders(filter);

    /**
     * If Orders Could Not be Found
     */
    if (orders === null) {
      const returnResponse = {
        error: 'Orders(s) not found',
      };
      return res.status(404).send(returnResponse);
    }

    const preparedData = orders;

    await Promise.all(
      orders.map(async (shopOrder, index) => {
        const response = await Services.OrderItemService.getOrderItems({
          where: {
            order_id: shopOrder.dataValues.order_id,
          },
          attributes: orderItemAttributes,
        });

        preparedData[index].dataValues.items = response;
      })
    );

    /**
     * Orders Found
     */
    const returnData = {
      orders: preparedData,
    };

    return res.status(200).send(returnData);
  } catch (error) {
    /**
     * Error Occured
     */
    const response = {
      error: 'An error Occured while retrieving Order(s)',
      data: error,
    };

    return res.status(500).send(response);
  }
};

/**
 * Get Shop Order By ID
 * @param {object} req
 * @param {object} res
 * @returns object
 */
const getOrderByIdAction = async (req, res) => {
  try {
    /**
     * Filter
     */
    const filter = {
      where: req.body,
      attributes: orderAttributes,
    };

    /**
     * Get Order Id from DB
     */
    const response = await Services.OrderService.getOrderById(filter);

    /**
     * If Order Could Not be Found
     */
    if (response === null) {
      return res.status(404).send({
        error: 'Order not found',
      });
    }

    response.dataValues.items = await Services.OrderItemService.getOrderItems({
      where: {
        order_id: req.body.order_id,
      },
      attributes: orderItemAttributes,
    });

    const returnData = {
      response,
    };

    return res.status(200).send(returnData);
  } catch (error) {
    return res.status(500).send({
      error: 'Some Error ocured while retrieveing Order',
      data: error,
    });
  }
};

/**
 * Update Shop Order By ID
 * @param {object} req
 * @param {object} res
 * @returns object
 */
const updateOrderByIdAction = async (req, res) => {
  const { filter, data } = req.body;

  /**
   * If Merchant Tries to change status to delievered
   */
  if (data.order_status === 'delievered') {
    return res.status(400).send({
      error: 'Merchant Cannot update the Status to Delievered',
    });
  }

  try {
    /**
     * Filter
     */
    const filterData = {
      where: filter,
      attributes: orderAttributes,
    };

    /**
     * Get Order Id from DB
     */
    let response = await Services.OrderService.updateOrder(data, filterData);

    /**
     * If Order Could Not be Found
     */
    if (response === null) {
      return res.status(404).send({
        error: 'Order not found',
      });
    }

    response = await Services.OrderService.getOrderById(filterData);

    const preparedData = response;

    preparedData.dataValues.items =
      await Services.OrderItemService.getOrderItems({
        where: {
          order_id: filter.order_id,
        },
        attributes: orderItemAttributes,
      });

    return res.status(200).send({
      message: 'Order Updated Successfully',
      data: preparedData,
    });
  } catch (error) {
    return res.status(500).send({
      error: 'Some Error ocured while retrieveing Order',
      data: error,
    });
  }
};

export default {
  getShopsAction,
  getShopByIdAction,
  getOrdersAction,
  getOrderByIdAction,
  updateOrderByIdAction,
};
