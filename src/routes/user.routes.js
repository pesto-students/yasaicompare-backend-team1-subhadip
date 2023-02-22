import express from 'express';
import Controllers from '../controllers';

const UserRouter = express.Router();

UserRouter.get('/', Controllers.UserController.getUsers);
UserRouter.get('/:id', Controllers.UserController.getUserById);

export default UserRouter;
