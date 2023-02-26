// import querystring from 'querystring';
import sequelize from 'sequelize';
import Services from '../services';
import Helpers from '../utils/helpers';
import config from '../config';

const Operator = sequelize.Op;
const { DATABASE } = config;

/**
 * Get User Orders
 * @param {object} req
 * @param {object} res
 * @returns object
 */
const getOrdersAction = async (req, res) => {
  /**
   * JWT Token Decoded
   */
  const tokenData = await Helpers.JWT.decodeJWTToken(
    Helpers.Validator.headerValidator(req)
  );

  /**
   * Filter Data
   */
  const filter = {
    where: {
      customer_id: tokenData.data.user_id,
    },
    attributes: [
      'order_group_id',
      'amount',
      'order_status',
      'payment_status',
      'delievery_charge',
      'createdAt',
      'updatedAt',
    ],
    group: ['order_group_id'],
  };

  /**
   * If Payment Status is Set
   */
  if (Object.prototype.hasOwnProperty.call(req.query, 'payment_status')) {
    filter.where.payment_status = req.query.payment_status;
  }

  /**
   * If Order Status is Set
   */
  if (Object.prototype.hasOwnProperty.call(req.query, 'order_status')) {
    filter.where.order_status = req.query.order_status;
  }

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
        success: false,
        message: 'Orders(s) not found',
      };
      res.locals.errorMessage = JSON.stringify(returnResponse);
      return res.status(404).send(returnResponse);
    }

    /**
     * Orders Found
     */
    const returnData = {
      success: true,
      message: `Order(s) Found`,
      data: orders,
    };
    res.locals.errorMessage = JSON.stringify(returnData);

    return res.status(200).send(returnData);
  } catch (error) {
    /**
     * Error Occured
     */
    const response = {
      success: false,
      message: 'An error Occured while retrieving Order(s)',
      data: error,
    };
    res.locals.errorMessage = JSON.stringify(response);

    return res.status(500).send(response);
  }
};

/**
 * Get Order By ID
 * @param {object} req
 * @param {object} res
 * @returns object
 */
const getOrderByIdAction = async (req, res) => {
  /**
   * Order group Id Not Set
   */
  if (!Object.prototype.hasOwnProperty.call(req.params, 'id')) {
    const validationResponse = { success: false, message: 'Id is Required' };
    res.locals.errorMessage = JSON.stringify(validationResponse);
    return res.status(400).send(validationResponse);
  }

  /**
   * JWT Token Decoded
   */
  const tokenData = await Helpers.JWT.decodeJWTToken(
    Helpers.Validator.headerValidator(req)
  );

  let filter = {
    where: {
      order_group_id: req.params.id,
      customer_id: tokenData.data.user_id,
    },
    attributes: ['shop_id'],
    group: ['shop_id'],
  };

  try {
    /**
     * Get Order Id from DB
     */
    const response = await Services.OrderService.getOrderById(filter);
    // delete response['1']; //temp

    /**
     * If Order Could Not be Found
     */
    if (response === null) {
      const returnResponse = {
        success: false,
        message: 'Order not found',
      };
      res.locals.errorMessage = JSON.stringify(returnResponse);
      return res.status(404).send(returnResponse);
    }

    const shopsData = await response.map(async (shop) => {
      /**
       * Filter to get Shop Orders in Order
       */
      filter = {
        where: {
          shop_id: shop.shop_id,
          order_group_id: req.params.id,
        },
      };
      let orders = (await Services.OrderService.getAllOrders(filter))[0];

      /**
       * Filter to get Ordered Items from Shop in Order
       */
      filter = {
        where: {
          order_id: orders.order_id,
        },
      };
      const items = await Services.OrderItemService.getOrderItems(filter);

      let itemsFormattedData = [];
      for (const item of items) {
        const formattedData = {
          item_id: item.item_id,
          order_id: item.order_id,
          price: item.price,
          quantity: item.quantity,
          fulfilled: item.fulfilled,
          rejection_reason: item.rejection_reason,
        };

        itemsFormattedData.push(formattedData);
      }

      /**
       * Shop and It's ordered Items
       */
      const preparedData = {
        shop_id: shop.shop_id,
        items: itemsFormattedData,
      };

      return preparedData;
    });

    let returnData = await Promise.all(shopsData);
    returnData = {
      order_group_id: req.params.id,
      orderData: returnData,
    };
    return res.status(200).send(returnData);
  } catch (error) {
    /**
     * Error Occured
     */
    const response = {
      success: false,
      message: 'An error Occured while retrieving Order',
      data: error,
    };
    res.locals.errorMessage = JSON.stringify(response);

    return res.status(500).send(response);
  }
};

/**
 * Create Order Data
 * @param {object} request
 * @param {string} mode
 * @returns Object
 */
