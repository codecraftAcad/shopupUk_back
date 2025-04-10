const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createOrder = {
  body: Joi.object().keys({
    items: Joi.array()
      .items(
        Joi.object().keys({
          product: Joi.string().custom(objectId).required(),
          quantity: Joi.number().integer().min(1).required(),
          variant: Joi.object().keys({
            name: Joi.string(),
            option: Joi.string(),
          }),
        })
      )
      .min(1)
      .required(),
    billingAddress: Joi.object()
      .keys({
        fullName: Joi.string().required(),
        street: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().required(),
        zipCode: Joi.string().required(),
        country: Joi.string().required(),
        phone: Joi.string(),
      })
      .required(),
    shippingAddress: Joi.object()
      .keys({
        fullName: Joi.string().required(),
        street: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().required(),
        zipCode: Joi.string().required(),
        country: Joi.string().required(),
        phone: Joi.string(),
      })
      .required(),
    paymentMethod: Joi.string().valid('credit_card', 'paypal', 'stripe', 'bank_transfer').required(),
    couponCode: Joi.string(),
    notes: Joi.string(),
    discount: Joi.number().min(0),
  }),
};

const getOrders = {
  query: Joi.object().keys({
    status: Joi.string().valid('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'),
    paymentMethod: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getOrder = {
  params: Joi.object().keys({
    orderId: Joi.string().custom(objectId),
  }),
};

const updateOrder = {
  params: Joi.object().keys({
    orderId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      status: Joi.string().valid('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'),
      trackingNumber: Joi.string(),
      carrier: Joi.string(),
    })
    .min(1),
};

module.exports = {
  createOrder,
  getOrders,
  getOrder,
  updateOrder,
}; 