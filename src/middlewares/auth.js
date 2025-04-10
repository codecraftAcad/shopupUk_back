const passport = require('passport');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { roleRights } = require('../config/roles');

const verifyCallback = (req, resolve, reject, requiredRights) => async (err, user, info) => {
  if (err || info || !user) {
    return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
  }
  req.user = user;

  if (requiredRights.length) {
    const userRights = roleRights.get(user.role);
    
    // Check if this is a self-access request (user accessing their own data)
    const isSelfAccess = 
      (req.params.userId && req.params.userId === user.id) || 
      (req.path.startsWith('/me'));
    
    // Allow self-access if user has the appropriate rights
    const hasRequiredRights = requiredRights.every(
      (requiredRight) => 
        userRights.includes(requiredRight) || 
        (isSelfAccess && 
          ((requiredRight === 'getUsers' && userRights.includes('getOwnUser')) || 
           (requiredRight === 'manageUsers' && userRights.includes('manageOwnUser'))))
    );
    
    if (!hasRequiredRights) {
      return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
    }
  }

  console.log("Auth middleware called for path:", req.path);
  console.log("Required rights:", requiredRights);
  console.log("User rights:", roleRights.get(user.role));

  resolve();
};

const auth = (...requiredRights) => async (req, res, next) => {
  return new Promise((resolve, reject) => {
    passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, requiredRights))(req, res, next);
  })
    .then(() => next())
    .catch((err) => next(err));
};

module.exports = auth; 