const express = require("express");
const authRoute = require("./auth.route");
const userRoute = require("./user.route");
const productRoute = require("./product.route");
const orderRoute = require("./order.route");
const paymentRoute = require("./payment.route");
const docsRoute = require("./docs.route");
const AdminRoute = require("./admin.route")
const config = require("../../config/config");

const router = express.Router();

const defaultRoutes = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/users",
    route: userRoute,
  },
  {
    path: "/products",
    route: productRoute,
  },
  {
    path: "/orders",
    route: orderRoute,
  },
  {
    path: "/payments",
    route: paymentRoute,
  },
  {
    path: "/admin",
    route: AdminRoute,
  },
];

const devRoutes = [
  {
    path: "/docs",
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* Only add dev routes in development environment */
if (config.env === "development") {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
