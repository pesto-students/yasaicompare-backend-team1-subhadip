import express from 'express';
import Controllers from '../controllers';
import validations from '../middlewares/validations';

const CategoryRouter = express.Router();
const errorMessage = { message: 'Access Forbidden' };

/**
 * 
    ============================ GET METHODS ======================================
 */

/**
 * Get Categories Info
 */
CategoryRouter.get(
  '/',
  validations.categoryValidation.getCategoriesValidator,
  Controllers.UserController.getUserById
);

/**
 * Get User Info
 */
CategoryRouter.get(
  '/',
  validations.userValidation.getUserValidator,
  Controllers.UserController.getUserById
);

/**
 * Error Routes
 */
CategoryRouter.get('*', (req, res) => {
  res.status(404).send(errorMessage);
});

CategoryRouter.head('*', (req, res) => {
  res.status(404).send(errorMessage);
});

CategoryRouter.post('*', (req, res) => {
  res.status(404).send(errorMessage);
});

CategoryRouter.put('*', (req, res) => {
  res.status(404).send(errorMessage);
});

CategoryRouter.delete('*', (req, res) => {
  res.status(404).send(errorMessage);
});

CategoryRouter.connect('*', (req, res) => {
  res.status(404).send(errorMessage);
});

CategoryRouter.options('*', (req, res) => {
  res.status(404).send(errorMessage);
});

CategoryRouter.trace('*', (req, res) => {
  res.status(404).send(errorMessage);
});

export default CategoryRouter;
