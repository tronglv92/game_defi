const express = require("express");
const isAuth = require("../middleware/is-auth");
const { body } = require("express-validator/check");
const router = express.Router();
const uploadController = require("../controllers/upload");
// POST /upload/upload
router.post(
  "/upload",
  // isAuth,

  uploadController.uploadS3
);
router.post(
  "/multiple-file-upload", // isAuth,

  uploadController.uploadMultipleFileToS3
);
router.get(
  "/list-imge-upload", // isAuth,

  uploadController.listDataUploadS3
);
router.post(
  "/delete-image", // isAuth,

  uploadController.deleteImageUploadToS3
);
module.exports = router;
