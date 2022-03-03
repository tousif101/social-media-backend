const mongoose = require('mongoose');


/*
Upload a picture:
Store it in a CDN (Node uploading to AWS CDN)
Return CDN Location.
Date Upload
Comments:
    [{
        "User":  toasterboylol
        "Comment": String
        }]
Likes
Who uploaded.
 */

const PictureSchema = new mongoose.Schema({
    cdnUrl: {
        type: String,
        required: true
    },
    userUploaded:{
        type: String,
        required: true
    },
    dateUploaded: {
        type: Date,
        default: Date.now
    },
    comments:[
        {
            userWhoCommented: { type:String},
            message: { type:String}
        }
    ]
});

module.exports = Picture = mongoose.model('picture', PictureSchema);