const express = require("express");

const isAuth = require("../middleware/is-auth");
const { config } = require("../config");
const controller = require("../controllers/user");

const userRouter = express.Router();

/** GET /api/users */

userRouter.get("/", controller.find);
/** GET /api/users/:userId */
/** Authenticated route */
userRouter.get("/:userId", isAuth, controller.get);

/** POST /users */

userRouter.post("/", controller.createUser);

/** PATCH /api/users/:userId */
/** Authenticated route */
// userRouter.patch("/:userId", isAuth, controller.patch);

module.exports = userRouter;
