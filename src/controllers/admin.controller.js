const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const {
  userService,
  tokenService,
  authService,
  emailService,
  productService,
  orderService,
} = require("../services");
const ApiError = require("../utils/ApiError");
const { User } = require("../models");

// Dashboard Statistics
const getDashboardStats = catchAsync(async (req, res) => {
  const stats = await Promise.all([
    userService.getTotalUsers(),
    orderService.getTotalOrders(),
    orderService.getTotalRevenue(),
    productService.getTotalProducts(),
  ]);

  res.send({
    totalUsers: stats[0],
    totalOrders: stats[1],
    totalRevenue: stats[2],
    totalProducts: stats[3],
  });
});

// Product Management
const getProducts = catchAsync(async (req, res) => {
  const filter = req.query.filter ? JSON.parse(req.query.filter) : {};
  const options = req.query.options ? JSON.parse(req.query.options) : {};
  const tabIndex = parseInt(req.query.tabIndex) || 0;

  // Inject inventory filter based on tabIndex
  if (tabIndex === 1) {
    filter.inventory = { $gt: 10 }; // In stock
  } else if (tabIndex === 2) {
    filter.inventory = { $gt: 0, $lte: 10 }; // Low stock
  } else if (tabIndex === 3) {
    filter.inventory = 0; // Out of stock
  }
  const products = await productService.queryProducts(filter, options);
  res.send(products);
});

const getProduct = catchAsync(async (req, res) => {
  const product = await productService.getProductById(req.params.productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, "Product not found");
  }
  res.send(product);
});

const createProduct = catchAsync(async (req, res) => {
  const product = await productService.createProduct(req.body);
  console.log(req.body);
  res.status(httpStatus.CREATED).send(product);
});

const updateProduct = catchAsync(async (req, res) => {
  const product = await productService.updateProductById(
    req.params.productId,
    req.body
  );
  res.send(product);
});

const deleteProduct = catchAsync(async (req, res) => {
  await productService.deleteProductById(req.params.productId);
  res.status(httpStatus.NO_CONTENT).send();
});

// Order Management
const getOrders = catchAsync(async (req, res) => {
  const filter = req.query.filter ? JSON.parse(req.query.filter) : {};
  const options = req.query.options ? JSON.parse(req.query.options) : {};
  const orders = await orderService.queryOrders(filter, options);
  res.send(orders);
});

const getOrder = catchAsync(async (req, res) => {
  const order = await orderService.getOrderById(req.params.orderId);
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, "Order not found");
  }
  res.send(order);
});

const updateOrder = catchAsync(async (req, res) => {
  const order = await orderService.updateOrderById(
    req.params.orderId,
    req.body
  );
  res.send(order);
});

// User Management
const getUsers = catchAsync(async (req, res) => {
  const filter = req.query.filter ? JSON.parse(req.query.filter) : {};
  const options = req.query.options ? JSON.parse(req.query.options) : {};
  const users = await userService.queryUsers(filter, options);
  res.send(users);
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  res.send(user);
});

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.params.userId, req.body);
  res.send(user);
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

// Category Management
const getCategories = catchAsync(async (req, res) => {
  const categories = await productService.getCategories();
  res.send(categories);
});

const createCategory = catchAsync(async (req, res) => {
  const category = await productService.createCategory(req.body);
  res.status(httpStatus.CREATED).send(category);
});

const updateCategory = catchAsync(async (req, res) => {
  const category = await productService.updateCategoryById(
    req.params.categoryId,
    req.body
  );
  res.send(category);
});

const deleteCategory = catchAsync(async (req, res) => {
  await productService.deleteCategoryById(req.params.categoryId);
  res.status(httpStatus.NO_CONTENT).send();
});

const getTotalUsers = async () => {
  return User.countDocuments();
};

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);

  // Verify admin role
  if (user.role !== "admin") {
    throw new ApiError(httpStatus.FORBIDDEN, "Access denied. Admin only.");
  }

  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
});

module.exports = {
  login,
  getDashboardStats,
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getOrders,
  getOrder,
  updateOrder,
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getTotalUsers,
};
