import sequelize from 'sequelize';
import Services from '../services';
import database from '../database';
import Helpers from '../utils/helpers';
import config from '../config';
import StripeModule from 'stripe';

const Operator = sequelize.Op;
const DATABASE = database;
const Stripe = StripeModule(config.STRIPE_PRIVATE_KEY);
// const Stripe = StripeModule(process.env.STRIPE_SECRET_KEY, {
//   apiVersion: "2022-08-01",
// });

/**
 * Fields for Order to Return
 */
const attributes = [
  'order_group_id',
  'order_id',
  'shop_id',
  'amount',
  'order_status',
  'payment_status',
  'delievery_charge',
  'createdAt',
  'updatedAt',
];

/**
 * Get User Orders
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

  req.body.draft = false;

  /**
   * Filter Data
   */
  const filter = {
    where: req.body,
    attributes: [['order_group_id', 'order_id']],
    offset: pageInfo,
    limit,
    group: ['order_group_id'],
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

    /**
     * Orders Found
     */
    const returnData = {
      orders,
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
 * Get Order By ID
 * @param {object} req
 * @param {object} res
 * @returns object
 */
const getOrderByIdAction = async (req, res) => {
  try {
    /**
     * Filter
     */
    let filter = {
      where: {
        order_group_id: req.body.order_group_id,
        customer_id: req.body.customer_id,
        draft: false,
      },
      attributes,
      group: ['shop_id'],
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

    const shopsData = await Promise.all(
      response.map(async (order) => {
        /**
         * Filter to get Shop Orders in Order
         */
        filter = {
          where: {
            shop_id: order.shop_id,
            order_group_id: req.params.id,
          },
          attributes,
        };
        const orders = (await Services.OrderService.getAllOrders(filter))[0];

        /**
         * Filter to get Ordered Items from Shop in Order
         */
        filter = {
          where: {
            order_id: orders.order_id,
          },
        };
        const items = await Services.OrderItemService.getOrderItems(filter);

        const itemsFormattedData = items.map((item) => {
          const formattedData = {
            item_id: item.item_id,
            order_id: item.order_id,
            price: item.price,
            quantity: item.quantity,
            fulfilled: item.fulfilled,
            rejection_reason: item.rejection_reason,
          };

          return formattedData;
        });

        /**
         * Shop and It's ordered Items
         */
        const preparedData = {
          shop_id: order.shop_id,
          items: itemsFormattedData,
          amount: order.amount,
          order_status: order.order_status,
          payment_status: order.payment_status,
          delievery_charge: order.delievery_charge,
        };

        return preparedData;
      })
    );

    return res.status(200).send({
      order_group_id: req.params.id,
      orderData: shopsData,
    });
  } catch (error) {
    return res.status(500).send({
      data: error,
    });
  }
};

/**
 * Prepare Order Data
 */
const prepareOrderData = async (body) => {
  const { delieveryAddress } = body;

  const addressFilter = {
    where: {
      id: delieveryAddress,
      user_id: body.customer_id,
    },
  };

  const verfiedAddress = await Services.UserAddressService.getAddressById(
    addressFilter
  );

  if (verfiedAddress === null) {
    return null;
  }

  const userLocation = {
    latitude: verfiedAddress.dataValues.latitude,
    longitude: verfiedAddress.dataValues.longitude,
  };

  /**
   * Order Group ID
   */
  const filter = {
    where: {
      customer_id: body.customer_id,
    },
    distinct: true,
    col: 'customer_id',
  };
  const orderNumber = (await Services.OrderService.getOrdersCount(filter)) + 1;
  const groupId = `${body.customer_id} - ${orderNumber}`;
  let finalAmount = 0.50;

  const finalData = await Promise.all(
    body.orders.map(async (order) => {
      /**
       * Shop Order failed in Validation
       */
      if (!order) {
        return false;
      }

      const shop = await Services.ShopsService.getShopById(order.shop_id);

      if (shop === null) {
        return false;
      }

      const shopLocation = {
        latitude: shop.dataValues.latitude,
        longitude: shop.dataValues.longitude,
      };

      const distance = await Helpers.DistanceHelper.getDistanceOfShop(
        userLocation,
        shopLocation
      );

      /**
       * If distance is more than the shop services
       */
      if (distance > shop.dataValues.home_delievery_distance * 1000) {
        return false;
      }

      const delieveryCharge = shop.dataValues.home_delievery_cost * distance;

      const orderId = `${groupId} - ${order.shop_id}`;
      let totalAmount = 0;

      /**
       * Loop Shop Order Items
       * @returns object
       */
      const shopItems = await Promise.all(
        order.items.map(async (item) => {
          /**
           * Item failed in Validation
           */
          if (!item) {
            return false;
          }

          const itemfilter = {
            where: {
              inventory_id: item.item_id,
              shop_id: order.shop_id,
              quantity: {
                [Operator.gte]: item.quantity,
              },
              in_stock: true,
            },
          };

          const inventory = await Services.InventoryService.getInventory(
            itemfilter
          );

          if (inventory === null) {
            return false;
          }

          const updatedInventory = inventory.quantity - item.quantity;

          const preparedData = {
            orderItemData: {
              order_id: orderId,
              customer_id: body.customer_id,
              price: inventory.price,
              quantity: item.quantity,
              inventory_id: item.item_id,
            },
            inventoryData: {
              inventory_id: item.item_id,
              quantity: updatedInventory,
            },
          };

          /**
           * Calculating Total Price
           */
          totalAmount += inventory.price * item.quantity;

          if (updatedInventory === 0) {
            preparedData.inventoryData.in_stock = false;
          }

          return preparedData;
        })
      );

      const shopData = {
        orderData: {
          order_id: orderId,
          order_no: orderNumber,
          customer_id: body.customer_id,
          amount: totalAmount,
          order_group_id: groupId,
          shop_id: order.shop_id,
          delievery_charge: delieveryCharge,
          delievery_address: delieveryAddress,
        },
        shopItems,
      };

      /**
       * Final Amount to be charged
       */
      finalAmount += totalAmount;

      return shopData;
    })
  );

  finalData.orderId = groupId;
  finalData.totalAmount = finalAmount;

  return finalData;
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
  const preparedData = await prepareOrderData(req.body);

  if (preparedData === null) {
    return res.status(404).send({
      error: 'Address is not associated with user',
    });
  }

  /**
   * Order Group Id
   */
  const { groupId, totalAmount } = preparedData;
  let paymentIntent = {};
  try {
    paymentIntent = await Stripe.paymentIntents.create({
      amount: Math.round((totalAmount * 100).toFixed(2)),
      currency: "inr",
      automatic_payment_methods:  {
        enabled: true,
      },
      metadata: {
        'customer_id': (await Helpers.JWT.decodeJWTToken(await Helpers.Validator.headerValidator(req)))?.data?.user_id || '',
        'order_group_id': groupId,
      }
    });
  } catch (error) {
    return res.status(500).send({
      error: 'Stripe Error',
      data: error,
    });
  }

  /**
   * Start Transaction
   */
  const t = await DATABASE.transaction();
  let orderPlaced = true;

  try {
    preparedData.map(async (order) => {
      if (!order && orderPlaced) {
        orderPlaced = false;
        return false;
      }

      const { orderData, shopItems } = order;

      /**
       * Adding Payment Intent Data in Order Entry
       */
      orderData.payment_intent = paymentIntent.id;

      /**
       * Create Order
       */
      await Services.OrderService.createOrder(orderData, { t });

      /**
       * Create Order Items
       */
      await shopItems.forEach(async (shopItem) => {
        /**
         * Skip if false
         */
        if (!shopItem) {
          return;
        }

        await Services.OrderItemService.createOrderItem(
          shopItem.orderItemData,
          { t }
        );

        const { inventoryData } = shopItem;
        const inventoryId = inventoryData.inventory_id;
        delete inventoryData.inventory_id;

        /**
         * Update Inventory
         */
        await Services.InventoryService.updateInventory(inventoryData, {
          where: { inventory_id: inventoryId },
          t,
        });
      });
    });

    if (!orderPlaced) {
      return res.status(404).send({
        error: 'Order Could Not be Placed. Item cannot be delieverd at your location',
      });
    }

    /**
     * Commiting Transaction
     */
    await t.commit();

    const returnData = {
      message: 'Order Waiting for Confirmation',
      order_id: groupId,
      paymentData: paymentIntent,
    };

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
      error: 'An error Occured while creating Order',
      data: error,
    };

    return res.status(502).send(response);
  }
};

/**
 * Confirm Order Payment
 * @param {object} req
 * @param {object} res
 * @returns object
 */
const confirmOrderAction = async (req, res) => {
  const orderId = req.body.order_group_id;
  const customerId = req.body.customer_id;
  const transactionId = req.body.transaction_id;

  /**
   * Payment Confirmation
   */
  const paymentIntent = await Stripe.paymentIntents.confirm(transactionId);
  if (paymentIntent.status !== 'succeeded') {
    return res.status(400).send({
      error: 'Payment not Confirmed',
    });
  }

  /**
   * Filter Data
   */
  const filter = {
    where: {
      order_id: orderId,
      customer_id: customerId,
      draft: true,
    },
    attributes,
  };

  try {
    /**
     * Data to Update
     */
    const data = {
      draft: false,
    };

    /**
     * Hitting Service
     */
    const order = await Services.OrderService.updateOrder(data, filter);

    if (order === null) {
      return res.status(400).send({
        error: 'Order Not Found',
      });
    }

    return res.status(201).send({
      message: 'Order Confirmed Successfully',
    });
  } catch (error) {
    return res.status(500).send({
      error: 'An error Occured while confirm the Order',
      data: error,
    });
  }
};

/**
 * Prepare Cancel Data
 */
const cancelOrder = async (orders) => {
  const finalData = await Promise.all(
    orders.map(async (order) => {
      const orderData = order.dataValues;

      const orderItemsFilter = {
        where: {
          order_id: orderData.order_id,
        },
      };
      const orderItems = await Services.OrderItemService.getOrderItems(
        orderItemsFilter
      );

      if (orderItems === null) {
        return false;
      }

      const preparedData = orderItems.map((item) => {
        return {
          item_id: item.item_id,
          quantity: item.quantity,
          inventory_id: item.inventory_id,
        };
      });

      return preparedData;
    })
  );

  return finalData;
};

/**
 * Delete Order (Payment Failed)
 * @param {objectDelete Order (Payment Failed)} req
 * @param {object} res
 */
const deleteOrderAction = async (req, res) => {
  const orderId = req.body.order_group_id;
  const customerId = req.body.customer_id;

  const t = await DATABASE.transaction();

  try {
    const orders = await Services.OrderService.getAllOrders({
      where: {
        order_group_id: orderId,
        draft: true,
        customer_id: customerId,
      },
    });

    if (orders === null) {
      return res.status(400).send({
        error: 'Order not Found',
      });
    }

    const preparedData = await cancelOrder(orders);

    await Promise.all(
      preparedData.map(async (shop) => {
        await Promise.all(
          shop.map(async (item) => {
            /**
             * Get Item from Inventory
             */
            const inventory = await Services.InventoryService.getInventory({
              where: { inventory_id: item.inventory_id },
              t,
            });

            const inventoryUpdateData = {
              quantity: item.quantity + inventory.quantity,
            };

            /**
             * If Stock is false
             */
            if (!inventory.in_stock) {
              inventoryUpdateData.in_stock = true;
            }

            /**
             * Restoring Inventory
             */
            await Services.InventoryService.updateInventory(
              inventoryUpdateData,
              {
                where: { inventory_id: item.inventory_id },
                t,
              }
            );

            /**
             * Deleting Item from Order Items
             */
            await Services.OrderItemService.deleteOrderItemId({
              where: {
                item_id: item.item_id,
              },
              t,
            });
          })
        );
      })
    );

    /**
     * Deleting Order from Table
     */
    await Services.OrderService.deleteOrderById({
      where: {
        order_group_id: orderId,
      },
      t,
    });

    /**
     * Commiting Transaction
     */
    await t.commit();

    return res.status(204).send({
      message: 'Order Deleted Successfully',
    });
  } catch (error) {
    /**
     * Rolling Back Transaction
     */
    await t.rollback();
    /**
     * Error Occured
     */
    const response = {
      error: 'An error Occured while deleting Order',
      data: error,
    };

    return res.status(502).send(response);
  }
};

export default {
  getOrdersAction,
  createOrderAction,
  getOrderByIdAction,
  confirmOrderAction,
  deleteOrderAction,
};
