const mongoose = require("mongoose");

const ObjectId = require('mongoose').Types.ObjectId

const artwork = require("./ArtPiece_Model");

const User = require("./UserModel");

const express = require('express');

let router = express.Router();


//const cors = require('cors'); //* this was for the image analysis, but it was a fail

router.use(express.static("public")); // for the client js files



router.get("/", queryParser);
router.get("/", loadArtworks);
router.get("/", respondArtworks);

//Artwork ID addArtwork does not exist

//*
router.get("/:uid", sendSingleArtwork);

// post /artworks/addartwork  //* i shifted the get version of this to the main server page becuz else to much trouble
router.post("/addartwork",express.json(),addArtwork);

router.post("/review",express.json(),postReview);

//router.get

//* this part is needed to create req.artwork used for sendsingleArtwork()
//Load a artwork based on uid parameter and place that artwork to req.artwork
router.param("uid", function (req, res, next, value) {
	let oid;
	console.log("Finding artwork by ID: " + value);
	
    try {
        
		oid = new ObjectId(value);
	} catch (err) {
        console.log("Artwork ID " + value + " does not exist.");
		//res.status(404).send("Artwork ID " + value + " does not exist.");
        next();
		return;
	}

	artwork.findById(value)
		.then(result => {
			if (!result) {
				res.status(404).send("Artwork ID " + value + " does not exist.");
				return;
			}

			console.log("artwork ID search Result:");
			console.log(result);

            //get the artwork object
			req.artwork = result;


            //check if the user can review this artwork
            req.artwork.reviewable = true;
            req.artwork.reviews.forEach(review=>{
                console.log(review);
                if(review.reviewerName === req.session.username){
                    req.artwork.reviewable = false;
                }
            });

            console.log( "req.artwork.reviewable = "+  req.artwork.reviewable);

            // get the artist object of this artwork
            result.getArtist(function (err, artist){
                if (err) {
                    console.error("Error getting artist for this artwork:", err);
                } else {
                    // this will be an array of artworks
                    console.log("Artist for the artwork found:", artist);
                    
                    req.artwork.artist = artist;
                    next();
                }
            })


		})
		.catch(err => {
			console.log(err);
			res.status(500).send("Error reading artwork.");
		});
});




//Send the representation of a single artwork that is a property we added to the request object
//Sends either JSON or HTML, depending on Accepts header
function sendSingleArtwork(req, res, next) {
	
    //res.render("pages/artwork", { reviewable: req.artwork.reviewable, artwork: req.artwork , artist: req.artwork.artist });
    
    // res.format({
	// 	"application/json": function () {
	// 		res.status(200).json(req.user);
	// 	},
	// 	"text/html": () => { res.render("pages/user", { user: req.user }); }
	// });

    res.format({
        // by default first option is used if accept header not set in front end
		html: () => {  
            res.render("pages/artwork", { reviewable: req.artwork.reviewable, artwork: req.artwork , artist: req.artwork.artist });
        },
        "application/json": function () {
			res.status(200).json(req.user);
		}	
	});



	next();
}




//Parse the query parameters
// limit: integer specifying maximum number of results to send back
// page: the page of results to send back (start is (page-1)*limit)
// Title: string to find in artpiece names to be considered a match
function queryParser(req, res, next) {
	
    const MAX_ARTISTS = 50;

    console.log(`ur in queryParser function`);
    console.log("show req.query before update");
    console.log( req.query);


	//build a query string to use for pagination later
	let params = [];
	for (prop in req.query) {
		if (prop == "page") {
			continue;
		}
		params.push(prop + "=" + req.query[prop]);
	}

	//* req.qstring - feels like this is useless in the program
	req.qstring = params.join("&");

    console.log(`ur in queryParser function`);
    console.log("show req.qstring bellow");
    console.log(req.qstring);


	//* creating and setting req.query.limit
	try {
		req.query.limit = req.query.limit || 10;
		req.query.limit = Number(req.query.limit);
		if (req.query.limit > MAX_ARTISTS) {
			req.query.limit = MAX_ARTISTS;
		}
	} catch {
		req.query.limit = 10;
	}

	//* creating and setting req.query.page
	try {
		req.query.page = req.query.page || 1;
		req.query.page = Number(req.query.page);
		if (req.query.page < 1) {
			req.query.page = 1;
		}
	} catch {
		req.query.page = 1;
	}


	//* req.query.name is always equal to "?"
	if (!req.query.Title) {
		req.query.Title = "?";
	}

	next();
}

