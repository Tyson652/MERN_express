const youtube = require("./../config/youtube");
const fs = require("fs");

const ChallengeModel = require("./../database/models/challenge_model");

function upload(req, res, next) {
    youtube.videos.insert({
        resource: {
            snippet: {
                title: req.body.title,
                description: `${req.body.description} \n wwww.test.com`
            }
        },
        part: "snippet",

        media: {
            body: fs.createReadStream(req.file.path),
        }
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

async function destroy(req, res, next) {
    const { id } = req.params;
  
    const challenge = await ChallengeModel.findById(id);
    const yt_id = challenge.yt_id;

    youtube.video.delete({
        id: yt_id
    })
    .then(response => {
        next();
    })
    .catch(err => next(err));
}

module.exports = {
    upload,
    list,
    destroy
}