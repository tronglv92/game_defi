const express = require("express");
const { expressjwt: jwt } = require("express-jwt");
const { config } = require("../config");
const controller = require("../controllers/user");

userRouter = express.Router();

/** GET /api/users */
userRouter.route("/").get(controller.find);

/** GET /api/users/:userId */
/** Authenticated route */
userRouter.route("/:userId").get(jwt(config), controller.get);

/** POST /api/users */
userRouter.route("/").post(controller.create);

/** PATCH /api/users/:userId */
/** Authenticated route */
userRouter.route("/:userId").patch(jwt(config), controller.patch);

module.exports = userRouter;
