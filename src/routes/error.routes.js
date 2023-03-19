import express from 'express';

const ErrorRouter = express.Router();
const errorMessage = { message: 'Access Forbidden' };

/**
 * Error Routes
 */
ErrorRouter.get('*', (req, res) => {
  res.status(404).send(errorMessage);
});

ErrorRouter.head('*', (req, res) => {
  res.status(404).send(errorMessage);
});

ErrorRouter.post('*', (req, res) => {
  res.status(404).send(errorMessage);
});

ErrorRouter.put('*', (req, res) => {
  res.status(404).send(errorMessage);
});

ErrorRouter.delete('*', (req, res) => {
  res.status(404).send(errorMessage);
});

ErrorRouter.connect('*', (req, res) => {
  res.status(404).send(errorMessage);
});

ErrorRouter.options('*', (req, res) => {
  res.status(404).send(errorMessage);
});

ErrorRouter.trace('*', (req, res) => {
  res.status(404).send(errorMessage);
});

export default ErrorRouter;
