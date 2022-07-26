const NFT = require("../models/nft");
const NftItem = require("../models/nft_item");
const { validationResult } = require("express-validator/check");
const ethUtil = require("ethereumjs-util");
const catchAsync = require("../utils/catchAsync");
const ApiSuccess = require("../utils/ApiSuccess");
const ApiError = require("../utils/ApiError");
const ItemInBox = require("../models/item_in_box");
const httpStatus = require("http-status");
const pick = require("../utils/pick");
const getDelta = require("../utils/delta");
const sequelize = require("../helper/db");
const ethers = require("ethers");

const { DECIMAL, STATE_NFT } = require("../contracts/constant");
exports.createBox = catchAsync(async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new ApiError(422, errors.array()[0].msg);
  }

  const img = req.body.img;
  const name = req.body.name;
  const price = req.body.price;

  const itemInBoxes = req.body.itemInBoxes;
  console.log("itemInBoxes ", itemInBoxes);
  const item = await NftItem.create(
    {
      img: img,
      name: name,
      box: true,
      itemInBoxes: itemInBoxes,
      nft: {
        price: price,
        minted: false,
      },
    },
    {
      include: [ItemInBox, NFT],
    }
  );
  const data = { item: item };
  return ApiSuccess(res, data);
});
exports.getAllBox = catchAsync(async (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = req.query.limit || 2;

  const items = await NftItem.findAndCountAll({
    where: { box: true },
    // order: [...],
    include: [
      {
        model: ItemInBox,
        // where: {
        //   speed: 1.04,
        // },
      },
      {
        model: NFT,
        where: {
          state: STATE_NFT.Market,
        },
      },
    ],
    limit: parseInt(perPage),
    offset: parseInt((currentPage - 1) * perPage),
    distinct: true,
  });
  const data = { items: items };
  return ApiSuccess(res, data);
});
exports.getMyBoxes = catchAsync(async (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = req.query.limit || 10;
  const publicAddress = req.publicAddress;

  const items = await NftItem.findAndCountAll({
    where: { box: true },
    // order: [...],
    include: [
      {
        model: ItemInBox,
        // where: {
        //   speed: 1.04,
        // },
      },
      {
        model: NFT,
        where: {
          state: STATE_NFT.Game,
          addressOwner: publicAddress,
        },
      },
    ],
    limit: parseInt(perPage),
    offset: parseInt((currentPage - 1) * perPage),
    distinct: true,
  });
  const data = { items: items };
  return ApiSuccess(res, data);
});
exports.getBox = catchAsync(async (req, res, next) => {
  const errors = validationResult(req);
  errors.formatWith;
  if (!errors.isEmpty()) {
    throw new ApiError(httpStatus.BAD_REQUEST, errors.array()[0].msg);
  }
  const { id } = req.params;

  const item = await NftItem.findOne({
    where: { id: parseInt(id), box: true },
    // order: [...],
    include: [
      {
        model: ItemInBox,
        // where: {
        //   speed: 1.04,
        // },
      },

      {
        model: NFT,
      },
    ],
  });
  const data = { item: item };
  return ApiSuccess(res, data);
});
exports.editBox = catchAsync(async (req, res, next) => {
  const errors = validationResult(req);
  errors.formatWith;
  if (!errors.isEmpty()) {
    throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, errors.array()[0].msg);
  }
  const { id } = req.params;
  const itemBody = pick(req.body, ["img", "name"]);

  const itemInBoxes = req.body.itemInBoxes;

  let item = await NftItem.findOne({
    where: { id: parseInt(id), box: true },
    // order: [...],
    include: [
      {
        model: ItemInBox,
        // where: {
        //   speed: 1.04,
        // },
      },
    ],
  });

  if (!item) {
    throw ApiError(400, "Box is not exists");
  }

  // Get deltas

  const itemInBoxDelta = getDelta(item.itemInBoxes, itemInBoxes);
  console.log("itemInBoxDelta ", itemInBoxDelta);

  // Start transaction
  await sequelize
    .transaction(async (transaction) => {
      // Update phones
      await Promise.all([
        itemInBoxDelta.added.map(async (itemInBox) => {
          console.log("itemInBoxDelta added");
          await item.createItemInBox(itemInBox, { transaction });
        }),
        itemInBoxDelta.changed.map(async (itemInBox) => {
          console.log("itemInBoxDelta changed");
          const itemInBoxResult = item.itemInBoxes.find(
            (_itemInBox) => _itemInBox.id === itemInBox.id
          );
          await itemInBoxResult.update(itemInBox, { transaction });
        }),
        itemInBoxDelta.changed.map(async (itemInBox) => {
          console.log("itemInBoxDelta changed");
          await ability.destroy({ transaction });
        }),
      ]);

      // Finally update customer
      return await item.update(itemBody, { transaction });
    })
    .then((item) =>
      NftItem.findByPk(id, {
        include: [
          {
            model: ItemInBox,
          },
          {
            model: NFT,
          },
        ],
      })
    )
    .then((result) => {
      const data = { item: result };
      return ApiSuccess(res, data);
    })
    .catch((err) => {
      throw new ApiError(400, err);
    });
});
exports.getSignature = catchAsync(async (req, res, next) => {
  const errors = validationResult(req);
  errors.formatWith;
  if (!errors.isEmpty()) {
    throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, errors.array()[0].msg);
  }
  const { id, price, paymentErc20, user } = req.query;
  //hash the data

  const priceBigNumber = ethers.utils.parseUnits(price, DECIMAL);

  const hash = ethers.utils.solidityKeccak256(
    ["address", "uint256", "uint256", "address"],
    [user, id, priceBigNumber, paymentErc20]
  );
  console.log("hash ", hash);

  //prefix the hash
  const prefixedHash = ethUtil.hashPersonalMessage(ethUtil.toBuffer(hash));
  console.log(
    "process.env.localhost.PRIVATE_KEY_ACCOUNT ",
    process.env.PRIVATE_KEY_ACCOUNT
  );
  //get the ECDSA signature and its r,s,v parameters
  const privateKey = Buffer.from(process.env.PRIVATE_KEY_ACCOUNT, "hex");
  const { r, s, v } = ethUtil.ecsign(prefixedHash, privateKey);
  const signature = `0x${r.toString("hex")}${s.toString("hex")}${v.toString(
    16
  )}`;
  console.log("signature ", signature);

  // const signer = new ethers.Wallet("0x" + process.env.PRIVATE_KEY_ACCOUNT); // replace abc with your private key
  // let message = ethers.utils.solidityPack(
  //   ["uint256", "address", "uint256", "address"],
  //   [id, user, price, paymentErc20]
  // );
  // message = ethers.utils.solidityKeccak256(["bytes"], [message]);
  // const signature = await signer.signMessage(ethers.utils.arrayify(message));
  const data = { signature };
  return ApiSuccess(res, data);
});
exports.updateNFT = catchAsync(async (req, res, next) => {
  const errors = validationResult(req);
  errors.formatWith;
  if (!errors.isEmpty()) {
    throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, errors.array()[0].msg);
  }
  const { id } = req.params;
  const { hashNFT, state, buyer } = req.body;
  // const buyer = req.body.buyer;

  const item = await NFT.findOne({
    where: { nftItemId: parseInt(id) },
    // order: [...],
    include: [],
  });

  item.state = state;
  item.hashNFT = hashNFT;
  item.addressOwner = buyer.toLowerCase();
  await item.save();
  const data = { item: item };
  return ApiSuccess(res, data);
});
