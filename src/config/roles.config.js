const roles = {
  customer: ['order'],
  vendor: ['create_shop', 'get_shops', 'create_inventory'],
};

const rolesList = Object.keys(roles);
const accessList = new Map(Object.entries(roles));

export default {
  rolesList,
  accessList,
};
