import express from 'express';

const ErrorRouter = express.Router();
const errorMessage = { success: false, message: 'Access Forbidden' };

/**
 * 
    ============================ GET METHODS ======================================
 */

ErrorRouter.get('*', (req, res) => {
  res.status(404).send(errorMessage);
});

/**
 * 
    ============================ POST METHODS ======================================
 */

ErrorRouter.post('*', (req, res) => {
  res.status(404).send(errorMessage);
});

export default ErrorRouter;
