const multer = require("multer");
const multerS3 = require("multer-s3");
const aws = require("aws-sdk");

// configure the keys for accessing AWS
aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.S3_REGION
});

// create S3 instance
const s3 = new aws.S3();

// configure multer middleware
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET,
    acl: "public-read",
    metadata: function(req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function(req, file, cb) {
      cb(null, Date.now().toString());
    }
  })
});

// uploads image file to S3 bucket, file from form with key 'image'
// @returns req.file: object
function avatarUpload(req, res, next) {
  const singleUpload = upload.single("image");
  singleUpload(req, res, error => {
    if (error) {
      return next(new HTTPError(422, `Image Upload Error: ${error.message}`));
    }
    if (!req.file) {
      return next(new HTTPError(422, "No image file was selected"));
    }
    req.imageUrl = req.file.location;
    next();
  });
}

module.exports = { avatarUpload };
