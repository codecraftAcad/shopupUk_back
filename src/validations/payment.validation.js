const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createPaymentIntent = {
  body: Joi.object().keys({
    orderId: Joi.string().custom(objectId).required(),
  }),
};

const processPayment = {
  body: Joi.object().keys({
    paymentMethodId: Joi.string().required(),
    orderId: Joi.string().custom(objectId).required(),
  }),
};

module.exports = {
  createPaymentIntent,
  processPayment,
}; 