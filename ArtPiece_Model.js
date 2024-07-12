const mongoose = require("mongoose");
const Schema = mongoose.Schema;



let artPieceSchema = Schema({

    Title: {  //"Artwork Title"
        type: String,
        required: true,
        unique: true
       
    },
    Artist:{ //"Artist name"
        type: String,
        required: true
    },
    Year: {//"year the artwork was created"
        type: String,
        required: true
    },
    Category:{ //"this can be a painting, sculpture, photograph, etc."
        type: String,
        required: true 
    },
    Medium: {//"can be watercolour, acrylic, wood, bronze, silk, etc."
        type: String,
        required: true
    },
    Description: {//"Extra information about the artwork."
        type: String,
        default: "no description "
    },
    Poster: {//"https://hostname/image.jpg"
        type: String,
        required: true
    },

    reviews: [
        {
            _id: false,
            reviewerName: {
                type: String,
                required: false,
            },
            reviewText: {
                type: String,
                required: false,
            },
        },
    ]


});




//Instance method finds artworks of this user
artPieceSchema.methods.getArtist = function(callback){
	this.model("Users").findOne()
	.where("username").equals(this.Artist)
	.exec()
	.then(artist => callback(null, artist))
    .catch(err => callback(err));
};





// create the collection in the database, named Artpiece
module.exports = mongoose.model("Artpiece", artPieceSchema);