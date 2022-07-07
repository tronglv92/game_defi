const express = require("express");
const isAuth = require("../middleware/is-auth");
const { body } = require("express-validator/check");
const router = express.Router();
const boxController = require("../controllers/box");
// POST /box/createBox
router.post(
  "/createBox",
  // isAuth,
  [
    body("img", "Please enter url imge").trim().not().isEmpty(),
    body("name", "Please enter name").trim().not().isEmpty(),
    body("price", "Price must be a number").trim().isNumeric(),

    body("boxState", "Box stat must be array").isArray(),
    body("boxState.*.level", "Level Box Stat must be a number")
      .exists()
      .isNumeric(),
    body("boxState.*.percent", "Percent Box Stat must be a decimal")
      .exists()
      .isDecimal(),
  ],
  boxController.createBox
);
router.get("/getBox", boxController.getBox);
module.exports = router;
