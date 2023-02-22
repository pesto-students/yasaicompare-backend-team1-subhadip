import express from 'express';
import Controllers from '../controllers';
import Middleware from '../middlewares';

const InventoryRouter = express.Router();
const AuthMiddleware = Middleware.authMiddleware;

/**
 * 
    ============================ GET METHODS ======================================
 */

/**
 * Get All the Inventory of Shop
 */
InventoryRouter.get(
  '/',
  AuthMiddleware.auth('get_inventory'),
  Controllers.InventoryController.getAllInventoryAction
);

/**
 * Get Shop By Id
 */
InventoryRouter.get(
  '/:shop_id',
  AuthMiddleware.auth('get_inventory'),
  Controllers.InventoryController.getInventoryByIdAction
);

/**
 * 
    ============================ POST METHODS ======================================
 */

/**
 * Create An Item in Shop
 */
InventoryRouter.post(
  '/create',
  AuthMiddleware.auth('create_inventory'),
  Controllers.InventoryController.createInventoryAction
);

export default InventoryRouter;
