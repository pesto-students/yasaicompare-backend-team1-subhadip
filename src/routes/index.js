import express from 'express';
import DemoRoutes from './demo.routes';
import UserRoutes from './user.routes';
import ShopsRoutes from './shops.routes';
import AuthRoutes from './auth.routes';
import InventoryRoutes from './inventory.routes';
import OrderRoutes from './order.routes';
import ErrorRoutes from './error.routes';

const Router = express.Router();

const routes = [
  {
    path: '/demo',
    route: DemoRoutes,
  },
  {
    path: '/user',
    route: UserRoutes,
  },
  {
    path: '/shops',
    route: ShopsRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/inventory',
    route: InventoryRoutes,
  },
  {
    path: '/order',
    route: OrderRoutes,
  },
  {
    path: '*',
    route: ErrorRoutes,
  },
];

routes.forEach((route) => {
  Router.use(route.path, route.route);
});

export default Router;
