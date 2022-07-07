const jwt = require("jsonwebtoken");
const { config } = require("../config");
module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    const error = new Error("Not authenticated.");
    error.statusCode = 401;
    throw error;
  }
  const token = authHeader.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, config.secret);
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }
  if (!decodedToken || !decodedToken.payload) {
    const error = new Error("Not authenticated.");
    error.statusCode = 401;
    throw error;
  }
  console.log("decodedToken ", decodedToken);
  req.userId = decodedToken.payload.id.toString();
  next();
};
