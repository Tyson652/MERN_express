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

function avatarUpload(req, res, next) {
  const singleUpload = upload.single("image");
  singleUpload(req, res, err => {
    if (err) {
      return res.status(422).send({
        errors: [{ title: "Image Upload Error", detail: err.message }]
      });
    }
    req.imageUrl = req.file.location;
    next();
  });
}

module.exports = { avatarUpload };
