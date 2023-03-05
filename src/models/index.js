import UserModel from './user.model';
import CartModel from './cart.model copy';
import InventoryModel from './inventory.model';
import OrderItemsModel from './orders_items.model';
import OrderModel from './orders.model';
import ShopsModel from './shops.model';
import UserAddressModel from './user_address.model';

UserModel.hasMany(UserAddressModel);
UserAddressModel.hasOne(UserModel);

const models = {
  UserModel,
  UserAddressModel,
  CartModel,
  InventoryModel,
  OrderItemsModel,
  OrderModel,
  ShopsModel,
};

export default models;
