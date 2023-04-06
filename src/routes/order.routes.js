import express from 'express';
import Controllers from '../controllers';
import Middleware from '../middlewares';
import Validations from '../middlewares/validations';

const OrderRouter = express.Router();
const { authMiddleware } = Middleware;
const errorMessage = { message: 'Access Forbidden' };

/**
 * 
    ============================ GET METHODS ======================================
 */

/**
 * Get All the Orders of Customer
 */
OrderRouter.get(
  '/',
  authMiddleware.authenticate,
  authMiddleware.authorize('get_orders_customer'),
  Validations.orderValidation.getOrdersValidator,
  Controllers.OrderController.getOrdersAction
);

/**
 * Confirm An Order
 */
OrderRouter.get(
  '/confirm-order',
  authMiddleware.authenticate,
  authMiddleware.authorize('create_order'),
  Validations.orderValidation.confirmOrderValidator,
  Controllers.OrderController.confirmOrderAction
);

/**
 * Get Order By Id
 */
OrderRouter.get(
  '/:id',
  authMiddleware.authenticate,
  authMiddleware.authorize('get_orders_customer'),
  Validations.orderValidation.getOrderValidator,
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
  authMiddleware.authenticate,
  authMiddleware.authorize('create_order'),
  Validations.orderValidation.createOrderValidator,
  Controllers.OrderController.createOrderAction
);

/**
 * 
    ============================ DELETE METHODS ======================================
 */

/**
 * Delete An Order (Payment Failed)
 */
OrderRouter.delete(
  '/:id',
  authMiddleware.authenticate,
  authMiddleware.authorize('create_order'),
  Validations.orderValidation.deleteOrderValidator,
  Controllers.OrderController.deleteOrderAction
);

/**
 * Error Routes
 */
OrderRouter.get('*', (req, res) => {
  return res.status(404).send(errorMessage);
});

OrderRouter.head('*', (req, res) => {
  return res.status(404).send(errorMessage);
});

OrderRouter.post('*', (req, res) => {
  return res.status(404).send(errorMessage);
});

OrderRouter.put('*', (req, res) => {
  return res.status(404).send(errorMessage);
});

OrderRouter.delete('*', (req, res) => {
  return res.status(404).send(errorMessage);
});

OrderRouter.connect('*', (req, res) => {
  return res.status(404).send(errorMessage);
});

OrderRouter.options('*', (req, res) => {
  return res.status(404).send(errorMessage);
});

OrderRouter.trace('*', (req, res) => {
  return res.status(404).send(errorMessage);
});

export default OrderRouter;
