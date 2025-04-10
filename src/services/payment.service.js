const stripe = require("stripe")(require("../config/config").stripe.secretKey);
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const Order = require("../models/order.model");
const User = require("../models/user.model");
const logger = require("../config/logger");
const config = require("../config/config");

/**
 * Create a payment intent with Stripe
 * @param {Object} paymentData
 * @returns {Promise<Object>}
 */
const createPaymentIntent = async (paymentData) => {
  try {
    const {
      amount,
      currency = "usd",
      customer,
      description,
      metadata,
    } = paymentData;

    // Create or retrieve Stripe customer
    let stripeCustomer;
    if (customer.stripeCustomerId) {
      stripeCustomer = await stripe.customers.retrieve(
        customer.stripeCustomerId
      );
    } else {
      stripeCustomer = await stripe.customers.create({
        email: customer.email,
        name: customer.name,
        phone: customer.phone,
        metadata: {
          userId: customer.userId,
        },
      });

      // Update user with Stripe customer ID
      await User.findByIdAndUpdate(customer.userId, {
        "paymentDetails.stripeCustomerId": stripeCustomer.id,
      });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe requires amount in cents
      currency,
      customer: stripeCustomer.id,
      description,
      metadata: {
        ...metadata,
        orderId: metadata.orderId,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
  } catch (error) {
    logger.error("Stripe payment intent creation failed:", error);
    throw new ApiError(httpStatus.BAD_REQUEST, "Payment processing failed");
  }
};

/**
 * Handle Stripe webhook events
 * @param {Object} event
 * @returns {Promise<void>}
 */
const handleWebhookEvent = async (event) => {
  try {
    logger.info(`Processing webhook event: ${event.type}`);

    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object;
        await handlePaymentIntentSucceeded(paymentIntent);
        break;

      case "payment_intent.payment_failed":
        const failedPayment = event.data.object;
        await handlePaymentIntentFailed(failedPayment);
        break;

      case "payment_intent.created":
        const createdPayment = event.data.object;
        await handlePaymentIntentCreated(createdPayment);
        break;

      case "charge.succeeded":
        const charge = event.data.object;
        await handleChargeSucceeded(charge);
        break;

      case "charge.failed":
        const failedCharge = event.data.object;
        await handleChargeFailed(failedCharge);
        break;

      case "customer.created":
      case "customer.updated":
        const customer = event.data.object;
        await handleCustomerEvent(customer, event.type);
        break;

      // Add more event types as needed

      default:
        logger.info(`No specific handler for event type: ${event.type}`);
    }
  } catch (error) {
    logger.error("Webhook processing failed:", error);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Webhook processing failed"
    );
  }
};

/**
 * Handle successful payment
 * @param {Object} paymentIntent
 * @returns {Promise<void>}
 */
const handlePaymentIntentSucceeded = async (paymentIntent) => {
  // Update order status
  if (paymentIntent.metadata && paymentIntent.metadata.orderId) {
    const order = await Order.findById(paymentIntent.metadata.orderId);
    console.log("payment metadata", paymentIntent.metadata);
    if (order) {
      order.paymentStatus = "paid";
      order.status = "processing";
      order.paymentDetails = {
        paymentIntentId: paymentIntent.id,
        paymentMethod: paymentIntent.payment_method,
        amount: paymentIntent.amount / 100, // Convert from cents
        currency: paymentIntent.currency,
        paidAt: new Date(),
      };
      await order.save();
    }
  }
};

/**
 * Handle failed payment
 * @param {Object} paymentIntent
 * @returns {Promise<void>}
 */
const handlePaymentIntentFailed = async (paymentIntent) => {
  // Update order status
  if (paymentIntent.metadata && paymentIntent.metadata.orderId) {
    const order = await Order.findById(paymentIntent.metadata.orderId);
    if (order) {
      order.paymentStatus = "failed";
      order.paymentDetails = {
        paymentIntentId: paymentIntent.id,
        error: paymentIntent.last_payment_error
          ? paymentIntent.last_payment_error.message
          : "Payment failed",
      };
      await order.save();
    }
  }
};

/**
 * Handle payment intent created event
 * @param {Object} paymentIntent
 * @returns {Promise<void>}
 */
const handlePaymentIntentCreated = async (paymentIntent) => {
  logger.info(`Payment intent created: ${paymentIntent.id}`);

  // Update order status if needed
  if (paymentIntent.metadata && paymentIntent.metadata.orderId) {
    const order = await Order.findById(paymentIntent.metadata.orderId);
    if (order) {
      order.paymentDetails = {
        ...order.paymentDetails,
        paymentIntentId: paymentIntent.id,
        status: "pending",
        createdAt: new Date(),
      };
      await order.save();
      logger.info(
        `Updated order ${order.id} with payment intent created status`
      );
    }
  }
};

/**
 * Handle charge succeeded event
 * @param {Object} charge
 * @returns {Promise<void>}
 */
const handleChargeSucceeded = async (charge) => {
  logger.info(`Charge succeeded: ${charge.id}`);

  // Find the payment intent associated with this charge
  if (charge.payment_intent) {
    const paymentIntent = await stripe.paymentIntents.retrieve(
      charge.payment_intent
    );

    // If we have an order ID in the metadata, update the order
    if (paymentIntent.metadata && paymentIntent.metadata.orderId) {
      const order = await Order.findById(paymentIntent.metadata.orderId);
      if (order) {
        order.paymentDetails = {
          ...order.paymentDetails,
          status: "completed",
          chargeId: charge.id,
          receiptUrl: charge.receipt_url,
          paymentDate: new Date(charge.created * 1000), // Convert from Unix timestamp
        };
        await order.save();
        logger.info(`Updated order ${order.id} with charge details`);
      }
    }
  }
};

/**
 * Handle charge failed event
 * @param {Object} charge
 * @returns {Promise<void>}
 */
const handleChargeFailed = async (charge) => {
  logger.info(`Charge failed: ${charge.id}`);

  // Find the payment intent associated with this charge
  if (charge.payment_intent) {
    const paymentIntent = await stripe.paymentIntents.retrieve(
      charge.payment_intent
    );

    // If we have an order ID in the metadata, update the order
    if (paymentIntent.metadata && paymentIntent.metadata.orderId) {
      const order = await Order.findById(paymentIntent.metadata.orderId);
      if (order) {
        order.paymentStatus = "failed";
        order.paymentDetails = {
          ...order.paymentDetails,
          chargeId: charge.id,
          failureMessage: charge.failure_message,
          failureCode: charge.failure_code,
          failedAt: new Date(charge.created * 1000),
        };
        await order.save();
        logger.info(`Updated order ${order.id} with failed charge details`);
      }
    }
  }
};

/**
 * Handle customer events
 * @param {Object} customer
 * @param {string} eventType
 * @returns {Promise<void>}
 */
const handleCustomerEvent = async (customer, eventType) => {
  logger.info(`Customer event ${eventType}: ${customer.id}`);

  // Find user with this Stripe customer ID
  const user = await User.findOne({
    "paymentDetails.stripeCustomerId": customer.id,
  });
  if (user) {
    // Update user's payment details if needed
    user.paymentDetails = {
      ...user.paymentDetails,
      stripeCustomerId: customer.id,
      lastUpdated: new Date(),
    };
    await user.save();
    logger.info(`Updated user ${user.id} with customer details`);
  }
};

module.exports = {
  createPaymentIntent,
  handleWebhookEvent,
};
