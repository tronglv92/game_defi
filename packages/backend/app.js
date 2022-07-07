const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const path = require("path");
const sequelize = require("./helper/db");
const error_auth = require("./middleware/is-auth");
const app = express();
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const NftModel = require("./models/nft");
const NftItemModel = require("./models/nft_item");
const ItemStatModel = require("./models/item_stat");
const ItemAbilitiesModel = require("./models/item_abilities");
const BoxStateModel = require("./models/box_state");
const multer = require("multer");
const weaponRouter = require("./routes/weapon");
const boxRouter = require("./routes/box");
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));

// Middlewares
app.use(cors());

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/weapon", weaponRouter);
app.use("/box", boxRouter);
app.use((error, req, res, next) => {
  console.log("has error ", error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

NftItemModel.hasOne(NftModel);
NftModel.belongsTo(NftItemModel);

NftItemModel.hasOne(ItemStatModel, { constraints: true, onDelete: "CASCADE" });
ItemStatModel.belongsTo(NftItemModel);

NftItemModel.hasMany(ItemAbilitiesModel, {
  constraints: true,
  onDelete: "CASCADE",
});
ItemAbilitiesModel.belongsTo(NftItemModel);

NftItemModel.hasMany(BoxStateModel, { constraints: true, onDelete: "CASCADE" });
BoxStateModel.belongsTo(NftItemModel);

// Mount REST on /api
sequelize
  // .sync({ force: true })
  .sync()
  .then((result) => {
    console.log("Listen on http://localhost:8000/");
    app.listen(8000);
  });
