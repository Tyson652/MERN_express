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
        console.log("video was uploaded to YT succesfully");
        req.file.yt_id = response.data.id;
        next();
    })
    .catch(err => {
        console.log("video failed upload to YT");
        next(err);
    })
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
        console.log("video was delete from YT succesfully");
        next();
    })
    .catch(err => {
        console.log("video failed to delte from YT");
        next(err);
    })
}

module.exports = {
    upload,
    destroy
}