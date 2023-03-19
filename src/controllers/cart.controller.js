import sequelize from 'sequelize';
import Services from '../services';

const Operator = sequelize.Op;

/**
 * Attributes for Cart to return
 */
const attributes = [
  'cart_id',
  'shop_id',
  'customer_id',
  'item_id',
  'quantity',
  'price',
  'image',
  'name',
];

/**
 * Get All Cart Items
 * @param {object} req
 * @param {object} res
 * @returns object
 */
const getCartAction = async (req, res) => {
  /**
   * Destructuring Query
   */
  const { limit } = req.body;
  const pageInfo = req.body.page_info;

  /**
   * Filter Data
   */
  const filter = {
    where: req.body,
    attributes,
    offset: pageInfo,
    limit,
  };

  try {
    /**
     * Hitting Service
     */
    const cart = await Services.CartService.getAllCarts(filter);

    /**
     * If Cart Could Not be Found
     */
    if (cart === null) {
      const returnResponse = {
        error: 'Cart Item(s) not found',
      };
      return res.status(404).send(returnResponse);
    }

    /**
     * Cart Found
     */
    const returnData = {
      cart,
    };

    return res.status(200).send(returnData);
  } catch (error) {
    /**
     * Error Occured
     */
    const response = {
      error: 'An error Occured while retrieving Cart(s)',
      data: error,
    };

    return res.status(500).send(response);
  }
};

/**
 * Add Cart
 * @param {object} req
 * @param {object} res
 * @returns object
 */
const addCartAction = async (req, res) => {
  /**
   * Destructuring Body
   */
  const { body } = req;

  try {
    const filter = {
      where: {
        inventory_id: body.item_id,
        shop_id: body.shop_id,
        quantity: {
          [Operator.gte]: body.quantity,
        },
      },
    };

    const inventory = await Services.InventoryService.getInventory(filter);

    if (inventory === null) {
      return res.status(404).send({
        error: 'Required Quantity is not available in Stock',
      });
    }

    const cartFilter = {
      where: {
        item_id: body.item_id,
        shop_id: body.shop_id,
        customer_id: body.customer_id,
      },
    };

    let response = null;
    const count = await Services.CartService.searchACartItem(cartFilter);

    if (count === null) {
      body.price = body.quantity * inventory.price;
      body.image = inventory.image;
      body.name = inventory.name
      response = await Services.CartService.createCartItem(body);
    } else {
      req.body.quantity += count.quantity;
      req.body.price = req.body.quantity * inventory.price;
      req.body.image = inventory.image;
      response = await Services.CartService.updateCartItem(
        req.body,
        cartFilter
      );
    }

    /**
     * If Cart Item Could Not be created
     */
    if (response === null) {
      const returnResponse = {
        error: 'Item Could not be added to Cart',
      };
      return res.status(500).send(returnResponse);
    }

    /**
     * Item Added to Cart Successfully
     */
    const returnData = {
      message: 'Item Added to Cart Successfully',
    };

    return res.status(201).send(returnData);
  } catch (error) {
    /**
     * Error Occured
     */
    const response = {
      error: 'An error Occured while adding Item to Cart',
      data: error,
    };

    return res.status(502).send(response);
  }
};

/**
 * Update Cart
 * @param {object} req
 * @param {object} res
 * @returns object
 */
const updateCartAction = async (req, res) => {
  /**
   * Destructuring Body
   */
  const { body } = req;

  try {
    const cartItem = await Services.CartService.getACartItem(body.cart_id);

    if (cartItem === null) {
      return res.status(404).send({
        error: 'Cart Item Could not be updated',
      });
    }

    const itemCount = body.quantity + cartItem.quantity;

    const filter = {
      where: {
        inventory_id: cartItem.item_id,
        shop_id: cartItem.shop_id,
        quantity: {
          [Operator.gte]: itemCount,
        },
      },
    };

    const inventory = await Services.InventoryService.getInventory(filter);

    if (inventory === null) {
      return res.status(404).send({
        error: 'Required Quantity is not available in Stock',
      });
    }

    await Services.CartService.updateCartItem(body, {
      where: { cart_id: body.cart_id },
    });

    const response = await Services.CartService.getACartItem(body.cart_id);

    /**
     * If Cart Item Could Not be updated
     */
    if (response === null) {
      const returnResponse = {
        error: 'Item Could not be updated',
      };
      return res.status(500).send(returnResponse);
    }

    /**
     * Item Added to Cart Successfully
     */
    const returnData = {
      response,
    };

    return res.status(201).send(returnData);
  } catch (error) {
    /**
     * Error Occured
     */
    const response = {
      error: 'An error Occured while adding Item to Cart',
      data: error,
    };

    return res.status(502).send(response);
  }
};

/**
 * Delete Cart Item
 * @param {object} req
 * @param {object} res
 * @returns object
 */
const deleteCartAction = async (req, res) => {
  try {
    /**
     * Filter to delete Cart
     */
    const filter = {
      where: req.body,
    };
    const response = await Services.CartService.deleteCartById(filter);

    /**
     * If Cart Could Not be deleted
     */
    if (!response) {
      const returnResponse = {
        error: 'Item Could not be deleted',
      };
      return res.status(500).send(returnResponse);
    }

    /**
     * Item deleted Successfully
     */
    const returnData = {
      message: 'Cart updated Successfully',
    };

    return res.status(201).send(returnData);
  } catch (error) {
    /**
     * Error Occured
     */
    console.log(error);
    const response = {
      error: 'An error Occured while deleting Item',
      data: error,
    };

    return res.status(502).send(response);
  }
};

export default {
  getCartAction,
  addCartAction,
  updateCartAction,
  deleteCartAction,
};
