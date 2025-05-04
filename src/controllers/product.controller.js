const httpStatus = require("http-status");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { Product } = require("../models");

const createProduct = catchAsync(async (req, res) => {
  const product = await Product.create(req.body);
  res.status(httpStatus.CREATED).send(product);
});

const getProducts = catchAsync(async (req, res) => {
  const filter = pick(req.query, [
    "name",
    "category",
    "subcategory",
    "isActive",
    "price",
    "isNew",
    "featured",
  ]);

  const options = pick(req.query, ["sortBy", "limit", "page"]);

  // Handle price range filtering
  if (req.query.minPrice || req.query.maxPrice) {
    filter.price = {};
    if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
    if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
  }

  // Handle text search
  if (req.query.search) {
    filter.$text = { $search: req.query.search };
  }

  // Convert string boolean values to actual booleans
  if (filter.isNew !== undefined) {
    filter.isNew = filter.isNew === "true";
  }

  if (filter.featured !== undefined) {
    filter.featured = filter.featured === "true";
  }

  if (filter.isActive !== undefined) {
    filter.isActive = filter.isActive === "true";
  }

  // Handle category filtering
if (filter.category && typeof filter.category === "string") {
  const categories = filter.category.split(",").map((c) => c.trim());
  filter.category = { $in: categories };
}


  const result = await Product.paginate(filter, options);
  res.send(result);
});

const getProduct = catchAsync(async (req, res) => {
  const product = await Product.findById(req.params.productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, "Product not found");
  }
  res.send(product);
});

const updateProduct = catchAsync(async (req, res) => {
  const product = await Product.findById(req.params.productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, "Product not found");
  }

  Object.assign(product, req.body);
  await product.save();

  res.send(product);
});

const deleteProduct = catchAsync(async (req, res) => {
  const product = await Product.findById(req.params.productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, "Product not found");
  }

  await Product.deleteOne({ _id: product._id });
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
};