//Loads the correct set of artworks based on the query parameters
//Adds a artworks property to the response object
//This property is used later to send the response
function loadArtworks(req, res, next) {
	
	//* this isnt really an index it just says how many elemnts to skip, 
	//* so if ur in page2, you would skip (2 -1)*10 = 10 elemnts
	let startIndex = ((req.query.page - 1) * req.query.limit);
	let amount = req.query.limit;

    console.log("ur in loadArtworks function");
    console.log("show req.query after update");
    console.log( req.query);

	artwork.find()
		.where("Title").regex(new RegExp(".*" + req.query.Title + ".*", "i"))
		.limit(amount)
		.skip(startIndex)
		.exec()
		.then(result => {
			res.artworks = result;
			next();
			return;
		})
		.catch(err => {
			res.status(500).send("Error reading artworks.");
			console.log(err);
			return;
		});
}

//Uses the res.artworks property to send a response
//Sends either HTML or JSON, depending on Accepts header
function respondArtworks(req, res, next) {
	

     
    res.format({
        // by default first option is used if accept header not set in front end
		html: () => {  
            console.log("hello u are in Html artworks response");
            //res.render("pages/artworks", {  artworks: res.artworks, qstring: req.qstring, current: req.query.page });
            res.render("pages/artworks2", {  artworks: res.artworks, qstring: req.qstring, current: req.query.page });
        },
        "application/json": function () {

            console.log("hello and u are in Json artworks response");
			res.status(200).json(res.artworks);
		},
        default: function () {
            // log the request and respond with 406
            res.status(406).send('Not Acceptable')
        }
        

	});

	next();
}





function postReview(req, res, next){

    const data = req.body;


    console.log(data);
    console.log(req.session.username);


      // add the review to the artwork document
      artwork.findById(data.artwork)
      .then(artwork => {
          if (!artwork) {
              throw new Error('artwork not found');
          }

          artwork.reviews.push({ reviewerName: req.session.username, reviewText: data.reviewText });

          return artwork.save();
      })
      .then(updatedArtwork => {
          console.log('artwork after adding review:\n', updatedArtwork);

          // add the review to the user document    
            return User.findOne()
              .where("username").equals(req.session.username)
              .then(user => {
                  if (!user) {
                      throw new Error('User not found');
                  }

                  
                  user.reviews.push({ artworkId: data.artwork, reviewText: data.reviewText });

                  console.log('user after adding review:\n', user);
                  
                  user.save();
              })
              .then(() => {
                  //console.log('user after adding review:\n', updatedUser);
                  // Send the success response here
                  res.status(200).send();
                  
                  
              })
              .catch(error => {
                  console.error('post review Error:', error.message);
              });
      })
      .catch(error => {
          console.error('post review Error:', error.message);
      });



}





function addArtwork(req, res, next){
    
    const artPiece = req.body;


    console.log(artPiece);


    let artUnit = new artwork();
	
    artUnit.Title = artPiece. artworkTitle;
    artUnit.Artist =  req.session.username;   // artist must be the current user
    artUnit.Year = artPiece. yearCreated;
    artUnit.Category = artPiece. artworkCategory;
    artUnit.Medium = artPiece.artworkMedium;
    artUnit.Description = artPiece.description;
    artUnit.Poster = artPiece.linkToArtworkPoster;


   // try to save the artwork
   artUnit.save()
   .then(result => {
       console.log("The artwork has been saved.");
       
       
        // Fetch the artist's user document
        User.findOne({ username: artUnit.Artist })
            .then(artistUser => {
                if (artistUser.artist) {
                    // Notify followers of the artist
                    User.updateMany(
                            { _id: { $in: artistUser.followers } }, // Notify users with IDs in the followers array
                            { $push: { notifications: `New artwork by ${artUnit.Artist}: ${artUnit.Title}` } } // Add notification to their array
                        )
                        .then(() => {
                            console.log("Notifications sent to followers.");
                        })
                        .catch(err => {
                            console.error("Notifications were not sent:", err);
                        });
                } else {
                    //* coming to this block means brand new artist so will not have any followers so need to do as above

                    artistUser.artist = true;

                    // change artist status and save 
                    artistUser.save() //* if this were an async function this line would have an await keyword, which i think is more readable
                            .then(()=>{
                                res.status(200).json({ success: true, message: "Artwork and user status saved successfully." });
                        
                            })
                            .catch(err => {
                                console.error("Error saving artist status: ", err);
                                // Send an error response to the client
                                res.status(200).json({ success: false, message: "Error changing account type of new artistuser." });
                            });
                            
                    return; //* the function ends here if it reaches this block
                }

                // Send a success response to the client
                res.status(200).json({ success: true, message: "Artwork saved successfully." });
            })
            .catch(err => {
                console.error("Error fetching artist:", err);
                // Send an error response to the client
                res.status(200).json({ success: false, message: "Error saving artwork." });
            });
       
   })
   .catch(err => {
       console.error("Error saving artwork:", err);
       // Send an error response to the client
       res.status(200).json({ success: false, message: "Error saving artwork." });
   });

}





module.exports = router;