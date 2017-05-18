//data model for the hotel data
//model is the compiled version of schema 
// an instance of the model has 1 to 1 relationship with a single document in the database
var mongoose = require('mongoose');
var reviewSchema = new mongoose.Schema({
    name : {
        //add in validation
        type : String,
        required : true // must have a name
    },
    rating : {
        type : Number,
        min : 0,
        max : 5,
        required : true
    },
    review  : {
        //add in validation
        type : String,
        required : true // must have a name
    },
    createdOn : {
        type : Date,
        default : Date.now
    }
});


var roomSchema = new mongoose.Schema({
    type : String,
    number : Number,
    description: String,
    photos : [String],
    price : Number
});


//create new schema
var hotelSchema = new mongoose.Schema({
    name : {
        //add in validation
        type : String,
        required : true // must have a name
    },
    stars : {
        type : Number,
        min : 0,
        max : 5,
        default : 0 //setting default value
    },
    services : [String],
    description : String,
    photos : [String],
    currency : String,
    reviews : [reviewSchema],//passing in the schema for the reviews
    rooms : [roomSchema],
    location : {
        address: String,
        //Always store coordinates longitude (E/W), latitude(N/S)
        coordinates : {
            type: [Number],
            index : '2dsphere'   
        }
    }
});



mongoose.model('Hotel', hotelSchema);//compiled schema to model


