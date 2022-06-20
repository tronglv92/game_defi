require("dotenv").config();
const withTM = require("next-transpile-modules")(["eth-hooks"]); // pass the modules you would like to see transpiled

module.exports = withTM({
  reactStrictMode: true,
  env: {
    REACT_APP_BACKEND_URL: process.env.REACT_APP_BACKEND_URL,
  },
});
