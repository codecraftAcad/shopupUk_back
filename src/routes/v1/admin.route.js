const express = require("express");
const auth = require("../../middlewares/auth");
const adminAuth = require("../../middlewares/adminAuth");
const validate = require("../../middlewares/validate");
const adminValidation = require("../../validations/admin.validation");
const adminController = require("../../controllers/admin.controller");

const router = express.Router();

// Public admin routes (login)
router.post(
  "/auth/login",
  validate(adminValidation.login),
  adminController.login
);

// Protected admin routes - require both authentication and admin role
router.use(auth(), adminAuth());

router.get("/dashboard/stats", adminController.getDashboardStats);

// Products management
router
  .route("/products")
  .get(validate(adminValidation.getProducts), adminController.getProducts)
  .post(validate(adminValidation.createProduct), adminController.createProduct);

router
  .route("/products/:productId")
  .get(validate(adminValidation.getProduct), adminController.getProduct)
  .put(validate(adminValidation.updateProduct), adminController.updateProduct)
  .delete(
    validate(adminValidation.deleteProduct),
    adminController.deleteProduct
  );

// Orders management
router
  .route("/orders")
  .get(validate(adminValidation.getOrders), adminController.getOrders);

router
  .route("/orders/:orderId")
  .get(validate(adminValidation.getOrder), adminController.getOrder)
  .put(validate(adminValidation.updateOrder), adminController.updateOrder);

// Users management
router
  .route("/users")
  .get(validate(adminValidation.getUsers), adminController.getUsers)
  .post(validate(adminValidation.createUser), adminController.createUser);

router
  .route("/users/:userId")
  .get(validate(adminValidation.getUser), adminController.getUser)
  .put(validate(adminValidation.updateUser), adminController.updateUser)
  .delete(validate(adminValidation.deleteUser), adminController.deleteUser);

// Categories management
router
  .route("/categories")
  .get(validate(adminValidation.getCategories), adminController.getCategories)
  .post(
    validate(adminValidation.createCategory),
    adminController.createCategory
  );

router
  .route("/categories/:categoryId")
  .put(validate(adminValidation.updateCategory), adminController.updateCategory)
  .delete(
    validate(adminValidation.deleteCategory),
    adminController.deleteCategory
  );

module.exports = router;
