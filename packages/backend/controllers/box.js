const NFT = require("../models/nft");
const NftItem = require("../models/nft_item");
const { validationResult } = require("express-validator/check");

const BoxState = require("../models/box_state");
exports.getBox = async (req, res, next) => {
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
    res.status(200).json({
      message: "Get box successfully.",
      items: items,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
exports.createBox = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error(errors.array()[0].msg);
    error.statusCode = 422;
    next(error);
  }

  const img = req.body.img;
  const name = req.body.name;
  const price = req.body.price;

  const boxState = req.body.boxState;
  console.log("boxState ", boxState);
  try {
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

    res.status(201).json({
      message: "Create box successfully!",
      item: item,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
