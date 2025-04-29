const httpStatus = require("http-status");
const { Order } = require("../models");
const ApiError = require("../utils/ApiError");



/**
 * Query for orders
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const queryOrders = async (filter, options) => {
  const orders = await Order.paginate(filter, options);
  return orders;
};

/**
 * Get order by id
 * @param {ObjectId} id
 * @returns {Promise<Order>}
 */
const getOrderById = async (id) => {
  return Order.findById(id);
};

/**
 * Update order by id
 * @param {ObjectId} orderId
 * @param {Object} updateBody
 * @returns {Promise<Order>}
 */
const updateOrderById = async (orderId, updateBody) => {
  const order = await getOrderById(orderId);
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, "order not found");
  }
  Object.assign(order, updateBody);
  await order.save();
  return order;
};

/**
 * Delete order by id
 * @param {ObjectId} orderId
 * @returns {Promise<Order>}
 */
const deleteOrderById = async (orderId) => {
  const order = await getOrderById(orderId);
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, "order not found");
  }
  await order.remove();
  return order;
};

/**
 * Get total number of orders
 * @returns {Promise<Number>}
 */
const getTotalOrders = async () => {
  return Order.countDocuments();
};


/**
 * Get total revenue from completed/paid orders
 * @returns {Promise<Number>}
 */
const getTotalRevenue = async () => {
  const result = await Order.aggregate([
    {
      $match: {
        "paymentDetails.status": "completed",
        status: { $nin: ["cancelled", "refunded"] },
      },
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$total" },
      },
    },
  ]);

  return result[0]?.totalRevenue || 0;
};







module.exports = {
  queryOrders,
  getOrderById,
  updateOrderById,
  deleteOrderById,
  getTotalOrders,
  getTotalRevenue
};
