const express = require("express");
const isAuth = require("../middleware/is-auth");
const { body, param, query } = require("express-validator/check");
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
    body("abilities.*.description", "Description abilities is empty")
      .exists()
      .not()
      .isEmpty(),
    body("abilities.*.level", "Level abilities is empty").exists().isNumeric(),
  ],
  weaponController.createWeapon
);
weaponRouter.get(
  "/getWeapons",
  [
    query("page", "Page must be a number").trim().exists().isNumeric(),
    query("limit", "Limit must be a number").trim().exists().isNumeric(),
    query("types", "Types must be array").isArray(),
    query("stars", "Stars must be a array").isArray(),
    query("priceFrom", "priceFrom must be a number")
      .trim()
      .exists()
      .isNumeric(),
    query("priceTo", "priceTo must be a number").trim().exists().isNumeric(),
  ],
  weaponController.getWeapons
);
weaponRouter.get("/myWeapons", isAuth, weaponController.getMyWeapons);
weaponRouter.get(
  "/getWeapon/:id",
  [param("id", "Id is empty").trim().not().isEmpty()],
  weaponController.getWeapon
);
weaponRouter.post(
  "/editWeapon/:id",
  [
    param("id", "Id is empty").trim().not().isEmpty(),
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
  weaponController.editWeapon
);
weaponRouter.get(
  "/getSignatureMint",
  [query("id", "Id must be a number ").trim().isNumeric()],
  weaponController.getSignatureMint
);
weaponRouter.post(
  "/updateWhenMinted/:id",
  isAuth,
  [
    param("id", "Id is empty").trim().not().isEmpty(),
    body("state", "State is must number").trim().isNumeric(),
    body("hashNFT", "HashNFT is must not empty").trim().not().isEmpty(),
    body("buyer", "Buyer is must not empty").trim().not().isEmpty(),
    body("minted", "Minted is must boolean").trim().isBoolean(),
  ],
  weaponController.updateWhenMinted
);
module.exports = weaponRouter;
