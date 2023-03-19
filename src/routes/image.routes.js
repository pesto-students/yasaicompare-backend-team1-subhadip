import express from 'express';
import Controllers from '../controllers';
import Middleware from '../middlewares';
import Validations from '../middlewares/validations';

const ImageRouter = express.Router();
const { authMiddleware } = Middleware;
const errorMessage = { message: 'Access Forbidden' };

/**
 * 
    ============================ GET METHODS ======================================
 */

// /**
//  * Get All the Images of Customer
//  */
// ImageRouter.get(
//   '/',
//   authMiddleware.authenticate,
//   authMiddleware.authorize('get_orders_customer'),
//   Validations.orderValidation.getOrdersValidator,
//   Controllers.OrderController.getOrdersAction
// );

/**
 * Get Image By Id
 */
// ImageRouter.get(
//   '/:id',
//   authMiddleware.authenticate,
//   authMiddleware.authorize('get_orders_customer'),
//   Validations.orderValidation.getOrderValidator,
//   Controllers.OrderController.getOrderByIdAction
// );

/**
 * 
    ============================ POST METHODS ======================================
 */

/**
 * Upload Profile Image
 */
ImageRouter.post(
  '/profile-image',
  authMiddleware.authenticate,
  authMiddleware.authorize('upload_profile_image'),
  Validations.imageValidation.uploadProfileImage,
  Controllers.ImageController.uploadProfileImage
);

/**
 * Upload Item Image
 */
ImageRouter.post(
  '/item-image',
  authMiddleware.authenticate,
  authMiddleware.authorize('upload_item_image'),
  Validations.imageValidation.uploadItemImage,
  Controllers.ImageController.uploadItemImage
);

/**
 * 
    ============================ DELETE METHODS ======================================
 */

/**
 * Error Routes
 */
ImageRouter.get('*', (req, res) => {
  res.status(404).send(errorMessage);
});

ImageRouter.head('*', (req, res) => {
  res.status(404).send(errorMessage);
});

ImageRouter.post('*', (req, res) => {
  res.status(404).send(errorMessage);
});

ImageRouter.put('*', (req, res) => {
  res.status(404).send(errorMessage);
});

ImageRouter.delete('*', (req, res) => {
  res.status(404).send(errorMessage);
});

ImageRouter.connect('*', (req, res) => {
  res.status(404).send(errorMessage);
});

ImageRouter.options('*', (req, res) => {
  res.status(404).send(errorMessage);
});

ImageRouter.trace('*', (req, res) => {
  res.status(404).send(errorMessage);
});

export default ImageRouter;
