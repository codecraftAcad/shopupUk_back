const express = require("express");
const auth = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const paymentValidation = require("../../validations/payment.validation");
const paymentController = require("../../controllers/payment.controller");

const router = express.Router();

router
  .route("/create-payment-intent")
  .post(
    auth(),
    validate(paymentValidation.createPaymentIntent),
    paymentController.createPaymentIntent
  );

router
  .route("/process")
  .post(
    auth(),
    validate(paymentValidation.processPayment),
    paymentController.processPayment
  );

module.exports = router;
