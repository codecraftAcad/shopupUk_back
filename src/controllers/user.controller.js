const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');
const { User } = require('../models');

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role', 'email']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userService.queryUsers(filter, options);
  res.send(result);
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.params.userId, req.body);
  res.send(user);
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

const getCurrentUser = catchAsync(async (req, res) => {
  console.log("getCurrentUser called, user:", req.user);
  res.send(req.user);
});

const updateCurrentUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.user.id, req.body);
  res.send(user);
});

const getUserAddresses = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.user.id);
  res.send(user.addresses || []);
});

const addUserAddress = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.user.id);
  
  if (!user.addresses) {
    user.addresses = [];
  }
  
  user.addresses.push(req.body);
  await user.save();
  
  res.status(httpStatus.CREATED).send(user.addresses[user.addresses.length - 1]);
});

const updateUserAddress = catchAsync(async (req, res) => {
  const { addressId } = req.params;
  const user = await userService.getUserById(req.user.id);
  
  if (!user.addresses || !user.addresses.id) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Address not found');
  }
  
  const addressIndex = user.addresses.findIndex(addr => addr.id === addressId);
  if (addressIndex === -1) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Address not found');
  }
  
  user.addresses[addressIndex] = { ...user.addresses[addressIndex], ...req.body };
  await user.save();
  
  res.send(user.addresses[addressIndex]);
});

const deleteUserAddress = catchAsync(async (req, res) => {
  const { addressId } = req.params;
  const user = await userService.getUserById(req.user.id);
  
  if (!user.addresses) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Address not found');
  }
  
  user.addresses = user.addresses.filter(addr => addr.id !== addressId);
  await user.save();
  
  res.status(httpStatus.NO_CONTENT).send();
});



module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getCurrentUser,
  updateCurrentUser,
  getUserAddresses,
  addUserAddress,
  updateUserAddress,
  deleteUserAddress,
 
}; 