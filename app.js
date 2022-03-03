const  express = require('express');
const connectDB = require('./config/db');
const passport = require("passport");
const bodyParser = require("body-parser");

const app = express();
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);
app.use(bodyParser.json());
connectDB().then(r => console.log(r));

// Passport middleware
app.use(passport.initialize());
// Passport config
require("./config/passport")(passport);

const books = require('./routes/api/books');
app.use('/books',passport.authenticate('jwt', { session: false }) ,books);

const friendRequests = require('./routes/api/friends');
app.use('/api/friends/',passport.authenticate('jwt', { session: false }) ,friendRequests);



const uploadImage = require('./routes/api/upload');
app.use('/api/upload',passport.authenticate('jwt', {session: false}), uploadImage);



const users = require('./routes/api/users');
app.use('/api/users', users);


app.get('/', (req,res) => res.send('Hello World'));
const  port = process.env.PORT || 8082;

//Upload picture --> AccountRedId?
//Get Pictures for an account


console.log("Test");
app.listen(port, () => console.log(`Server running on port ${port}`));
