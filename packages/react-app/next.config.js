require("dotenv").config();
const withTM = require("next-transpile-modules")(["eth-hooks"]); // pass the modules you would like to see transpiled

module.exports = withTM({
  reactStrictMode: true,
  images: {
    domains: ["created-by-api.s3.ap-southeast-1.amazonaws.com"],
  },
  env: {
    REACT_APP_BACKEND_URL: process.env.REACT_APP_BACKEND_URL,
  },
});
