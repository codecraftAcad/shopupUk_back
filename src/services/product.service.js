const httpStatus = require("http-status");
const { Product } = require("../models");
const ApiError = require("../utils/ApiError");

/**
 * Create a product
 * @param {Object} productBody
 * @returns {Promise<Product>}
 */
const createProduct = async (productBody) => {
  return Product.create(productBody);
};

/**
 * Query for products
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const queryProducts = async (filter, options) => {
  const products = await Product.paginate(filter, options);
  return products;
};

/**
 * Get product by id
 * @param {ObjectId} id
 * @returns {Promise<Product>}
 */
const getProductById = async (id) => {
  return Product.findById(id);
};

/**
 * Update product by id
 * @param {ObjectId} productId
 * @param {Object} updateBody
 * @returns {Promise<Product>}
 */
const updateProductById = async (productId, updateBody) => {
  const product = await getProductById(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, "Product not found");
  }
  Object.assign(product, updateBody);
  await product.save();
  return product;
};

/**
 * Delete product by id
 * @param {ObjectId} productId
 * @returns {Promise<Product>}
 */
const deleteProductById = async (productId) => {
  const product = await getProductById(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, "Product not found");
  }
  await product.remove();
  return product;
};

/**
 * Get total number of products
 * @returns {Promise<Number>}
 */
const getTotalProducts = async () => {
  return Product.countDocuments();
};

/**
 * Get all categories
 * @returns {Promise<Array>}
 */
const getCategories = async () => {
  return Product.distinct("category");
};

/**
 * Create a new category
 * @param {Object} categoryBody
 * @returns {Promise<Category>}
 */
const createCategory = async (categoryBody) => {
  const exists = await Product.exists({ category: categoryBody.name });
  if (exists) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Category already exists");
  }
  // Since we're using category as a field in Product model
  // We'll create a product with this category
  return categoryBody;
};

/**
 * Update category
 * @param {ObjectId} categoryId - old category name
 * @param {Object} updateBody - new category details
 * @returns {Promise}
 */
const updateCategoryById = async (categoryId, updateBody) => {
  const result = await Product.updateMany(
    { category: categoryId },
    { $set: { category: updateBody.name } }
  );
  if (result.matchedCount === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, "Category not found");
  }
  return { name: updateBody.name };
};

/**
 * Delete category
 * @param {string} categoryId - category name
 * @returns {Promise}
 */
const deleteCategoryById = async (categoryId) => {
  const result = await Product.deleteMany({ category: categoryId });
  if (result.deletedCount === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, "Category not found");
  }
  return { message: "Category deleted" };
};

module.exports = {
  createProduct,
  queryProducts,
  getProductById,
  updateProductById,
  deleteProductById,
  getTotalProducts,
  getCategories,
  createCategory,
  updateCategoryById,
  deleteCategoryById,
};
