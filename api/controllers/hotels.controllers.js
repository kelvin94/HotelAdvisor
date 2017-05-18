 //this controller runs when '/api' route is called

 //controller controls the fctionality and wt happens when a certain route is visited
 
// //bring DB connection file, native driver method
// var dbconn = require('../data/dbconnection.js');

// var ObjectId = require('mongodb').ObjectID;//Obj Id helper

// var hotelData = require('../data/hotel-data.json');


var mongoose = require('mongoose');
var Hotel = mongoose.model('Hotel');//reference to the model, use it to interact with the DB


var runGeoQuery = function(req, res){
    //retrieve Geo Json point is used by mongodb to do calculations for the geospatial stuff
    var lng = parseFloat(req.query.lng);
    var lat = parseFloat(req.query.lat);

    if (isNaN(lng) || isNaN(lat)) {
    res
      .status(400)
      .json({
        "message" : "If supplied in querystring, lng and lat must both be numbers"
      });
    return;
  }
    //getoJson point
    var point = {
        type : "Point",
        coordinates : [lng, lat]
    };

    var geoOptions = {
        spherical : true,
        maxDistance : 2000,//limit distance of the search, specify max distance from that center point that I want to search within
        num : 5//restrict number of records return
    };

    Hotel//.geoNear does not take EXEC method so that we need a call back function to send responses 
        .geoNear(point, geoOptions, function(err, results, stats){
            console.log('Geo results', results);
            console.log('Geo stats', stats);
            res
                .status(200)
                .json(results);
        });


    
};




module.exports.hotelsGetAll = function(req, res){
        //下面三行是native driver得用法
        // //check to see if we get our connection from a controller
        // var db = dbconn.get();
        // var collection = db.collection('hotels');// retrieve the collection we want

        var offset = 0;//offset(which hotel to start), count是用来return指定的一部分的data
        var count =5;
        var maxCount = 10;

        //Coordination in the query string, use specific function to handle such query string 
        if(req.query && req.query.lat && req.query.lng){
            runGeoQuery(req, res);
            return;
        }

        //LIMIT method to restrict number of documents to return
        //SKIP method to specify where to start
        if(req.query && req.query.offset){
            offset = parseInt( req.query.offset,10);
        }

        if(req.query && req.query.count){
            count = parseInt( req.query.count,10);
        }
        //native driver method
        // collection
        //     .find()
        //     .skip(offset)
        //     .limit(count)
        //     .toArray(function(err, docs){
        //         console.log("Found hotels", docs);
        //         res
        //             .status(200)
        //             .json(docs);

        //     });

        //error trapping: what if 'offset' or 'count' is not a number
        if(isNaN(offset) || isNaN(count)){
            res
                .status(400)
                .json({
                    "message" : "If supplied in querystring count and offset should be a number"
                });
            return;
        }

        //protect the resources by setting a maximum # of records(documents) that users can request
        if( count > maxCount){
            res 
                .status(400)
                .json({
                    "message" :  "count limit of " + maxCount + " exceeded"
                });
            return;
        }
        //Mongoose driver method
        Hotel
            .find()
            .skip(offset)
            .limit(count)
            //.exec() tell mongoose to execute this query
            //'hotels' in the call back function is the returned data
            .exec(function(err, hotels){
                if(err){
                    console.log("error finding hotesl");
                    res
                        .status(500)
                        .json(err);
                }else{
                    console.log("Found hotels", hotels.length);
                    res
                        .status(200)
                        .json(hotels);

                }
            });

        // console.log("db",db);
//         console.log("GET the Hotels");
//         console.log(req.query);//req.query returns an obj

//         var returnData =hotelData.slice(offset,offset + count);

//         res
//             .status(200)
//             .json( returnData );
 }; 

module.exports.hotelsGetOne = function(req, res){
    //native driver method to connect to DB
    //var db = dbconn.get();
    //var collection = db.collection('hotels');
    
    var hotelId = req.params.hotelId;//when the request comes in, hotelId will be identified and store in var hotelId.
    console.log("GET One HotelID", hotelId);
    //return only one document
    //since Obj Id data type is special to mongodb
    //mongo driver has method to help querying mongodb using Obj Id
    Hotel
        .findById(hotelId)
        //.findOne({这一行跟下一样都是mongodb native driver找single document的方法
           // _id : ObjectId(hotelId)
        .exec(function(err, doc){
            var response = {
                status　: 200,
                message : doc
            };
                if(err){
                    console.log("error finding hotel");
                    response.status=500;
                    response.message = err;
                        
                }else if(!doc){
                        response.status = 404;
                        response.message = {
                            "message" : "Hotel ID not found"
                        };
                }
                res
                    .status(response.status)
                    .json(response.message);

                
            });
};

