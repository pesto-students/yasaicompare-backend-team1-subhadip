import express from 'express';
import Controllers from '../controllers';
import validations from '../middlewares/validations';

const AuthRouter = express.Router();
const errorMessage = { message: 'Access Forbidden' };

AuthRouter.post(
  '/register',
  validations.authValidation.registerValidator,
  Controllers.AuthController.registerAction
);

AuthRouter.post(
  '/login',
  validations.authValidation.loginValidator,
  Controllers.AuthController.loginAction
);

AuthRouter.post(
  '/refresh-token',
  validations.authValidation.refreshValidator,
  Controllers.AuthController.refreshTokenAction
);

/**
 * Error Routes
 */
AuthRouter.get('*', (req, res) => {
  res.status(404).send(errorMessage);
});

AuthRouter.head('*', (req, res) => {
  res.status(404).send(errorMessage);
});

AuthRouter.post('*', (req, res) => {
  res.status(404).send(errorMessage);
});

AuthRouter.put('*', (req, res) => {
  res.status(404).send(errorMessage);
});

AuthRouter.delete('*', (req, res) => {
  res.status(404).send(errorMessage);
});

AuthRouter.connect('*', (req, res) => {
  res.status(404).send(errorMessage);
});

AuthRouter.options('*', (req, res) => {
  res.status(404).send(errorMessage);
});

AuthRouter.trace('*', (req, res) => {
  res.status(404).send(errorMessage);
});

export default AuthRouter;
