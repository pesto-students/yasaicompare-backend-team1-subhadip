import express from 'express';
import Controllers from '../controllers';

const ShopsRouter = express.Router();

ShopsRouter.get('/', Controllers.ShopsController.getShops);
ShopsRouter.get('/:id', Controllers.ShopsController.getShopById);

ShopsRouter.post('/create', Controllers.ShopsController.createShop);

export default ShopsRouter;
