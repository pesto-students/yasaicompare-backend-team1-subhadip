// import querystring from 'querystring';
import sequelize from 'sequelize';
import Services from '../services';
import Helpers from '../utils/helpers';
import config from '../config';

const Operator = sequelize.Op;
const { DATABASE } = config;

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
      owner_id: tokenData.data.user_id,
    },
    attributes: [
      'shop_id',
      'name',
      'home_delievery_distance',
      'home_delievery_cost',
      'active',
    ],
  };

  /**
   * If Status Check Set
   */
  if (Object.prototype.hasOwnProperty.call(req.query, 'active')) {
    filter.where.active =
      req.query.active === true || req.query.active === 'true';
  }

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
        success: false,
        message: 'Shop(s) not found',
      };
      res.locals.errorMessage = JSON.stringify(returnResponse);
      return res.status(404).send(returnResponse);
    }

    /**
     * Shops Found
     */
    const returnData = {
      success: true,
      message: `Shop(s) Found`,
      data: shops,
    };
    res.locals.errorMessage = JSON.stringify(returnData);

    return res.status(200).send(returnData);
  } catch (error) {
    /**
     * Error Occured
     */
    const response = {
      success: false,
      message: 'An error Occured while retrieving Shop(s)',
      data: error,
    };
    res.locals.errorMessage = JSON.stringify(response);

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
  if (!Object.prototype.hasOwnProperty.call(req.params, 'id')) {
    const validationResponse = { success: false, message: 'Id is Required' };
    res.locals.errorMessage = JSON.stringify(validationResponse);
    return res.status(400).send(validationResponse);
  }

  try {
    const response = await Services.ShopsService.getShopById(req.params.id);

    /**
     * If Shop Could Not be Found
     */
    if (response === null) {
      const returnResponse = {
        success: false,
        message: 'Shop not found',
      };
      res.locals.errorMessage = JSON.stringify(returnResponse);
      return res.status(404).send(returnResponse);
    }

    /**
     * Shop Found
     */
    const returnData = {
      success: true,
      message: `Shop Found`,
      data: response,
    };
    res.locals.errorMessage = JSON.stringify(returnData);

    return res.status(200).send(returnData);
  } catch (error) {
    /**
     * Error Occured
     */
    const response = {
      success: false,
      message: 'An error Occured while retrieving Shop',
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
    const transaction = await DATABASE.transaction();

    validation.data.forEach(async (order) => {
      const { orderData, shopItems } = order;

      console.log(orderData, '347');
      /**
       * Create Order
       */
      await Services.OrderService.createOrder(orderData, transaction);

      /**
       * Create Order Items
       */
      // await Promise.all(
        await
        shopItems.forEach(async (shopItem) => {
          /**
           * Skip if false
           */
          if (shopItem === false) {
            return;
          }

          await Services.OrderItemService.createOrderItem(
            shopItem.orderItemData,
            transaction
          );

          const inventoryId = shopItem.inventoryData.inventory_id;
          delete shopItem.inventoryData.inventory_id;

          /**
           * Update Inventory
           */
          await Services.InventoryService.updateInventory(
            shopItem.inventoryData,
            {
              transaction,
              where: { inventory_id: inventoryId },
            }
          );
        });
      // );
    });

    /**
     * Commiting Transaction
     */
    await transaction.commit();

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
    await transaction.rollback();

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
  // getShopsAction,
  createOrderAction,
  // getShopByIdAction,
};
