const mongoose = require("mongoose");
const artPiece = require("./ArtPiece_Model");
const user = require("./UserModel");
// const User = require("./UserModel");
// const Purchase = require("./PurchaseModel");

const fs = require("fs");
const path = require("path");
//const { json } = require("body-parser");




const filePath = path.join(__dirname, "gallery.json");

let artPieces; // will contain artpieces as an array 

try {

  // Read the file synchronously
  const data = fs.readFileSync(filePath, "utf8");

    artPieces = JSON.parse(data);

  Object.keys(artPieces).forEach(index=>{
    console.log(artPieces[index].Artist);
  })

  //console.log( artPieces);

} catch (err) {
  console.error("Error reading the file containing the artworks:", err);
}


// create artpiece documents and store in the list
let artPieceList = [];

let userList = []; // will contain user documents

for (let i = 0; i < artPieces.length; i++) {
	
    let artUnit = new artPiece();
	
    artUnit.Title = artPieces[i].Title;
    artUnit.Artist = artPieces[i].Artist;
    artUnit.Year = artPieces[i].Year;
    artUnit.Category = artPieces[i].Category;
    artUnit.Medium = artPieces[i].Medium;
    artUnit.Description = artPieces[i].Description;
    artUnit.Poster = artPieces[i].Poster;

    //create user for the artist, remember duplicates exist at this point
    let userUnit = new user();
    userUnit.username = artPieces[i].Artist;
    userUnit.artist = true;


	//artUnit.price = Number(faker.commerce.price());
	// artUnit.dimensions = { x: Math.floor(Math.random() * 50), y: Math.floor(Math.random() * 50), z: Math.floor(Math.random() * 50) };
	// artUnit.stock = Number(Math.floor(Math.random() * 50));
	artPieceList.push(artUnit);
  userList.push(userUnit);
}


//console.log(userList);




//save artpieces to database named exhibition
mongoose.connect('mongodb://127.0.0.1/exhibition');
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', async function () {

	await mongoose.connection.dropDatabase()
	console.log("Dropped database. Starting re-creation.");

	let completedUploads = 0;

  let completedUserUploads = 0;
	

    artPieceList.forEach(artPiece => {

       // i had to make the description field not mandory for this to work
      artPiece.save()
        .then(result => {
          completedUploads++;
          if (completedUploads >= artPieceList.length) {
            console.log("All artpieces saved.");
          }
        })
        .catch(err => {
          throw err;
        })
	  });

    //console.log("starting user upload.");

    // Ensure the unique index exists for the 'username' field
    await user.init();

    userList.forEach(user=>{
      user.save()
        .then(result =>{
          console.log(result);
          if (completedUserUploads >= userList.length) {
            console.log("All unique users saved.");
          }
        })
        .catch(error => {
          if (error.code === 11000 && error.keyPattern && error.keyPattern.username) {
              // Duplicate key error for the 'username' field
              //console.error('Username already exists');
          } else {
              // Handle other errors
              throw error;
          }
        });
    })
    // console.log("Unique users saved.");

});
