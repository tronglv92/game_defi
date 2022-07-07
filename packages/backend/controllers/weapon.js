const NFT = require("../models/nft");
const NftItem = require("../models/nft_item");
const { validationResult } = require("express-validator/check");
const ItemStat = require("../models/item_stat");
const ItemAbilities = require("../models/item_abilities");
exports.getWeapon = async (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = req.query.limit || 2;
  console.log("currentPage ", currentPage);
  console.log("perPage ", perPage);
  try {
    const items = await NftItem.findAndCountAll({
      // where: {...},
      // order: [...],
      include: [
        {
          model: ItemStat,
          // where: {
          //   speed: 1.04,
          // },
        },
        {
          model: ItemAbilities,
        },
        {
          model: NFT,
        },
      ],
      limit: parseInt(perPage),
      offset: parseInt((currentPage - 1) * perPage),
      distinct: true,
    });
    res.status(200).json({
      message: "get weapon successfully.",
      items: items,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
exports.createWeapon = async (req, res, next) => {
  const errors = validationResult(req);
  errors.formatWith;
  if (!errors.isEmpty()) {
    const error = new Error(errors.array()[0].msg);
    error.statusCode = 422;
    next(error);
  }

  const img = req.body.img;
  const name = req.body.name;
  const type = req.body.type;
  const level = req.body.level;
  const star = req.body.star;
  const stat = req.body.stat;

  const abilities = req.body.abilities;

  const price = req.body.price;

  try {
    const item = await NftItem.create(
      {
        img: img,
        name: name,
        type: type,
        level: level,
        star: star,
        itemStat: stat,
        itemAbilities: abilities,
        nft: {
          price: price,
          minted: false,
        },
      },
      {
        include: [ItemStat, ItemAbilities, NFT],
      }
    );

    res.status(201).json({
      message: "Create weapon successfully!",
      item: item,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
