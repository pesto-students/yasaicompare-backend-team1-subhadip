const roles = {
  customer: ['create_order', 'get_orders_customer', 'create_order'],
  vendor: [
    'create_shop',
    'get_shops',
    'update_shop',
    'create_inventory',
    'update_inventory',
    'get_owners_shop',
  ],
};

const rolesList = Object.keys(roles);
const accessList = new Map(Object.entries(roles));

export default {
  rolesList,
  accessList,
};
