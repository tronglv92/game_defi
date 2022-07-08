const cors = require("cors");
const aws = require("aws-sdk");
const express = require("express");
const { config } = require("./config");

const app = express();
app.use(cors());
app.get("/sign-s3", (req, res) => {
  const s3 = new aws.S3();
  const fileName = req.query["file-name"];
  const fileType = req.query["file-type"];
  const s3Params = {
    Bucket: config.BUCKET,
    Key: fileName,
    Expires: 60,
    ContentType: fileType,
    ACL: "public-read",
  };

  s3.getSignedUrl("putObject", s3Params, (err, data) => {
    if (err) {
      console.log(`getSignedUrl error: `, err);
      return res.end();
    }
    const returnData = {
      signedRequest: data,
      url: `https://${config.BUCKET}.s3.amazonaws.com/${fileName}`,
    };
    res.write(JSON.stringify(returnData));
    res.end();
  });
});

app.listen(3000, () => {
  console.log("come here babe...");
});
