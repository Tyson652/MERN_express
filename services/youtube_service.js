const youtube = require("./../config/youtube");
const fs = require("fs");

const ChallengeModel = require("./../database/models/challenge_model");

function upload(req, res, next) {
    console.log("inside upload yt service");
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

async function destroy(req, res, next) {
    console.log("inside destroy yt service");
    console.log(req.params);
    const { id } = req.params;
  
    const challenge = await ChallengeModel.findById(id);
    console.log(challenge);
    const yt_id = challenge.yt_id;
    console.log(yt_id);
    youtube.videos.delete({
        id: yt_id
    })
    .then(response => {
        next();
    })
    .catch(err => next(err));
}

module.exports = {
    upload,
    destroy
}