const createOrderData = async (request, mode) => {
  /**
   * ValidationResponse
   */
  const response = {
    success: false,
    message: '',
    data: {},
  };

  const object = request.body;

  /**
   * Missing Customer ID
   */
  if (!Object.prototype.hasOwnProperty.call(object, 'customer')) {
    response.message = 'Customer ID is Required';
    return response;
  }

  /**
   * Validating Customer Id
   */
  const tokenData = await Helpers.JWT.decodeJWTToken(
    Helpers.Validator.headerValidator(request)
  );

  if (!(tokenData.data.user_id === object.customer)) {
    response.message = 'Customer Id is Incorrect';
    return response;
  }
  response.data.customer_id = object.customer;

  /**
   * If orders Not Set
   */
  if (
    !Object.prototype.hasOwnProperty.call(object, 'orders') ||
    mode === 'update'
  ) {
    response.message = 'Order Details is/are Required';
    return response;
  }

  // /**
  //  * If Order Status is set
  //  */
  // if (
  //   Object.prototype.hasOwnProperty.call(object, 'order_status') &&
  //   mode === 'update'
  // ) {
  //   response.data.order_status = object.order_status;
  // }

  /**
   * Order Group ID
   */
  let filter = {
    where: {
      customer_id: response.data.customer_id,
    },
    distinct: true,
    col: 'customer_id',
  };
  const orderNumber = (await Services.OrderService.getOrdersCount(filter)) + 1;
  const groupId = `${response.data.customer_id} - ${orderNumber}`;

  const finalData = await Promise.all(
    /**
     * Loop orders
     */
    object.orders.map(async (order) => {
      const validatedItem = {};
      if (
        !Object.prototype.hasOwnProperty.call(order, 'shop_id') &&
        !Object.prototype.hasOwnProperty.call(order, 'items')
      ) {
        return false;
      }

      validatedItem.shop_id = order.shop_id;
      const orderId = `${groupId} - ${validatedItem.shop_id}`;
      let totalAmount = 0;

      let shopItems = [];
      /**
       * Loop Order Items
       * @returns object
       */
      for (const item of order.items) {
        validatedItem.item_id = item.item_id;
        validatedItem.amount = item.amount;

        /**
         * If set Quantity
         */
        if (Object.prototype.hasOwnProperty.call(item, 'quantity')) {
          validatedItem.quantity = item.quantity;
        } else {
          validatedItem.quantity = 1;
        }

        const itemfilter = {
          where: {
            inventory_id: validatedItem.item_id,
            shop_id: validatedItem.shop_id,
            quantity: {
              [Operator.gte]: validatedItem.quantity,
            },
            price: validatedItem.amount,
            in_stock: true,
          },
        };

        const inventory = await Services.InventoryService.getInventory(
          itemfilter
        );
        if (inventory === null) {
          /**
           * Push into Result Array
           */
          shopItems.push(false);
          continue;
        }

        const updatedInventory = inventory.quantity - validatedItem.quantity;

        const preparedData = {
          orderItemData: {
            order_id: orderId,
            customer_id: response.data.customer_id,
            price: inventory.price,
            quantity: validatedItem.quantity,
          },
          inventoryData: {
            inventory_id: validatedItem.item_id,
            quantity: updatedInventory,
          },
        };

        /**
         * Calculating Total Price
         */
        totalAmount += inventory.price * validatedItem.quantity;

        if (updatedInventory === 0) {
          preparedData.inventoryData.in_stock = false;
        }

        /**
         * Push into Result Array
         */
        shopItems.push(preparedData);
      }

      shopItems = {
        orderData: {
          order_id: orderId,
          order_no: orderNumber,
          customer_id: response.data.customer_id,
          amount: totalAmount,
          order_group_id: groupId,
          shop_id: validatedItem.shop_id,
        },
        shopItems,
      };

      return shopItems;
    })
  );

  response.success = true;
  response.data = finalData;
  return response;
};

/**
 * Create Order
 * @param {object} req
 * @param {object} res
 * @returns object
 */
const createOrderAction = async (req, res) => {
  /**
   * Params Validation
   */
  const validation = await createOrderData(req);
  if (!validation.success) {
    res.locals.errorMessage = JSON.stringify(validation);
    return res.status(400).send(validation);
  }

  try {
    /**
     * Start Transaction
     */
    const t = await DATABASE.transaction();

    validation.data.forEach(async (order) => {
      const { orderData, shopItems } = order;

      /**
       * Create Order
       */
      await Services.OrderService.createOrder(orderData, t);

      /**
       * Create Order Items
       */
      await shopItems.forEach(async (shopItem) => {
        /**
         * Skip if false
         */
        if (shopItem === false) {
          return;
        }

        await Services.OrderItemService.createOrderItem(
          shopItem.orderItemData,
          t
        );

        const inventoryId = shopItem.inventoryData.inventory_id;
        delete shopItem.inventoryData.inventory_id;

        /**
         * Update Inventory
         */
        await Services.InventoryService.updateInventory(
          shopItem.inventoryData,
          {
            where: { inventory_id: inventoryId },
            t,
          }
        );
      });
    });

    /**
     * Commiting Transaction
     */
    await t.commit();

    const returnData = {
      success: true,
      message: 'Order Placed Successfully',
    };
    res.locals.errorMessage = JSON.stringify(returnData);

    return res.status(201).send(returnData);
  } catch (error) {
    /**
     * Rolling Back Transaction
     */
    await t.rollback();

    /**
     * Error Occured
     */
    const response = {
      success: false,
      message: 'An error Occured while creating Order',
      data: error,
    };
    res.locals.errorMessage = JSON.stringify(response);

    return res.status(502).send(response);
  }
};

export default {
  getOrdersAction,
  createOrderAction,
  getOrderByIdAction,
};
