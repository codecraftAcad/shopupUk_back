const Joi = require("joi");
const { objectId } = require("./custom.validation");

const getProducts = {
  query: Joi.object().keys({
    filter: Joi.string(),
    options: Joi.string(),
    tabIndex: Joi.string()
  }),
};

const getProduct = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectId),
  }),
};

const createProduct = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
    category: Joi.string().required(),
    subcategory: Joi.string().optional().allow(""),
    inventory: Joi.number().required(),

    images: Joi.array().items(
      Joi.object({
        url: Joi.string().uri().optional().allow(""),
        alt: Joi.string().required(),
      })
    ),

    attributes: Joi.array().items(
      Joi.object({
        name: Joi.string().optional().allow(""),
        value: Joi.string().optional().allow(""),
      })
    ),
  }),
};


const updateProduct = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      description: Joi.string(),
      price: Joi.number(),
      category: Joi.string(),
      stock: Joi.number(),
      images: Joi.array().items(Joi.string()),
    })
    .min(1),
};

const deleteProduct = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectId),
  }),
};

const getOrders = {
  query: Joi.object().keys({
    filter: Joi.string(),
    options: Joi.string(),
  }),
};

const getOrder = {
  params: Joi.object().keys({
    orderId: Joi.string().custom(objectId),
  }),
};

const updateOrder = {
  params: Joi.object().keys({
    orderId: Joi.string().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      status: Joi.string().valid(
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled"
      ),
      trackingNumber: Joi.string(),
    })
    .min(1),
};

const getUsers = {
  query: Joi.object().keys({
    filter: Joi.string(),
    options: Joi.string(),
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const createUser = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().required(),
    role: Joi.string().valid("user", "admin"),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      password: Joi.string(),
      name: Joi.string(),
      role: Joi.string().valid("user", "admin"),
    })
    .min(1),
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const getCategories = {
  query: Joi.object().keys({
    filter: Joi.string(),
    options: Joi.string(),
  }),
};

const createCategory = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string(),
  }),
};

const updateCategory = {
  params: Joi.object().keys({
    categoryId: Joi.string().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      description: Joi.string(),
    })
    .min(1),
};

const deleteCategory = {
  params: Joi.object().keys({
    categoryId: Joi.string().custom(objectId),
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
};

module.exports = {
  login,
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
};
