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
