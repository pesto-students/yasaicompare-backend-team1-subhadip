const roles = {
  customer: ['create_order', 'get_inventory', 'get_orders'],
  vendor: ['create_shop', 'get_shops', 'create_inventory', 'get_inventory'],
};

const rolesList = Object.keys(roles);
const accessList = new Map(Object.entries(roles));

export default {
  rolesList,
  accessList,
};
