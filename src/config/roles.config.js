const roles = {
  customer: ['create_order', 'get_orders_customer', 'create_order', 'cart'],
  vendor: [
    'create_shop',
    'get_shops',
    'update_shop',
    'create_inventory',
    'update_inventory',
    'get_owners_shop',
    'get_shop_orders',
  ],
};

const rolesList = Object.keys(roles);
const accessList = new Map(Object.entries(roles));

export default {
  rolesList,
  accessList,
};
