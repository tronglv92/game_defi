const NFT = require("../models/nft");
const NftItem = require("../models/nft_item");
const { validationResult } = require("express-validator/check");

const BoxState = require("../models/box_state");
const catchAsync = require("../utils/catchAsync");
const ApiSuccess = require("../utils/ApiSuccess");
const ApiError = require("../utils/ApiError");
exports.getBox = catchAsync(async (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = req.query.limit || 2;

  const items = await NftItem.findAndCountAll({
    // where: {...},
    // order: [...],
    include: [
      {
        model: BoxState,
        // where: {
        //   speed: 1.04,
        // },
      },
      {
        model: NFT,
      },
    ],
    limit: parseInt(perPage),
    offset: parseInt((currentPage - 1) * perPage),
    // distinct: true,
  });
  const data = { items: items };
  return ApiSuccess(res, data);
});
exports.createBox = catchAsync(async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new ApiError(422, errors.array()[0].msg);
  }

  const img = req.body.img;
  const name = req.body.name;
  const price = req.body.price;

  const boxState = req.body.boxState;

  const item = await NftItem.create(
    {
      img: img,
      name: name,
      box: true,
      boxStates: boxState,
      nft: {
        price: price,
        minted: false,
      },
    },
    {
      include: [BoxState, NFT],
    }
  );
  const data = { item: item };
  return ApiSuccess(res, data);
});
