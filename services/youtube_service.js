const youtube = require("./../config/youtube");
const fs = require("fs");

function upload(req, res, next) {
    youtube.videos.insert({
        snippet: {
            title: "testing API upload",
            description: "test desc"
        },
        media: {
            body: fs.createReadStream(req.file.path),
        },
        part: "snippet"
    })
    .then(response => {
        req.file.youtubeid = response.data.id;
        next();
    })
    .catch(err => next(err));
}

module.exports = {
    upload
}