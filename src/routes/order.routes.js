import express from 'express';
import Controllers from '../controllers';
import Middleware from '../middlewares';

const OrderRouter = express.Router();

/**
 * 
    ============================ GET METHODS ======================================
 */

/**
 * Get All the Orders of Customer
 */
OrderRouter.get('/', Controllers.OrderController.getOrdersAction);

/**
 * Get Order By Id
 */
OrderRouter.get('/:id', Controllers.OrderController.getOrderByIdAction);

/**
 * 
    ============================ POST METHODS ======================================
 */

/**
 * Create An Order
 */
OrderRouter.post('/create', Controllers.OrderController.createOrderAction);

export default OrderRouter;
