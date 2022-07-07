const User = require("../models/user.model");

exports.find = (req, res, next) => {
  // If a query string ?publicAddress=... is given, then filter results

  const whereClause =
    req.query && req.query.publicAddress
      ? {
          where: {
            publicAddress: req.query.publicAddress,
          },
        }
      : undefined;
  return User.findAll(whereClause)
    .then((users) => res.json(users))
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
exports.get = (req, res, next) => {
  // AccessToken payload is in req.user.payload, especially its `id` field
  // UserId is the param in /users/:userId
  // We only allow user accessing herself, i.e. require payload.id==userId
  console.log("req ", req.params);
  if (req.userId !== req.params.userId) {
    const error = new Error("You can can only access yourself");
    error.statusCode = 401;
    throw error;
  }
  return User.findByPk(req.params.userId)
    .then((user) => res.json(user))
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
exports.createUser = (req, res, next) => {
  return User.create(req.body)
    .then((user) => res.json(user))
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
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
