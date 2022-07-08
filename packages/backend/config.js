require("dotenv").config();
/**
 * JWT config.
 */
exports.config = {
  algorithms: ["HS256"],
  secret: process.env.JWT_SECRET, // TODO Put in process.env,
  BUCKET: "created-by-api",
  REGION: "ap-southeast-1",
  AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
  AWS_SECRET_KEY: process.env.AWS_SECRET_KEY,
  BUCKET_BASE_FOLDER: "gamedefi-services/staging/",
};