//offset == starting position
//count == number of objs



var _splitArray = function(input) {
  var output;
  if (input && input.length > 0) {
    output = input.split(";");
  } else {
    output = [];
  }
  return output;
};



module.exports.hotelsAddOne = function(req, res){
    //下面一整部分的代码都是通过mongo native driver来跟DB进行互动
    /*
    var db = dbconn.get();
    var collection = db.collection('hotels');
    var newHotel;

    console.log("POST new Hotel");
    
    if(req.body && req.body.name && req.body.stars){
        newHotel = req.body;
        newHotel.stars = parseInt(req.body.stars, 10);//in req.body, everything is string
        collection.insertOne(newHotel, function(err, response){

            console.log(response);
            console.log(response.ops);
            res
                .status(201)
                .json(response.ops);

        });
        

    }else{
        console.log("data missing from body");
        res
            .status(400)
            .json({message : "required data missing from body"});
    }
    */

    //Using Mongoose to interact with DB
    Hotel//Hotel == model name
        //create method: 1st parameter == the obj contains data that will be added to the DB
        .create({
            name : req.body.name,
            description : req.body.description,
            stars : parseInt(req.body.stars,10),
            services : _splitArray(req.body.services),//_split method is to convert string to arrays
            photos : _splitArray(req.body.photos),
            currency : req.body.currency,
            location : 
            {
                address : req.body.address,
                coordinates : [parseFloat(req.body.lng), parseFloat(req.body.lat)]
            }

        }, function(err, hotel){//this call back function: 2nd parameter is the new document returned from the db; This callback will run shen the create method is done
            if(err){
                console.log("Error creating hotel");
                res
                    .status(400)
                    .json(err);
            }else{
                console.log("Hotel created", hotel);
                res
                    .status(201)
                    .json(hotel);
            }
        });

};


module.exports.hotelsUpdateOne = function(req, res){
    var hotelId = req.params.hotelId;//when the request comes in, hotelId will be identified and store in var hotelId.
    console.log("GET One HotelID", hotelId);
    //return only one document
    //since Obj Id data type is special to mongodb
    //mongo driver has method to help querying mongodb using Obj Id
    Hotel
        .findById(hotelId)
        //.findOne({这一行跟下一样都是mongodb native driver找single document的方法
           // _id : ObjectId(hotelId)
        .select("-reviews -rooms")
        .exec(function(err, doc){
            var response = {
                status　: 200,
                message : doc
            };
                if(err){
                    console.log("error finding hotel");
                    response.status=500;
                    response.message = err;
                        
                }else if(!doc){
                        response.status = 404;
                        response.message = {
                            "message" : "Hotel ID not found"
                        };
                }

                if(response.status !== 200 ){
                    
                    res
                        .status(response.status)
                        .json(response.message);
                }else{
                    doc.name = req.body.name,
                    doc.description = req.body.description,
                    doc.stars = parseInt(req.body.stars,10),
                    doc.services = _splitArray(req.body.services),//_split method is to convert string to arrays
                    doc.photos = _splitArray(req.body.photos),
                    doc.currency = req.body.currency,
                    doc.location = 
                    {
                        address : req.body.address,
                        coordinates : [parseFloat(req.body.lng), parseFloat(req.body.lat)]
                    };
                    doc.save(function(err, hotelUpdated){//save the instance back to mongodb
                        if(err){
                            res
                                .status(500)
                                .json(err);

                        }else {
                            res
                                .status(204)
                                .json();
                        }
                    });

        }
                

                
    });
};



module.exports.hotelsDeleteOne = function(req, res){
    var hotelId = req.params.hotelId;

    Hotel
        .findByIdAndRemove(hotelId)
        .exec(function(err, hotel){
            if(err){
                res
                .status(404)
                .json(err);
            }else {
                console.log("hotel deleted, id: ", hotelId);
                res
                    .status(204)
                    .json();

            }
        });
};







