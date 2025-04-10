const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { Order, Product } = require('../models');

const createOrder = catchAsync(async (req, res) => {
  // Set the user from the authenticated request
  req.body.user = req.user.id;
  
  // Validate product availability and calculate totals
  const orderItems = req.body.items;
  let subtotal = 0;
  
  // Check inventory and calculate prices
  for (const item of orderItems) {
    const product = await Product.findById(item.product);
    if (!product) {
      throw new ApiError(httpStatus.BAD_REQUEST, `Product ${item.product} not found`);
    }
    
    if (product.inventory < item.quantity) {
      throw new ApiError(
        httpStatus.BAD_REQUEST, 
        `Not enough inventory for product ${product.name}. Available: ${product.inventory}`
      );
    }
    
    // Set the price from the product
    item.price = product.price;
    subtotal += item.price * item.quantity;
    
    // Update inventory
    product.inventory -= item.quantity;
    await product.save();
  }
  
  // Calculate order totals
  const tax = subtotal * 0.1; // 10% tax rate
  const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
  const total = subtotal + tax + shipping - (req.body.discount || 0);
  
  // Create the complete order
  const order = await Order.create({
    ...req.body,
    subtotal,
    tax,
    shipping,
    total,
  });
  
  res.status(httpStatus.CREATED).send(order);
});

const getOrders = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['status', 'paymentMethod']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  
  const result = await Order.paginate(filter, options);
  res.send(result);
});

const getOrder = catchAsync(async (req, res) => {
  const order = await Order.findById(req.params.orderId).populate('user', 'name email');
  
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }
  
  // Check if the user is authorized to view this order
  if (req.user.role !== 'admin' && order.user.id !== req.user.id) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized to access this order');
  }
  
  res.send(order);
});

const updateOrder = catchAsync(async (req, res) => {
  const order = await Order.findById(req.params.orderId);
  
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }
  
  // Only allow updating certain fields
  const allowedUpdates = ['status', 'trackingNumber', 'carrier'];
  const updates = pick(req.body, allowedUpdates);
  
  Object.assign(order, updates);
  await order.save();
  
  res.send(order);
});

const getUserOrders = catchAsync(async (req, res) => {
  const filter = { user: req.user.id };
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  
  const result = await Order.paginate(filter, options);
  res.send(result);
});

module.exports = {
  createOrder,
  getOrders,
  getOrder,
  updateOrder,
  getUserOrders,
}; 