/** @format */

const { format } = require("date-fns");
const { config } = require("../config");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");

const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

const multerS3 = require("multer-s3");
const multer = require("multer");
var path = require("path");
const ApiSuccess = require("../utils/ApiSuccess");

const s3 = new AWS.S3({
  accessKeyId: config.AWS_ACCESS_KEY,
  secretAccessKey: config.AWS_SECRET_KEY,
  region: config.REGION,
  Bucket: config.BUCKET,
});

/**
 * Single Upload
 */
const imgSingleUpload = multer({
  storage: multerS3({
    s3: s3,
    bucket: config.BUCKET,
    // acl: "public-read",
    key: function (req, file, cb) {
      const filePath = `items/${uuidv4()}.png`;
      let key = path.join(`${config.BUCKET_BASE_FOLDER}`, filePath);
      cb(null, key);
    },
  }),
  limits: { fileSize: 2000000 }, // In bytes: 2000000 bytes = 2 MB
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single("file");

/**
 * Check File Type
 * @param file
 * @param cb
 * @return {*}
 */
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  // const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
  // Check mime
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
}

/**
 * @route POST /api/profile/business-img-upload
 * @desc Upload post image
 * @access public
 */

// Upload to S3 =>   /api/v1/upload
exports.uploadS3 = catchAsync(async (req, res, next) => {
  imgSingleUpload(req, res, (error) => {
    if (error) {
      // res.json({ error: error });

      res.status(400).json({ success: false, error: error });
    } else {
      // If File not found
      if (req.file === undefined) {
        console.log("Error: No File Selected!");
        res.status(400).json({
          success: false,
          message: "Error: No File Selected",
        });
      } else {
        // If Success
        const imageName = req.file.key;
        const imageLocation = req.file.location;
        // Save the file name into database into profile model
        const data = { image: imageName, location: imageLocation };
        return ApiSuccess(res, data);
      }
    }
  });
});

/**
 * BUSINESS GALLERY IMAGES
 * MULTIPLE FILE UPLOADS
 */
// Multiple File Uploads ( max 4 )
const uploadMultipleImages = multer({
  storage: multerS3({
    s3: s3,
    bucket: config.BUCKET,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    // contentEncoding: "gzip",
    // contentType: "image/png",
    // acl: "public-read",
    key: function (req, file, cb) {
      const timeNow = format(new Date(), "ddMMyyyyHHmm");
      const fileType = file.mimetype.split("/")[1] || "png";
      const filePath = `${timeNow}_${uuidv4()}.${fileType}`;
      let key = path.join(`${config.BUCKET_BASE_FOLDER}`, filePath);
      cb(
        null,
        key
        // path.basename(file.originalname, path.extname(file.originalname)) +
        //   "-" +
        //   Date.now() +
        //   path.extname(file.originalname)
      );
    },
  }),
  limits: { fileSize: 2000000 }, // In bytes: 2000000 bytes = 2 MB
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).array("files", 3);

// Upload to S3 =>   /api/v1/multiple-file-upload
exports.uploadMultipleFileToS3 = catchAsync(async (req, res) => {
  uploadMultipleImages(req, res, (error) => {
    console.log("files", req.files);
    if (error) {
      res.status(400).json({ success: false, error: error });
    } else {
      // If File not found
      if (req.files === undefined || req.files.length === 0) {
        console.log("Error: No File Selected!");
        res.status(400).json({
          success: false,
          message: "Error: No File Selected",
        });
      } else {
        // If Success
        let fileArray = req.files,
          fileLocation;
        const galleryImgLocationArray = [];
        for (let i = 0; i < fileArray.length; i++) {
          fileLocation = fileArray[i].location;
          console.log("filenm", fileLocation);
          // galleryImgLocationArray.push(fileLocation)
          galleryImgLocationArray.push({
            originalName: fileArray[i].originalname,
            key: fileArray[i].key,
            url: `https://created-by-api.s3.ap-southeast-1.amazonaws.com/${fileArray[i].key}`,
          });
        }
        // Save the file name into database

        const data = {
          images: galleryImgLocationArray,
        };
        return ApiSuccess(res, data);
      }
    }
  });
});

exports.listDataUploadS3 = catchAsync(async (req, res, next) => {
  var params = {
    Bucket: config.BUCKET,
    Prefix: config.BUCKET_BASE_FOLDER,
  };

  s3.listObjects(params, function (err, data) {
    if (err) throw err;
    res.status(200).json({
      success: true,
      data: data,
    });
  });
});

exports.deleteImageUploadToS3 = catchAsync(async (req, res, next) => {
  var params = {
    Bucket: config.BUCKET,
    Key: req.body.key,
  };

  await s3
    .getObject(params, function (err, data) {
      if (err) {
        console.log(err.message, err.statusCode);
        return {
          message: err.message,
          error: err.statusCode,
        };
      }
    })
    .promise();

  s3.deleteObject(params, function (err, object) {
    if (err) {
      return next(new ApiError(err.message, err.statusCode));
    }
    const data = {
      message: "File has been deleted successfully",
    };
    return ApiSuccess(res, data);
  });
});

// https://s3.amazonaws.com/data-service.pharmacity.io/pmc-vms-be-services/staging/801097/t5Gr94l7CIYpWwhQEs9YS.png?AWSAccessKeyId=AKIA5MZIFYPAULGEZ3IG&Content-Type=image%2Fjpeg&Expires=1634309768&Signature=eLu3OSGbXywV%2B9v%2BV5CMzALeVJM%3D

// https://data-service.pharmacity.io/pmc-vms-be-services/staging/801097/Y3sV_qwOIPMq4HQknSGmb.png
