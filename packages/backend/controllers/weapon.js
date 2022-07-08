const NFT = require("../models/nft");
const NftItem = require("../models/nft_item");
const { validationResult } = require("express-validator/check");
const ItemStat = require("../models/item_stat");
const ItemAbilities = require("../models/item_abilities");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const httpStatus = require("http-status");
const pick = require("../utils/pick");
const ApiSuccess = require("../utils/ApiSuccess");
exports.getWeapon = catchAsync(async (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = req.query.limit || 2;

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
  const data = { items: items };
  return ApiSuccess(res, data);
});
exports.createWeapon = catchAsync(async (req, res, next) => {
  const errors = validationResult(req);
  errors.formatWith;
  if (!errors.isEmpty()) {
    throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, errors.array()[0].msg);
  }

  const itemBody = pick(req.body, ["img", "name", "type", "level", "star"]);
  const stat = req.body.stat;
  const abilities = req.body.abilities;

  const price = req.body.price;

  const item = await NftItem.create(
    {
      ...itemBody,
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
  const data = { item: item };
  return ApiSuccess(res, data);
});
