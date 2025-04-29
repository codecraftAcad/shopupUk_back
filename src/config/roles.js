const allRoles = {
  user: ['getProducts', 'manageOrders', 'getOwnUser', 'manageOwnUser'],
  admin: ['getUsers', 'manageUsers', 'getProducts', 'manageProducts', 'getOrders', 'manageOrders', 'getOwnUser', 'manageOwnUser'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
}; 