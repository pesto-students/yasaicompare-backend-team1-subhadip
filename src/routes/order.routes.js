import express from 'express';
import Controllers from '../controllers';
import Middleware from '../middlewares';

const OrderRouter = express.Router();
const AuthMiddleware = Middleware.authMiddleware;

/**
 * 
    ============================ GET METHODS ======================================
 */

/**
 * Get All the Inventory of Shop
 */
// OrderRouter.get(
//   '/',
//   AuthMiddleware.auth('get_inventory'),
//   Controllers.OrderController.getAllInventoryAction
// );

/**
 * Get Shop By Id
 */
// OrderRouter.get(
//   '/:shop_id',
//   AuthMiddleware.auth('get_inventory'),
//   Controllers.OrderController.getInventoryByIdAction
// );

/**
 * 
    ============================ POST METHODS ======================================
 */

/**
 * Create An Order
 */
OrderRouter.post(
  '/create',
  AuthMiddleware.auth('create_order'),
  Controllers.OrderController.createOrderAction
);

export default OrderRouter;
