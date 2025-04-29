const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");

const adminAuth = () => async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        "Forbidden - Admin access required"
      );
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = adminAuth;
