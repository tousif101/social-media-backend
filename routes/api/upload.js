const express = require("express");
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const AWS = require('aws-sdk');

const UPLOAD_PICTURES = require('../../models/pictures');

//TODO:Get these from Env Variable
const ID = '';
const SECRET = '';

// The name of the bucket that you have created
const BUCKET_NAME = 'test-app-tacattac';
const multer = require('multer')
const User = require("../../models/User");              // multer will be used to handle the form data.


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

//TODO: Restrict JPG access
//const upload = multer({ storage: storage, fileFilter: fileFilter });

// Now creating the S3 instance which will be used in uploading photo to s3 bucket.
const s3 = new AWS.S3({
    accessKeyId:ID,              // accessKeyId that is stored in .env file
    secretAccessKey:SECRET       // secretAccessKey is also store in .env file
})


var type = upload.single('file'); // key name has to be file
// upload.single('productimage'), (req, res)
router.post('/image',jsonParser, type, (req, res) => {

    const params = {
        Bucket:BUCKET_NAME,      // bucket that we made earlier
        Key:req.file.originalname,               // Name of the image
        Body:req.file.buffer,                    // Body which will contain the image in buffer format
        ACL:"public-read-write",                 // defining the permissions to get the public link
        ContentType:"image/jpeg"                 // Necessary to define the image content-type to view the photo in the browser with the link
    };

    s3.upload(params, (err, data) => {
        if (err) {
            res.status(500).json({error:"Error -> " + err});
        } else if(data){
            const picture = {
                cdnUrl:data.Location,
                userUploaded:req.user.name
            }
            UPLOAD_PICTURES.create(picture).then(
               // res.json({message:"upload successful", url:data.Location})
                request => res.status(200).json({msd: 'image_uploaded', request:request})
            ).catch(
                err => res.status(400).json({ error: err, "request": req.body })
            );
        }
    });

});

//Finish up get Pictues
router.get('/getPictures',jsonParser, (req, res) => {
    UPLOAD_PICTURES.find({
        'userUploaded': { $in: req.user.name}
    }, function(err, docs){
        res.status(200).json(docs);
    });
});

//Get my friends list. Go through it. And then get the
/*

model.find({
    'userUploaded': { $in: req.user.friends}
}, function(err, docs){
     console.log(docs);
});
 */

/*
TODO:
- Write a comment on a picture
- Like a picture
 */

module.exports = router;