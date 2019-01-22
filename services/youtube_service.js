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
        req.file.yt_id = response.data.id;
        next();
    })
    .catch(err => next(err));
}

function list(req, res, next) {
    youtube.videos.list({ part: "contentDetails", chart: "mostPopular"})
    .then(response => console.log(response.data.items))
    .catch(err => next(err));
}

function destroy() {

}

function edit() {

}

module.exports = {
    upload,
    list,
    destroy,
    edit
}