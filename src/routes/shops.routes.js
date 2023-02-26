import express from 'express';
import Controllers from '../controllers';
import Middleware from '../middlewares';
import Validations from '../middlewares/validations';

const ShopsRouter = express.Router();
const { authMiddleware } = Middleware;
const errorMessage = { message: 'Access Forbidden' };

/**
 * 
    ============================ GET METHODS ======================================
 */

/**
 * Get All the Shops of the Vendor
 */
ShopsRouter.get(
  '/',
  authMiddleware.authenticate,
  authMiddleware.authorize('get_owners_shop'),
  Validations.shopsValidation.getShopsValidator,
  Controllers.ShopsController.getShopsAction
);

/**
 * Get Shop By Id
 */
ShopsRouter.get('/:id', Controllers.ShopsController.getShopByIdAction);

/**
 * 
    ============================ POST METHODS ======================================
 */

/**
 * Register A Shop Vendor
 */
ShopsRouter.post(
  '/create',
  authMiddleware.authenticate,
  authMiddleware.authorize('create_shop'),
  Validations.shopsValidation.registerShopValidator,
  Controllers.ShopsController.registerShopAction
);

/**
 * Error Routes
 */
ShopsRouter.get('*', (req, res) => {
  res.status(404).send(errorMessage);
});

ShopsRouter.head('*', (req, res) => {
  res.status(404).send(errorMessage);
});

ShopsRouter.post('*', (req, res) => {
  res.status(404).send(errorMessage);
});

ShopsRouter.put('*', (req, res) => {
  res.status(404).send(errorMessage);
});

ShopsRouter.delete('*', (req, res) => {
  res.status(404).send(errorMessage);
});

ShopsRouter.connect('*', (req, res) => {
  res.status(404).send(errorMessage);
});

ShopsRouter.options('*', (req, res) => {
  res.status(404).send(errorMessage);
});

ShopsRouter.trace('*', (req, res) => {
  res.status(404).send(errorMessage);
});

export default ShopsRouter;
