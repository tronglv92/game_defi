const controller = require("../controllers/auth");
const express = require("express");
const authRouter = express.Router();

/** POST /api/auth */
authRouter.post("/", controller.create);
module.exports = authRouter;
