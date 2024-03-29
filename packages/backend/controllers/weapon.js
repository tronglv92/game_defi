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
const sequelize = require("../helper/db");
const getDelta = require("../utils/delta");
const { Op } = require("sequelize");
const _ = require("lodash");
const ethers = require("ethers");
const ethUtil = require("ethereumjs-util");
const { DECIMAL, STATE_NFT } = require("../contracts/constant");
exports.getWeapons = catchAsync(async (req, res, next) => {
  console.log(" req.query ", req.query);
  const currentPage = req.query.page || 1;
  const perPage = req.query.limit || 10;
  const types = req.query.types;
  const stars = req.query.stars;
  const priceFrom = req.query.priceFrom;
  const priceTo = req.query.priceTo;
  let options = {
    where: {},

    // order: [...],
    include: [
      {
        model: ItemStat,
      },
      {
        model: ItemAbilities,
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
  };

  options.where.box = false;
  if (types && types.length > 0) options.where.type = { [Op.in]: types };
  if (stars && stars.length > 0) {
    options.where.star = { [Op.in]: stars };
  }
  if (priceFrom && priceTo && (priceFrom > 0 || priceTo > 0)) {
    options.include[2].where.price = { [Op.between]: [priceFrom, priceTo] };
  } else if (priceFrom && (!priceTo || priceTo == 0)) {
    options.include[2].where.price = { [Op.gte]: priceFrom };
  } else if (priceTo && (!priceFrom || priceFrom == 0)) {
    options.include[2].where.price = { [Op.lte]: priceTo };
  }

  console.log("options ", options);
  const items = await NftItem.findAndCountAll(options);
  const data = { items: items };
  return ApiSuccess(res, data);
});
exports.getMyWeapons = catchAsync(async (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = req.query.limit || 10;
  const publicAddress = req.publicAddress;

  const errors = validationResult(req);
  errors.formatWith;
  if (!errors.isEmpty()) {
    throw new ApiError(httpStatus.BAD_REQUEST, errors.array()[0].msg);
  }

  const items = await NftItem.findAndCountAll({
    where: { box: false },
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
  const data = { items: items ? items : [] };
  return ApiSuccess(res, data);
});
exports.getWeapon = catchAsync(async (req, res, next) => {
  const errors = validationResult(req);
  errors.formatWith;
  if (!errors.isEmpty()) {
    throw new ApiError(httpStatus.BAD_REQUEST, errors.array()[0].msg);
  }
  const { id } = req.params;

  const item = await NftItem.findOne({
    where: { box: false, id: parseInt(id) },
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
  });
  const data = { item: item };
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

exports.editWeapon = catchAsync(async (req, res, next) => {
  const errors = validationResult(req);
  errors.formatWith;
  if (!errors.isEmpty()) {
    throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, errors.array()[0].msg);
  }
  const { id } = req.params;
  const itemBody = pick(req.body, ["img", "name", "type", "level", "star"]);
  const stat = req.body.stat;
  const abilities = req.body.abilities;

  const price = req.body.price;

  let item = await NftItem.findOne({
    where: { id: parseInt(id), box: false },
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
    ],
  });

  if (!item) {
    throw new ApiError(400, "Weapon not exists");
  }
  // Get deltas
  const statDelta = getDelta(
    item.itemStat ? [item.itemStat] : [],
    stat ? [stat] : []
  );
  const abilitiesDelta = getDelta(item.itemAbilities, abilities);
  console.log("statDelta ", statDelta);
  console.log("abilitiesDelta ", abilitiesDelta);
  // Start transaction
  await sequelize
    .transaction(async (transaction) => {
      // Update addresses
      await Promise.all([
        statDelta.added.map(async (stat) => {
          console.log("statDelta added");
          await item.createItemStat(stat, { transaction });
        }),
        statDelta.changed.map(async (stat) => {
          console.log("statDelta changed stat", stat);
          await item.itemStat.update(stat, { transaction });
        }),
        statDelta.deleted.map(async (address) => {
          console.log("statDelta deleted");
          await item.itemStat.destroy({ transaction });
        }),
      ]);
      // Update phones
      await Promise.all([
        abilitiesDelta.added.map(async (ability) => {
          console.log("abilitiesDelta added");
          await item.createItemAbility(ability, { transaction });
        }),
        abilitiesDelta.changed.map(async (abilityData) => {
          const ability = item.itemAbilities.find(
            (_ability) => _ability.id === abilityData.id
          );
          await ability.update(abilityData, { transaction });
        }),
        abilitiesDelta.deleted.map(async (ability) => {
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
            model: ItemStat,
          },
          {
            model: ItemAbilities,
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
      console.log("edit Weapon err ", err);
      throw new ApiError(400, err);
    });
});
exports.getSignatureMint = catchAsync(async (req, res, next) => {
  const errors = validationResult(req);
  errors.formatWith;
  if (!errors.isEmpty()) {
    throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, errors.array()[0].msg);
  }
  const { id, nftAddress, paymentErc20, price, buyer } = req.query;

  const item = await NftItem.findByPk(id, {
    include: [],
  });
  if (item) {
    //hash the data

    const priceBigNumber = ethers.utils.parseUnits(price, DECIMAL);

    const saltNonce = item.nonce;
    const hash = ethers.utils.solidityKeccak256(
      ["address", "uint256", "address", "uint256", "address", "uint256"],
      [nftAddress, id, paymentErc20, priceBigNumber, buyer, saltNonce]
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

    item.nonce = Math.floor(Math.random() * 10000);
    item.save();
    const data = { signature, saltNonce };
    return ApiSuccess(res, data);
  } else {
    throw new ApiError(400, "Can not find Weapon");
  }
});
exports.updateWhenMinted = catchAsync(async (req, res, next) => {
  const errors = validationResult(req);
  errors.formatWith;
  if (!errors.isEmpty()) {
    throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, errors.array()[0].msg);
  }
  const { id } = req.params;
  const { hashNFT, minted, state, buyer } = req.body;
  const item = await NFT.findOne({
    where: { nftItemId: parseInt(id) },
    // order: [...],
    include: [],
  });
  item.state = state;
  item.hashNFT = hashNFT;
  item.minted = minted;
  item.addressOwner = buyer.toLowerCase();
  await item.save();
  const data = { item: item };
  return ApiSuccess(res, data);
});
