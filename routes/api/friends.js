const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json()
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const FriendRequest = require('../../models/FriendRequest');
const User = require('../../models/User');


/*
TODO:
1. Clean up FriendRequests. Keep 1 friend request per person.
2. Clean up request
 */

router.post('/sendFriendRequest',jsonParser, (req, res) => {
    const friendRequest = {
        toPerson:req.body.toPerson,
        fromPerson:req.user.name,
        status: "InProgress"
    };
    //TODO:
    //Send an error if the request already exists
    FriendRequest.create(friendRequest)
        .then(
            fRequest => res.status(200).json({msd: 'Friend Request sent'})
        ).
        catch(
            err => res.status(400).json({ error: err, "request": req.body })
        );
});

router.get('/getFriends',jsonParser, (req, res) => {
    User.find({
        'name': { $in: req.user.friends}
    }, function(err, docs){
        res.status(200).json(docs[0].friends);
    });
});



/*
Notification Service:
https://www.section.io/engineering-education/push-notification-in-nodejs-using-service-worker/#setting-the-vapid-keys-with-web-push
 */

router.post('/acceptFriendRequest',jsonParser, (req, res) => {
    //Accept or Decline
    if(req.body.status ==="Accept"){
        //Go ahead and parse the request. Add user to each other friends. Send out notification
        addFriends(req.user.name,req.body.fromPerson);
        //TODO: FriendRequest Logic. Make sure you cant add the same friend twice
        updateFriendRequest(req.body);
        res.json("Friend added"); //->Clean up response body
    }else{
        //TODO: Fix the friend request response
        res.json("Something Went wrong"); //What went wrong, pass the error to the frontend!
    }
});

function updateFriendRequest(friendRequest){
    FriendRequest.findOne({status:"InProgress",from:friendRequest.fromPerson}, function (err, fr) {
        fr.status=friendRequest.status;
        fr.save(function (err) {
            if(err) {
                console.error('ERROR!' + err);
            }
        });
    });
}

function addFriends(userName1, userName2) {
    User.findOne({name: userName1}, function (err, user) {
        user.friends.addToSet(userName2);
        user.save(function (err) {
            if(err) {
                console.error('ERROR!' + err);
            }
        });
    });

    User.findOne({name: userName2}, function (err, user) {
        user.friends.addToSet(userName1);
        user.save(function (err) {
            if(err) {
                console.error('ERROR!' + err);
            }
        });
    });

    //TODO: Return user object here
    return true;
}

router.get('/getFriendRequests',jsonParser, (req, res) => {
    //TODO:
    // Seperate DB calls to another file
    FriendRequest.find({ toPerson: req.user.name})
        .then( docs => {
            const responseResults = [];
            docs = docs.filter(request => request.status === "InProgress")
            docs.forEach(element => {
                const res1 = {
                    "status": element.status,
                    "fromPerson": element.fromPerson,
                    "toPerson": element.toPerson,
                    "id": element._id
                };
                responseResults.push(res1);
            });
            res.json(responseResults);
        })
        .catch(err => res.status(400).json({ error: err, "request": req.body }));
});

module.exports = router;
