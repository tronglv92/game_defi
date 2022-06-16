const { recoverPersonalSignature } = require("eth-sig-util");
const { bufferToHex } = require("ethereumjs-util");

const jwt = require("jsonwebtoken");

const { config } = require("../config");
const User = require("../models/user.model");
exports.create = (req, res, next) => {
  const { signature, publicAddress } = req.body;

  if (!signature || !publicAddress)
    return res
      .status(400)
      .send({ error: "Request should have signature and publicAddress" });
  return (
    User.findOne({ where: { publicAddress } })
      ////////////////////////////////////////////////////
      // Step 1: Get the user with the given publicAddress
      ////////////////////////////////////////////////////
      .then((user) => {
        if (!user) {
          res.status(401).send({
            error: `User with publicAddress ${publicAddress} is not found in database`,
          });
          return null;
        }
        return user;
      })
      ////////////////////////////////////////////////////
      // Step 2: Verify digital signature
      ////////////////////////////////////////////////////
      .then((user) => {
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
        if (address.toLowerCase() === publicAddress.toLowerCase()) {
          return user;
        } else {
          res.status(401).send({
            error: "Signature verification failed",
          });
          return null;
        }
      })
      .then((user) => {
        user.nonce = Math.floor(Math.random() * 10000);
        return user.save();
      })
      .then((user) => {
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
          return res.status(400).send({ error: "Token is null" });
        }
        return res.status(200).send({ token });
      })
  );
};
