const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const path = require("path");
const sequelize = require("./helper/db");
const app = express();
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Middlewares
app.use(cors());

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
// Mount REST on /api
sequelize
  // .sync({ force: true })
  .sync()
  .then((result) => {
    app.listen(8000);
  });
