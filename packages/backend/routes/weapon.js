const express = require("express");
const isAuth = require("../middleware/is-auth");
const { body } = require("express-validator/check");
const weaponRouter = express.Router();
const weaponController = require("../controllers/weapon");
// POST /weapon/createWeapon
weaponRouter.post(
  "/createWeapon",
  // isAuth,
  [
    body("img", "Please enter url imge").trim().isURL(),
    body("name", "Please enter name").trim().not().isEmpty(),
    body("price", "Price must be a number").trim().isNumeric(),
    body("type", "Type must be a number").trim().isNumeric(),
    body("level", "Level must be a number").trim().isNumeric(),
    body("star", "Star must be a number").trim().isNumeric(),
    body("stat.damage", "Damage must be a number").trim().isDecimal(),
    body("stat.speed", "Speed must be a number").trim().isNumeric(),
    body("stat.hp", "HP must be a number").trim().isNumeric(),
    body("stat.critical", "Critical must be a number").trim().isNumeric(),
    body("abilities", "Abilities must be array").isArray(),
    body("abilities.*.img", "Image abilities is empty")
      .exists()
      .not()
      .isEmpty(),
    body("abilities.*.name", "Name abilities is empty")
      .exists()
      .not()
      .isEmpty(),
    body("abilities.*.level", "Level abilities is empty").exists().isNumeric(),
  ],
  weaponController.createWeapon
);
weaponRouter.get("/getWeapon", weaponController.getWeapon);
module.exports = weaponRouter;
