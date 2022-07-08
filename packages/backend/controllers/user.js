const User = require("../models/user.model");
const catchAsync = require("../utils/catchAsync");
const ApiSuccess = require("../utils/ApiSuccess");
const ApiError = require("../utils/ApiError");
exports.find = catchAsync(async (req, res, next) => {
  // If a query string ?publicAddress=... is given, then filter results

  const whereClause =
    req.query && req.query.publicAddress
      ? {
          where: {
            publicAddress: req.query.publicAddress,
          },
        }
      : undefined;
  const users = await User.findAll(whereClause);
  const data = { users };
  return ApiSuccess(res, data);
});
exports.get = catchAsync(async (req, res, next) => {
  // AccessToken payload is in req.user.payload, especially its `id` field
  // UserId is the param in /users/:userId
  // We only allow user accessing herself, i.e. require payload.id==userId
  console.log("req ", req.params);
  if (req.userId !== req.params.userId) {
    throw ApiError(401, "You can can only access yourself");
  }
  const user = await User.findByPk(req.params.userId);

  return ApiSuccess(res, { user });
});
exports.createUser = catchAsync(async (req, res, next) => {
  const user = await User.create(req.body);
  return ApiSuccess(res, { user });
});
exports.patch = (req, res, next) => {
  // Only allow to fetch current user
  if (req.userId !== req.params.userId) {
    const error = new Error("You can can only access yourself");
    error.statusCode = 401;
    throw error;
  }
  return User.findByPk(req.params.userId)
    .then((user) => {
      if (!user) {
        return user;
      }
      Object.assign(user, req.body);
      return user.save();
    })
    .then((user) => {
      if (user) {
        return res.json(user);
      } else {
        const error = new Error(
          `User with publicAddress ${req.params.userId} is not found in database`
        );
        error.statusCode = 401;
        throw error;
      }
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
