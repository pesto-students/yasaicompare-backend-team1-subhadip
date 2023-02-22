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
 * Get All the Orders of Customer
 */
OrderRouter.get(
  '/',
  AuthMiddleware.auth('get_orders'),
  Controllers.OrderController.getOrdersAction
);

/**
 * Get Order By Id
 */
OrderRouter.get(
  '/:id',
  AuthMiddleware.auth('get_orders'),
  Controllers.OrderController.getOrderByIdAction
);

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
