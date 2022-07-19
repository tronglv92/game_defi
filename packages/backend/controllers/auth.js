const { recoverPersonalSignature } = require("eth-sig-util");
const { bufferToHex } = require("ethereumjs-util");

const jwt = require("jsonwebtoken");

const { config } = require("../config");
const User = require("../models/user.model");
const ApiError = require("../utils/ApiError");
const ApiSuccess = require("../utils/ApiSuccess");
const catchAsync = require("../utils/catchAsync");
/** POST /api/auth */
exports.create = catchAsync(async (req, res, next) => {
  const { signature, publicAddress } = req.body;

  if (!signature || !publicAddress) {
    throw new ApiError(400, "Request should have signature and publicAddress");
  }
  ////////////////////////////////////////////////////
  // Step 1: Get the user with the given publicAddress
  ////////////////////////////////////////////////////
  const user = await User.findOne({ where: { publicAddress } });
  if (!user) {
    throw new ApiError(
      400,
      `User with publicAddress ${publicAddress} is not found in database`
    );
  }
  ////////////////////////////////////////////////////
  // Step 2: Verify digital signature
  ////////////////////////////////////////////////////
  const msg = `I am signing my one-time nonce: ${user.nonce}`;
  // We now are in possession of msg, publicAddress and signature. We
  // will use a helper from eth-sig-util to extract the address from the signature
  const msgBufferHex = bufferToHex(Buffer.from(msg, "utf8"));
  const address = recoverPersonalSignature({
    data: msgBufferHex,
    sig: signature,
  });
  // The signature verification is successful if the address found with
  // sigUtil.recoverPersonalSignature matches the initial publicAddress
  if (address.toLowerCase() != publicAddress.toLowerCase()) {
    throw new ApiError(401, `Signature verification failed`);
  }
  user.nonce = Math.floor(Math.random() * 10000);
  await user.save();

  const token = jwt.sign(
    {
      payload: {
        id: user.id,
        publicAddress,
      },
    },
    config.secret,
    {
      algorithm: config.algorithms[0],
    }
  );
  if (!token) {
    throw new ApiError(400, `Token is null`);
  }
  return ApiSuccess(res, {
    token: token,
    user: user,
  });
});
