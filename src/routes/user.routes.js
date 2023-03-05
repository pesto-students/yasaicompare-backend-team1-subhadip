import express from 'express';
import Controllers from '../controllers';
import Middleware from '../middlewares';
import validations from '../middlewares/validations';

const UserRouter = express.Router();
const { authMiddleware } = Middleware;
const errorMessage = { message: 'Access Forbidden' };

/**
 * Get User Info
 */
UserRouter.get(
  '/info',
  authMiddleware.authenticate,
  validations.userValidation.getUserValidator,
  Controllers.UserController.getUserById
);

UserRouter.get(
  '/addresses',
  authMiddleware.authenticate,
  Controllers.UserController.getAddresses
);

UserRouter.post(
  '/addresses',
  authMiddleware.authenticate,
  validations.userValidation.createAddressValidator,
  Controllers.UserController.createAddress
);

UserRouter.put(
  '/addresses',
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
