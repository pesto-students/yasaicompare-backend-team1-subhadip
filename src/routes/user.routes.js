import express from 'express';
import Controllers from '../controllers';
import Middleware from '../middlewares';
import validations from '../middlewares/validations';

const UserRouter = express.Router();
const { authMiddleware } = Middleware;
const errorMessage = { message: 'Access Forbidden' };

/**
 * 
    ============================ GET METHODS ======================================
 */

/**
 * Get User Info
 */
UserRouter.get(
  '/info',
  authMiddleware.authenticate,
  validations.userValidation.getUserValidator,
  Controllers.UserController.getUserById
);

/**
 * Get User Address
 */
UserRouter.get(
  '/address',
  authMiddleware.authenticate,
  validations.userValidation.getAddressesValidator,
  Controllers.UserController.getAddresses
);

/**
 * Get User Address
 */
UserRouter.get(
  '/address/:id',
  authMiddleware.authenticate,
  validations.userValidation.getAddressValidator,
  Controllers.UserController.getAddresses
);

/**
 * 
    ============================ POST METHODS ======================================
 */

/**
 * Add User Address
 */
UserRouter.post(
  '/address',
  authMiddleware.authenticate,
  validations.userValidation.createAddressValidator,
  Controllers.UserController.createAddress
);

/**
 * 
    ============================ PUT METHODS ======================================
 */

/**
 * Update User Address
 */
UserRouter.put(
  '/address',
  authMiddleware.authenticate,
  validations.userValidation.updateAddressValidator,
  Controllers.UserController.updateAddress
);

/**
 * Error Routes
 */
UserRouter.get('*', (req, res) => {
  res.status(404).send(errorMessage);
});

UserRouter.head('*', (req, res) => {
  res.status(404).send(errorMessage);
});

UserRouter.post('*', (req, res) => {
  res.status(404).send(errorMessage);
});

UserRouter.put('*', (req, res) => {
  res.status(404).send(errorMessage);
});

UserRouter.delete('*', (req, res) => {
  res.status(404).send(errorMessage);
});

UserRouter.connect('*', (req, res) => {
  res.status(404).send(errorMessage);
});

UserRouter.options('*', (req, res) => {
  res.status(404).send(errorMessage);
});

UserRouter.trace('*', (req, res) => {
  res.status(404).send(errorMessage);
});

export default UserRouter;
