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
 * Error Routes
 */
OrderRouter.get('*', (req, res) => {
  res.status(404).send(errorMessage);
});

OrderRouter.head('*', (req, res) => {
  res.status(404).send(errorMessage);
});

OrderRouter.post('*', (req, res) => {
  res.status(404).send(errorMessage);
});

OrderRouter.put('*', (req, res) => {
  res.status(404).send(errorMessage);
});

OrderRouter.delete('*', (req, res) => {
  res.status(404).send(errorMessage);
});

OrderRouter.connect('*', (req, res) => {
  res.status(404).send(errorMessage);
});

OrderRouter.options('*', (req, res) => {
  res.status(404).send(errorMessage);
});

OrderRouter.trace('*', (req, res) => {
  res.status(404).send(errorMessage);
});

export default OrderRouter;
