
const mongoose = require("mongoose");

const ObjectId = require('mongoose').Types.ObjectId

const User = require("./UserModel");

const express = require('express');

let router = express.Router();


router.use(express.static("public")); // for the client js files

// router.get("/", queryParser);
// router.get("/", loadProductsDatabase);
// router.get("/", respondProducts);

//* /user/profile
router.get("/profile", express.json(),loadProfile);

//* this required an extra noun before the id if u didnt check the id type before calling the function in it , we checked it in the function btw 
router.get("/:uid",express.json(), sendArtistPage);

//* /artists/follow
router.post("/follow", express.json(),updateFollowing);


//* /user/type
router.post("/type", express.json(),changeAccountType);  


//* PUT verfication/login 
router.put("/login", express.json(),verifyLogin); //* handles req from userVerification.js

//* POST verfication/signup
router.post("/signup", express.json(),verifySignup); //* handles req from userVerification.js



function verifyLogin(req, res,next){
    const { username, password } = req.body; // json gets parsed maybe

    let data =  req.body;

    console.log(data);

    console.log(req.session);

    User.findOne()
        .where("username").equals(username)
        .where("password").equals(password)
        .exec()
        .then(result=>{
            
            // user found
            if(result){
                console.log( "user found");
                
                req.session.username = result.username;
                req.session.userId = result._id;
                req.session.loggedIn = true;

                //req.session.following = result.followedArtists;
                

                // without this session wasnt updating properly
                req.session.save();

                res.status(200).json({  userExists: true });
                
            }
            else{
                console.log( "user not found");
                res.status(200).json({ userExists: false });
                
            }
           
        })
        .catch(err => {
			console.log(err);
			res.status(500).send("error reading users collection");
		});
    
    
}


//* incomplete - look at userVerification
//very similar to verifylogin() but implemented with asyc rather than promises
async function verifySignup(req, res,next){


    try{
        const { username, password } = req.body;

        let user = await User.findOne().where("username").equals(username).exec();

        if(user){
            console.log("username already exists");
            next();
        }
        else{
            let newUser = new User();

            newUser.username = username;
            newUser.password = password;

            //console.log( newUser);

            await User.init();

            newUser.save()
                    .then(result => {
                        console.log("new user added");

                        req.session.username = result.username;
                        req.session.userId = result._id;
                        req.session.loggedIn = true;

                        // req.session.following = result.followedArtists;
                        req.session.save();

                        console.log(req.session);
                        

                    })
                    .catch(err =>{
                        console.log(err);
			            res.status(500).send("Error saving user.");
                    });

        }

        res.status(200).send('action successful');

    }catch (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
    }
}



//*before starting this modify user schema to have artworks uploaded by user
// implement removing reviews
// implement artist page
// implement following artists
// implement search artworks here

function loadProfile(req, res, next){



    User.findOne()
        .where("username").equals(req.session.username)
        .then(user => {
            if (!user) {
                throw new Error('User not found');
            }

            req.user = user;

            const isArtist = user.artist;

            console.log("yo here you are inside load profile");
            console.log("User found:", user);

            res.render("pages/profile", { isArtist : isArtist });
            next();
        
        })
        .catch(err => {
			console.log(err);
			res.status(500).send("Error loading user profile.");
		});          


}








function sendArtistPage(req, res, next) {
    console.log("req.params.uid: ", req.params.uid);

    //* test to see if req.params.uid is an actual id and not some noun
    let oid;
	try {
        
		oid = new ObjectId(req.params.uid);
	} catch (err) {
		next();
		return;
        
	}

   
    // rest of your code
    User.findById(req.params.uid)
            .then(artist=>{
                if (!artist) {
                    res.status(404).send("Artist ID " + req.params.uid  + " does not exist.");
                    return;
                }

                //* check if user follows the artist
                let isfollower = false;
                if (artist.followers.includes(req.session.userId)) {
                    isfollower = true;
                }

                

                artist.findArtworks(function (err, artworks){
                    if (err) {
                        console.error("Error fetching artworks:", err);
                    } else {
                        // this will be an array of artworks
                        console.log("Artworks found:", artworks);
                
                        console.log("artist found: ",artist);
                        console.log("artworks of this artist: ",artworks);
                        
                        res.render("pages/artist", { artperson:artist, artpersonWorks: artworks , followed: isfollower});
                        
                        
                        next();
                    }
                });

                
                

            })
            .catch(err => {
                console.log(err);
                res.status(500).send("Error reading user database.");
            }); 


}





async function updateFollowing(req, res, next) {
    const data = req.body;

    try {
        
        const artistId = mongoose.Types.ObjectId.createFromHexString(data.artistId);

        console.log( "artist id before",data.artistId);

        console.log( "artist id after",artistId);

        // Update user
        const user = await User.findById(req.session.userId);
        if (user) {
            if (user.followedArtists.includes(artistId)) {
                // Remove following
                user.followedArtists = user.followedArtists.filter(id => id.toString() !== artistId.toString());
            } else {
                // Add following
                user.followedArtists.push(artistId);
            }
            // Save the updated user document
            await user.save();
        }


        // Update artist
        const artist = await User.findById(artistId);
        if (artist) {
            if (artist.followers.includes(req.session.userId)) {
                // Remove follower
                artist.followers = artist.followers.filter(id => id.toString() !== req.session.userId.toString());
            } else {
                // Add follower
                artist.followers.push(req.session.userId);
            }
            // Save the updated artist document
            await artist.save();
        }

        console.log(" here is the updated following");
        console.log(user);
        console.log(artist);


        res.status(200).send("User and artist following information updated successfully.");
        next();
    } catch (error) {
        console.log(error);
        console.log("Error updating user and artist following information.");
        res.status(500).send("Error updating user and artist following information.");
    }
}




//* u were here
async function changeAccountType(req, res, next) {
    try {
        let isNewArtist = false;

        //console.log('isNewArtist'+ isNewArtist);

        const user = await User.findById(req.session.userId); //* this should never fail

        user.findArtworks(async function (err, artworks) {
            if (err) {
                console.error("Error fetching artworks:", err);
            } else {
                if (artworks.length > 0) { // means returning artist so let them do whatever
                    
                    user.artist = !user.artist;

                    // Save the updated user object
                    try {
                        await user.save();
                        console.log("User artist status updated successfully.");
                        console.log(user);

                        // res.status(200).json({ isNewArtist });;
                        // next();
                        // return;

                    } catch (saveErr) {
                        console.error("Error saving user artist status:", saveErr);
                        res.status(500).send("Error changing user account type in database.");
                    }
                } else { // means user wants to be an artist for the first time
                    isNewArtist = true;  //* note if new artist we didnt still change the artist status of the user here
                }                        //* the status is not changed so that the addartwork function can catch the case of the artist being brand new  
                 // Send isNewArtist info to the client
                res.status(200).json({ isNewArtist });
                return;
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).send("Error changing user account type in database.");
    }
}







module.exports = router;