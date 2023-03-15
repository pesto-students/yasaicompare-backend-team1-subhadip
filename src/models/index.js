import UserModel from './user.model';
import CartModel from './cart.model';
import InventoryModel from './inventory.model';
import OrderItemsModel from './orders_items.model';
import OrderModel from './orders.model';
import ShopsModel from './shops.model';
import UserAddressModel from './user_address.model';
import CategoryModel from './category.model';

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
  CategoryModel,
};

export default models;
