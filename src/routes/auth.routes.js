import express from 'express';
import Controllers from '../controllers';

const AuthRouter = express.Router();

AuthRouter.post('/register', Controllers.AuthController.registerAction);
AuthRouter.post('/login', Controllers.AuthController.loginAction);

export default AuthRouter;
