const Joi = require("joi");
const { objectId } = require("./custom.validation");

const createProduct = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required().min(0),
    compareAtPrice: Joi.number().min(0),
    images: Joi.array().items(
      Joi.object().keys({
        url: Joi.string().required(),
        alt: Joi.string(),
      })
    ),
    category: Joi.string().required(),
    subcategory: Joi.string(),
    inventory: Joi.number().integer().min(0),
    sku: Joi.string(),
    weight: Joi.number().min(0),
    dimensions: Joi.object().keys({
      length: Joi.number(),
      width: Joi.number(),
      height: Joi.number(),
    }),
    isActive: Joi.boolean(),
    isNew: Joi.boolean(),
    featured: Joi.boolean(),
    tags: Joi.array().items(Joi.string()),
    attributes: Joi.array().items(
      Joi.object().keys({
        name: Joi.string().required(),
        value: Joi.string().required(),
      })
    ),
    variants: Joi.array().items(
      Joi.object().keys({
        name: Joi.string().required(),
        options: Joi.array().items(
          Joi.object().keys({
            name: Joi.string().required(),
            price: Joi.number().min(0),
            inventory: Joi.number().integer().min(0),
            sku: Joi.string(),
          })
        ),
      })
    ),
  }),
};

const getProducts = {
  query: Joi.object().keys({
    name: Joi.string(),
    category: Joi.string(),
    subcategory: Joi.string(),
    isActive: Joi.boolean(),
    isNew: Joi.boolean(),
    featured: Joi.boolean(),
    price: Joi.number(),
    minPrice: Joi.number(),
    maxPrice: Joi.number(),
    search: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getProduct = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectId),
  }),
};

const updateProduct = {
  params: Joi.object().keys({
    productId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      description: Joi.string(),
      price: Joi.number().min(0),
      compareAtPrice: Joi.number().min(0),
      images: Joi.array().items(
        Joi.object().keys({
          url: Joi.string().required(),
          alt: Joi.string(),
        })
      ),
      category: Joi.string(),
      subcategory: Joi.string(),
      inventory: Joi.number().integer().min(0),
      sku: Joi.string(),
      weight: Joi.number().min(0),
      dimensions: Joi.object().keys({
        length: Joi.number(),
        width: Joi.number(),
        height: Joi.number(),
      }),
      isActive: Joi.boolean(),
      isNew: Joi.boolean(),
      featured: Joi.boolean(),
      tags: Joi.array().items(Joi.string()),
      attributes: Joi.array().items(
        Joi.object().keys({
          name: Joi.string().required(),
          value: Joi.string().required(),
        })
      ),
      variants: Joi.array().items(
        Joi.object().keys({
          name: Joi.string().required(),
          options: Joi.array().items(
            Joi.object().keys({
              name: Joi.string().required(),
              price: Joi.number().min(0),
              inventory: Joi.number().integer().min(0),
              sku: Joi.string(),
            })
          ),
        })
      ),
    })
    .min(1),
};

const deleteProduct = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
};
