const express = require("express");
const { expressjwt: jwt } = require("express-jwt");
const { config } = require("../config");
const controller = require("../controllers/user");

const userRouter = express.Router();

/** GET /api/users */

userRouter.get("/", controller.find);
/** GET /api/users/:userId */
/** Authenticated route */
userRouter.route("/:userId").get(jwt(config), controller.get);

/** POST /users */

userRouter.post("/", controller.createUser);

/** PATCH /api/users/:userId */
/** Authenticated route */
userRouter.route("/:userId").patch(jwt(config), controller.patch);

module.exports = userRouter;
