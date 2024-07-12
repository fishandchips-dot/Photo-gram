const mongoose = require("mongoose");
const Schema = mongoose.Schema;




let UserSchema = Schema({


    //email: 'dsadasd',
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: false,
        default: "password"
    },

    name: {
        type: String,
        required: false,
        default: function () {
            return this.username;
        }
    },
    //createdAt: 1701910441086,
    
    loggedin: {//true/false
        type: Boolean,
        default: false  // when user logs in this should be true
    },

    artist:{ //true/false
        type: Boolean,
        default: false
    },


    likedArtworks: [Schema.Types.ObjectId], // [ artwork ids]

    followedArtists: [Schema.Types.ObjectId],  //[ user ids]
    
    followers:  [Schema.Types.ObjectId],

    notifications: [{ type: String, _id: false }],

    workshops: [{ type: String, _id: false }],

    reviews: [
        {
            _id: false,
            artworkId: {
                type: Schema.Types.ObjectId,
                ref: 'Artpiece',
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
UserSchema.methods.findArtworks = function(callback){
	this.model("Artpiece").find()
	.where("Artist").equals(this.username)
	.exec()
	.then(artworks => callback(null, artworks))
    .catch(err => callback(err));
};



// this will create the collection in the database
module.exports = mongoose.model("Users", UserSchema);