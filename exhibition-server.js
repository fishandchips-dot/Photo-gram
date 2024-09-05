const express = require('express');
const app = express();
const mongoose = require("mongoose");


// session stuff
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const exhibition = new MongoDBStore({
    uri: 'mongodb://127.0.0.1:27017/exhibition',
    collection: 'sessiondata'
});

app.use(session({ 
    secret: 'some secret key here', 
    resave: true,
    saveUninitialized: true
}));




const bodyParser = require('body-parser'); // retired - for login purposes

app.set("view engine", "pug");

app.use(express.static("public")); // for the client js files




app.use(function (req, res, next) {
    

    if(!req.session.username){
        req.session.username = '';
    }

    if(!req.session.loggedIn){
        req.session.loggedIn = false;
    }

    if(!req.session.userId){
        req.session.userId = '';
    }


    // if(!req.session.following){
    //     req.session.following = [];
    // }

    
    console.log(req.session);
    next();
});
    

// test for correct url
app.use(function(req,res,next){
    
    console.log('HTTP Method:', req.method);
    console.log('Received URL:', req.originalUrl);
    next();

})


// app.use(bodyParser.urlencoded({ extended: true })); // retired - login purposes

// // Parse any incoming JSON body
// app.use(bodyParser.json());


let userRouter = require("./user-router");
app.use("/verification", notLoggedIn,  userRouter);


//* user/
app.use("/user", loggedIn,  userRouter);


// app.use("/artists", loggedIn,  userRouter); //* now /user handles this route


let artPieceRouter = require("./artPiece-router");
app.use("/artworks", loggedIn,  artPieceRouter);


//* forced to put it here
app.get("/addArtwork",loggedIn, (req,res,next)=>{ res.render("pages/addArtwork", {});  });



app.get('/',notLoggedIn, async function(req, res) {
	//You can perform regular Mongo queries through Mongoose
	// use: mongoose.connection.db to refer to the database connection
	//let result = await mongoose.connection.db.collection("users").findOne({id:"mainpage"})
	
    res.render('pages/loginPage', {});
});



app.get('/signup', notLoggedIn, async function(req, res) {
	
    res.render('pages/sign-upPage', {});
});



app.get('/logout', (req, res) => {
    // Destroy the session
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
      } else {
        // Redirect to the login page or wherever you want after logout
        res.redirect('/');
      }
    });
});




app.get('/dummy',loggedIn, async function(req, res){

    console.log("wtf ur here");
    res.render('pages/dummy', {});
});



//Middleware to check if the user is logged in
function loggedIn(req, res, next) {
    if (req.session.loggedIn && req.session.username !== '') {
        // User is logged in, continue to the next middleware or route
        next();
    } else {
        // User is not logged in, redirect them to the login page or show an error
        res.redirect('/'); 
    }

    
}


function notLoggedIn(req, res, next) {
    if (!req.session.loggedIn && req.session.username === '') {
       
        console.log('hello notlogged in ');
        next();
    } else {
      
        res.redirect('/artworks'); 
    }
   
}

//* incomplete
function checkWhetherArtist(){

}

  


mongoose.connect('mongodb://127.0.0.1/exhibition');

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', async function() {

	//await mongoose.connection.db.collection("config").replaceOne({id:"mainpage"}, {id:"mainpage", featured: featured, motto: storeMotto}, {upsert:true})
	app.listen(3000);
	console.log("Server listening on port 3000");
});






