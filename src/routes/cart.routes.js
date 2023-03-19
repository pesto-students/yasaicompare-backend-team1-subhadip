import express from 'express';
import Controllers from '../controllers';
import Validations from '../middlewares/validations';
import Middleware from '../middlewares';

const CartRouter = express.Router();
const { authMiddleware } = Middleware;
const errorMessage = { message: 'Access Forbidden' };

/**
 * 
    ============================ GET METHODS ======================================
 */

/**
 * Get All the items of Cart
 */
CartRouter.get(
  '/',
  authMiddleware.authenticate,
  authMiddleware.authorize('cart'),
  Validations.cartValidation.getAllCartValidator,
  Controllers.CartController.getCartAction
);

/**
 * 
    ============================ PUT METHODS ======================================
 */

/**
 * Update An Item in Cart
 */
CartRouter.put(
  '/:id',
  authMiddleware.authenticate,
  authMiddleware.authorize('cart'),
  Validations.cartValidation.updateItemCartValidator,
  Controllers.CartController.updateCartAction
);

/**
 * 
    ============================ POST METHODS ======================================
 */

/**
 * Add An Item in Cart
 */
CartRouter.post(
  '/',
  authMiddleware.authenticate,
  authMiddleware.authorize('cart'),
  Validations.cartValidation.addItemCartValidator,
  Controllers.CartController.addCartAction
);

/**
 * 
    ============================ DELETE METHODS ======================================
 */

/**
 * Delete An Item from Cart
 */
CartRouter.delete(
  '/:id',
  authMiddleware.authenticate,
  authMiddleware.authorize('cart'),
  Validations.cartValidation.deleteItemCartValidator,
  Controllers.CartController.deleteCartAction
);

/**
 * Error Routes
 */
CartRouter.get('*', (req, res) => {
  res.status(404).send(errorMessage);
});

CartRouter.head('*', (req, res) => {
  res.status(404).send(errorMessage);
});

CartRouter.post('*', (req, res) => {
  res.status(404).send(errorMessage);
});

CartRouter.put('*', (req, res) => {
  res.status(404).send(errorMessage);
});

CartRouter.delete('*', (req, res) => {
  res.status(404).send(errorMessage);
});

CartRouter.connect('*', (req, res) => {
  res.status(404).send(errorMessage);
});

CartRouter.options('*', (req, res) => {
  res.status(404).send(errorMessage);
});

CartRouter.trace('*', (req, res) => {
  res.status(404).send(errorMessage);
});

export default CartRouter;
