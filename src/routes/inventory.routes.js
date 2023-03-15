import express from 'express';
import Controllers from '../controllers';
import Validations from '../middlewares/validations';
import Middleware from '../middlewares';

const InventoryRouter = express.Router();
const { authMiddleware } = Middleware;
const errorMessage = { message: 'Access Forbidden' };

/**
 * 
    ============================ GET METHODS ======================================
 */

/**
 * Get All the Inventory of Shop
 */
InventoryRouter.get(
  '/:shop_id',
  Validations.inventoryValidation.getAllInventoryValidator,
  Controllers.InventoryController.getAllInventoryAction
);

/**
 * Get Shop By Id
 */
InventoryRouter.get(
  '/:shop_id/:inventory_id',
  Validations.inventoryValidation.getInventoryValidator,
  Controllers.InventoryController.getInventoryByIdAction
);

/**
 * 
    ============================ PUT METHODS ======================================
 */

/**
 * Update An Inventory in Shop
 */
InventoryRouter.put(
  '/:shop_id/:inventory_id',
  authMiddleware.authenticate,
  authMiddleware.authorize('update_inventory'),
  Validations.inventoryValidation.updateInventoryValidator,
  Controllers.InventoryController.updateInventoryAction
);

/**
 * 
    ============================ POST METHODS ======================================
 */

/**
 * Create An Inventory in Shop
 */
InventoryRouter.post(
  '/:shop_id/create',
  authMiddleware.authenticate,
  authMiddleware.authorize('create_inventory'),
  Validations.inventoryValidation.createInventoryValidator,
  Controllers.InventoryController.createInventoryAction
);

/**
 * Error Routes
 */
InventoryRouter.get('*', (req, res) => {
  res.status(404).send(errorMessage);
});

InventoryRouter.head('*', (req, res) => {
  res.status(404).send(errorMessage);
});

InventoryRouter.post('*', (req, res) => {
  res.status(404).send(errorMessage);
});

InventoryRouter.put('*', (req, res) => {
  res.status(404).send(errorMessage);
});

InventoryRouter.delete('*', (req, res) => {
  res.status(404).send(errorMessage);
});

InventoryRouter.connect('*', (req, res) => {
  res.status(404).send(errorMessage);
});

InventoryRouter.options('*', (req, res) => {
  res.status(404).send(errorMessage);
});

InventoryRouter.trace('*', (req, res) => {
  res.status(404).send(errorMessage);
});

export default InventoryRouter;
