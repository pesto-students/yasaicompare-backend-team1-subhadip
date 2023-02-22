import express from 'express';
import Controllers from '../controllers';
import validations from '../middlewares/validations';

const AuthRouter = express.Router();

AuthRouter.post('/register', validations.authValidation.registerValidator ,Controllers.AuthController.registerAction);
AuthRouter.post('/login', validations.authValidation.loginValidator, Controllers.AuthController.loginAction);

export default AuthRouter;
