const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { paymentService } = require("../services");
const config = require("../config/config");
const { Order } = require("../models");
const ApiError = require("../utils/ApiError");
const stripe = require("stripe")(config.stripe.secretKey);

const createPaymentIntent = catchAsync(async (req, res) => {
  // Get the order
  const order = await Order.findById(req.body.orderId);
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, "Order not found");
  }

  // Check if the user is authorized to pay for this order
  if (order.user.toString() !== req.user.id) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "Not authorized to pay for this order"
    );
  }

  // Create payment intent
  const paymentIntent = await paymentService.createPaymentIntent({
    amount: order.total,
    currency: "gbp",
    customer: {
      userId: req.user.id,
      email: req.user.email,
      name: req.user.name,
      phone: req.user.phone,
      stripeCustomerId: req.user.paymentDetails?.stripeCustomerId,
    },
    description: `Payment for order #${order.id}`,
    metadata: {
      orderId: order.id,
    },
  });

  res.send(paymentIntent);
});

const handleWebhook = catchAsync(async (req, res) => {
  const signature = req.headers["stripe-signature"];
  const webhookSecret = config.stripe.webhookSecret;

  console.log("Received webhook event");

  try {
    let event;

    // Check if we have the raw body
    if (req.rawBody) {
      // Use the raw body string
      event = stripe.webhooks.constructEvent(
        req.rawBody,
        signature,
        webhookSecret
      );
    } else if (Buffer.isBuffer(req.body)) {
      // If body is already a buffer (from express.raw)
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        webhookSecret
      );
    } else {
      throw new Error(
        "No raw body available for webhook signature verification"
      );
    }

    console.log("Webhook event verified:", event.type);

    // Handle the event
    await paymentService.handleWebhookEvent(event);

    res.status(200).send({ received: true });
  } catch (err) {
    console.error("Webhook error:", err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

const processPayment = catchAsync(async (req, res) => {
  const { paymentMethodId, orderId } = req.body;

  // Get the order
  const order = await Order.findById(orderId);
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, "Order not found");
  }

  // Check if the user is authorized to pay for this order
  if (order.user.toString() !== req.user.id) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "Not authorized to pay for this order"
    );
  }

  // Process the payment with Stripe
  const stripe = require("stripe")(config.stripe.secretKey);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(order.total * 100), // Convert to cents
    currency: "gbp",
    payment_method: paymentMethodId,
    confirm: true,
    return_url: `${config.clientUrl}/order-confirmation?orderId=${order.id}`,
    metadata: {
      orderId: order.id,
      userId: req.user.id,
    },
  });

  // Update order with payment information
  order.paymentStatus =
    paymentIntent.status === "succeeded" ? "paid" : "pending";
  order.paymentDetails = {
    paymentIntentId: paymentIntent.id,
    paymentMethodId: paymentMethodId,
    status: paymentIntent.status,
  };

  if (paymentIntent.status === "succeeded") {
    order.status = "processing";
  }

  await order.save();

  res.send({
    success: paymentIntent.status === "succeeded",
    paymentIntentId: paymentIntent.id,
    clientSecret: paymentIntent.client_secret,
    status: paymentIntent.status,
  });
});

module.exports = {
  createPaymentIntent,
  handleWebhook,
  processPayment,
};
