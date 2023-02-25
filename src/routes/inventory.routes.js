import express from 'express';
import Controllers from '../controllers';
import Middleware from '../middlewares';

const InventoryRouter = express.Router();

/**
 * 
    ============================ GET METHODS ======================================
 */

/**
 * Get All the Inventory of Shop
 */
InventoryRouter.get('/', Controllers.InventoryController.getAllInventoryAction);

/**
 * Get Shop By Id
 */
InventoryRouter.get(
  '/:shop_id',
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
  Controllers.InventoryController.createInventoryAction
);

export default InventoryRouter;
