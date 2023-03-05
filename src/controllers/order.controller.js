import sequelize from 'sequelize';
import Services from '../services';
import database from '../database';

const Operator = sequelize.Op;
const DATABASE = database;

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

  const finalData = await Promise.all(
    body.orders.map(async (order) => {
      /**
       * Shop Order failed in Validation
       */
      if (!order) {
        return false;
      }

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
        },
        shopItems,
      };

      return shopData;
    })
  );

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

  /**
   * Start Transaction
   */
  const t = await DATABASE.transaction();
  try {
    preparedData.forEach(async (order) => {
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
        if (!shopItem) {
          return;
        }

        await Services.OrderItemService.createOrderItem(
          shopItem.orderItemData,
          t
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

    /**
     * Commiting Transaction
     */
    await t.commit();

    const returnData = {
      message: 'Order Placed Successfully',
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

export default {
  getOrdersAction,
  createOrderAction,
  getOrderByIdAction,
};
