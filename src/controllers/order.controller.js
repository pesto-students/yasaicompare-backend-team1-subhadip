import sequelize from 'sequelize';
import StripeModule from 'stripe';
import { v4 as uuidv4 } from 'uuid';
import Services from '../services';
import database from '../database';
import Helpers from '../utils/helpers';
import config from '../config';

const Operator = sequelize.Op;
const DATABASE = database;
const Stripe = StripeModule(config.STRIPE_PRIVATE_KEY);

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

const orderItemAttributes = [
  'item_id',
  'inventory_id',
  'order_id',
  'name',
  'price',
  'quantity',
  'fulfilled',
  'rejection_reason',
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
    attributes: [
      ['order_group_id', 'order_id'],
      'shop_id',
      'amount',
      'order_status',
      'payment_status',
      'delievery_charge',
      ['order_id', 'order_id_get_items'],
      'createdAt',
      'updatedAt',
    ],
    offset: pageInfo,
    limit,
    group: ['order_id'],
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
            order_id: shopOrder.dataValues.order_id_get_items,
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
      preparedData,
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
    const filter = {
      where: {
        order_group_id: req.body.order_group_id,
        customer_id: req.body.customer_id,
        draft: false,
      },
      attributes,
      // group: ['shop_id'],
    };

    /**
     * Get Order Id from DB
     */
    const response = await Services.OrderService.getOrder(filter);
    /**
     * If Order Could Not be Found
     */
    if (response === null) {
      return res.status(404).send({
        error: 'Order not found',
      });
    }

    const preparedData = response;

    await Promise.all(
      response.map(async (shopOrder, index) => {
        const orderItems = await Services.OrderItemService.getOrderItems({
          where: {
            order_id: shopOrder.order_id,
          },
          attributes: orderItemAttributes,
        });

        preparedData[index].dataValues.items = orderItems;
      })
    );

    return res.status(200).send({
      order_group_id: req.params.id,
      data: preparedData,
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

  const groupId = uuidv4();
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
  // const groupId = `${body.customer_id} - ${orderNumber}`;
  let finalAmount = 0;

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

      const orderId = `${groupId}-${order.shop_id}`;
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
            attributes: [
              ['inventory_id', 'item_id'],
              'shop_id',
              'name',
              'price',
              'quantity',
              'in_stock',
              'image',
              'unit',
            ],
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
              name: inventory.name,
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
  const { orderId, totalAmount } = preparedData;

  if (totalAmount === 0) {
    return res.status(400).send({
      error: `Item(s) are Out of Stock`,
    });
  }

  let paymentIntent = {};
  try {
    paymentIntent = await Stripe.paymentIntents.create({
      amount: Math.round((totalAmount * 100).toFixed(2)),
      currency: 'inr',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        customer_id:
          (
            await Helpers.JWT.decodeJWTToken(
              await Helpers.Validator.headerValidator(req)
            )
          )?.data?.user_id || '',
        order_group_id: orderId,
      },
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
        error:
          'Order Could Not be Placed. Item cannot be delieverd at your location',
      });
    }

    /**
     * Commiting Transaction
     */
    await t.commit();

    const returnData = {
      message: 'Order Waiting for Confirmation',
      order_id: orderId,
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
  const transactionId = req.body.payment_intent;

  /**
   * Payment Confirmation
   */
  let paymentIntent = {};
  try {
    paymentIntent = await Stripe.paymentIntents.retrieve(transactionId);
  } catch (error) {
    return res.status(500).send({
      error: 'Error Occured',
      data: error,
    });
  }

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
      order_group_id: orderId,
      customer_id: customerId,
      draft: true,
    },
  };

  try {
    /**
     * Data to Update
     */
    const data = {
      draft: false,
      payment_status: 'paid',
      order_status: 'pending',
    };

    /**
     * Hitting Service
     */
    let order = await Services.OrderService.updateOrder(data, filter);

    if (order === null) {
      return res.status(400).send({
        error: 'Order Not Found',
      });
    }

    order = await Services.OrderService.getOrder({
      where: {
        order_group_id: orderId,
        customer_id: customerId,
        draft: false,
      },
      attributes,
    });

    return res.status(201).send({
      message: 'Order Confirmed Successfully',
      data: order,
    });
  } catch (error) {
    return res.status(500).send({
      error: 'An Error Occured',
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

/**
 * Update Order
 * @param {object} req
 * @param {object} res
 * @returns object
 */
const updateOrderAction = async (req, res) => {
  const { filter, data } = req.body;

  filter.draft = false;

  /**
   * If Merchant Tries to change status to delievered
   */
  if (data.order_status !== 'delievered') {
    return res.status(400).send({
      error: 'User Cannot update the Status except Delievered',
    });
  }

  try {
    /**
     * Hitting Service
     */
    let order = await Services.OrderService.updateOrder(data, {
      where: filter,
      attributes,
    });

    if (order === null) {
      return res.status(400).send({
        error: 'Order Not Found',
      });
    }

    order = await Services.OrderService.getOrder({
      where: filter,
      attributes,
    });

    const preparedData = order;
    await Promise.all(
      order.map(async (shopOrder, index) => {
        let response = await Services.OrderItemService.updateOrderItems(
          {
            fulfilled: true,
          },
          { where: { order_id: shopOrder.order_id } }
        );

        if (response != null) {
          response = await Services.OrderItemService.getOrderItems({
            where: {
              order_id: shopOrder.order_id,
            },
            attributes: orderItemAttributes,
          });

          preparedData[index].dataValues.items = response;
        }
      })
    );

    return res.status(201).send({
      message: 'Order Updated Successfully',
      data: preparedData,
    });
  } catch (error) {
    return res.status(500).send({
      error: 'An Error Occured',
      data: error,
    });
  }
};

export default {
  getOrdersAction,
  createOrderAction,
  getOrderByIdAction,
  confirmOrderAction,
  deleteOrderAction,
  updateOrderAction,
};
