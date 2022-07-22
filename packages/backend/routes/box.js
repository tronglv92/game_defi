const express = require("express");
const isAuth = require("../middleware/is-auth");
const { body, param } = require("express-validator/check");
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

    body("itemInBoxes", "Box stat must be array").isArray(),
    body("itemInBoxes.*.level", "Level Item In Box must be a number")
      .exists()
      .isNumeric(),
    body("itemInBoxes.*.percent", "Percent Item In Box must be a decimal")
      .exists()
      .isDecimal(),
  ],
  boxController.createBox
);
router.post(
  "/editBox/:id",
  // isAuth,
  [
    body("img", "Please enter url imge").trim().not().isEmpty(),
    body("name", "Please enter name").trim().not().isEmpty(),
    body("price", "Price must be a number").trim().isNumeric(),

    body("itemInBoxes", "Box stat must be array").isArray(),
    body("itemInBoxes.*.level", "Level Box Stat must be a number")
      .exists()
      .isNumeric(),
    body("itemInBoxes.*.percent", "Percent Box Stat must be a decimal")
      .exists()
      .isDecimal(),
  ],
  boxController.editBox
);
router.get("/getAllBox", boxController.getAllBox);
router.get("/getMyBoxes", isAuth, boxController.getMyBoxes);
router.get(
  "/getBox/:id",
  [param("id", "Id is empty").trim().not().isEmpty()],
  boxController.getBox
);
router.post(
  "/updateNFT/:id",
  isAuth,
  [
    param("id", "Id is empty").trim().not().isEmpty(),
    body("state", "State is must number").trim().isNumeric(),
    body("hashNFT", "HashNFT is must not empty").trim().not().isEmpty(),
  ],
  boxController.updateNFT
);
router.get(
  "/getSignature",

  boxController.getSignature
);
module.exports = router;
