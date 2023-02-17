import express from 'express';
import Controllers from '../controllers';
import Middleware from '../middlewares';

const ShopsRouter = express.Router();
const AuthMiddleware = Middleware.authMiddleware;

/**
 * Get All the Shops of the Vendor
 */
ShopsRouter.get(
  '/',
  AuthMiddleware.auth('get_shops'),
  Controllers.ShopsController.getShopsAction
);

/**
 * Get Shop By Id
 */
ShopsRouter.get(
  '/:id',
  AuthMiddleware.auth('get_shops'),
  Controllers.ShopsController.getShopByIdAction
);

/**
 * Register A Shop Vendor
 */
ShopsRouter.post(
  '/create',
  AuthMiddleware.auth('create_shop'),
  Controllers.ShopsController.createShopAction
);

/**
 * Create An Item in Shop
 */
ShopsRouter.post(
  '/create_inventory',
  AuthMiddleware.auth('create_inventory'),
  Controllers.ShopsController.createInventoryAction
);

export default ShopsRouter;
