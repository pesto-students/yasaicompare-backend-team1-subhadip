const roles = {
  customer: ['equity', 'asset', 'expense', 'fixedIncome'],
  vendor: ['userUpdate', 'userCreate'],
};

const rolesList = Object.keys(roles);
const accessList = new Map(Object.entries(roles));

export default {
  rolesList,
  accessList,
};
