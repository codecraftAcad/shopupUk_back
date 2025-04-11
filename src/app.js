const express = require("express");
const helmet = require("helmet");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const compression = require("compression");
const cors = require("cors");
const passport = require("passport");
const httpStatus = require("http-status");
const config = require("./config/config");
const morgan = require("./config/morgan");
const { jwtStrategy } = require("./config/passport");
const { authLimiter } = require("./middlewares/rateLimiter");
const routes = require("./routes/v1");
const { errorConverter, errorHandler } = require("./middlewares/error");
const ApiError = require("./utils/ApiError");
const { paymentService } = require("./services");

const app = express();

// Trust proxy - add this line to fix the rate limiter issue
app.set("trust proxy", 1);

// Set security HTTP headers
app.use(helmet());

// Add this BEFORE any body parsers
const rawBodySaver = (req, res, buf, encoding) => {
  if (buf && buf.length) {
    req.rawBody = buf.toString(encoding || "utf8");
  }
};

// Create a special router just for the webhook endpoint
const webhookRouter = express.Router();
app.use("/v1/payments/webhook", webhookRouter);

// Use raw body parser only for the webhook route
webhookRouter.use(express.raw({ type: "application/json" }));

// Add the webhook route handler directly
webhookRouter.post("/", (req, res) => {
  const signature = req.headers["stripe-signature"];
  const webhookSecret = config.stripe.webhookSecret;
  const stripe = require("stripe")(config.stripe.secretKey);

  console.log("Received webhook event");

  try {
    // The body is already a Buffer when using express.raw
    const event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      webhookSecret
    );

    console.log("Webhook event verified:", event.type);

    // Handle the event asynchronously
    paymentService
      .handleWebhookEvent(event)
      .then(() => {
        console.log("Webhook event processed successfully");
      })
      .catch((err) => {
        console.error("Error processing webhook event:", err);
      });

    // Respond immediately to acknowledge receipt
    res.status(200).send({ received: true });
  } catch (err) {
    console.error("Webhook signature verification error:", err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

// Regular body parsers for all other routes
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Sanitize request data
app.use(xss());
app.use(mongoSanitize());

// Gzip compression
app.use(compression());

// Enable cors
app.use(cors());
app.options("*", cors());

// JWT authentication
app.use(passport.initialize());
passport.use("jwt", jwtStrategy);

// Limit repeated failed requests to auth endpoints
if (config.env === "production") {
  app.use("/v1/auth", authLimiter);
}

// v1 api routes
app.use("/v1", routes);

// Send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

// Convert error to ApiError, if needed
app.use(errorConverter);

// Handle error
app.use(errorHandler);
console.log("ffffff")


module.exports = app;
