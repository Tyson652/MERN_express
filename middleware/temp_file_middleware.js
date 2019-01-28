const fs = require("fs");

module.exports = function clean (req, res, next) {
    fs.unlink(req.file.path)
    next();
}
