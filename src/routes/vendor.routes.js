import express from 'express';
import Controllers from '../controllers';
import Middleware from '../middlewares';
import Validations from '../middlewares/validations';

const VendorRouter = express.Router();
const { authMiddleware } = Middleware;
const errorMessage = { message: 'Access Forbidden' };

/**
 * 
    ============================ GET METHODS ======================================
 */

/**
 * Get All Shops
 */
VendorRouter.get(
  '/shops',
  authMiddleware.authenticate,
  authMiddleware.authorize('get_owners_shop'),
  Validations.vendorValidation.getShopsValidator,
  Controllers.VendorController.getShopsAction
);

/**
 * Get Shop By Id
 */
VendorRouter.get(
  '/shops/:shop_id',
  authMiddleware.authenticate,
  authMiddleware.authorize('get_owners_shop'),
  Validations.vendorValidation.getShopValidator,
  Controllers.VendorController.getShopsAction
);

/**
 * Get All Orders
 */
VendorRouter.get(
  '/order/:shop_id',
  authMiddleware.authenticate,
  authMiddleware.authorize('get_shop_orders'),
  Validations.vendorValidation.getShopOrdersValidator,
  Controllers.VendorController.getOrdersAction
);

/**
 * Get Order By Id
 */
VendorRouter.get(
  '/order/:shop_id/:order_id',
  authMiddleware.authenticate,
  authMiddleware.authorize('get_shop_orders'),
  Validations.vendorValidation.getShopOrderValidator,
  Controllers.VendorController.getShopByIdAction
);

/**
 * 
    ============================ PUT METHODS ======================================
 */

/**
 * Manage Order By Id
 */
VendorRouter.put(
  '/order/:shop_id/:order_id',
  authMiddleware.authenticate,
  authMiddleware.authorize('update_shop_orders'),
  Validations.vendorValidation.getShopOrderValidator,
  Controllers.VendorController.getShopByIdAction
);

/**
 * Error Routes
 */
VendorRouter.get('*', (req, res) => {
  res.status(404).send(errorMessage);
});

VendorRouter.head('*', (req, res) => {
  res.status(404).send(errorMessage);
});

VendorRouter.post('*', (req, res) => {
  res.status(404).send(errorMessage);
});

VendorRouter.put('*', (req, res) => {
  res.status(404).send(errorMessage);
});

VendorRouter.delete('*', (req, res) => {
  res.status(404).send(errorMessage);
});

VendorRouter.connect('*', (req, res) => {
  res.status(404).send(errorMessage);
});

VendorRouter.options('*', (req, res) => {
  res.status(404).send(errorMessage);
});

VendorRouter.trace('*', (req, res) => {
  res.status(404).send(errorMessage);
});

export default VendorRouter;
