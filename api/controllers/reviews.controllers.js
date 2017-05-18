var mongoose = require('mongoose');
var Hotel = mongoose.model('Hotel');//reference to the model, use it to interact with the DB

module.exports.reviewsGetAll = function(req, res){
    var hotelId = req.params.hotelId;//when the request comes in, hotelId will be identified and store in var hotelId.
    console.log("GET One HotelID", hotelId);
    //return only one document
    //since Obj Id data type is special to mongodb
    //mongo driver has method to help querying mongodb using Obj Id
    Hotel
        .findById(hotelId)
        //.findOne({这一行跟下一样都是mongodb native driver找single document的方法
           // _id : ObjectId(hotelId)
        .select('reviews')//specify which field of the document to be returned
        .exec(function(err, doc){
            console.log("Returned doc",doc);
            res
                .status(200)
                .json( doc.reviews );//think of our data structure, Hotel里面有reviews这个sub document so that to access it, use the dot method as if we access objects in javascript

        });

};



module.exports.reviewsGetOne = function(req, res){
    var hotelId = req.params.hotelId;
    var reviewId = req.params.reviewId;
    console.log("GET  ReviewId" + reviewId + "GET One HotelId" + hotelId);

     Hotel
        .findById(hotelId)
        //.findOne({这一行跟下一样都是mongodb native driver找single document的方法
           // _id : ObjectId(hotelId)
        .select('reviews')//specify which field of the document to be returned
        .exec(function(err, hotel){
            console.log("Returned doc",hotel);
            var review = hotel.reviews.id(reviewId);//find a sub document, reference:http://mongoosejs.com/docs/subdocs.html
            res
                .status(200)
                .json( review );//think of our data structure, Hotel里面有reviews这个sub document so that to access it, use the dot method as if we access objects in javascript

        });
};



var _addReview = function(req, res, hotel) {

    //pushing new review into the existing hotelReview's array
    hotel.reviews.push({//this PUSH saves the new review into model instance
        name: req.body.name,
        rating : parseInt(req.body.rating,10),
        review : req.body.review
    });

    //save the updated doc with the newly added review into DB

    hotel.save(function(err, hotelUpdated ){//second para is the returned doc
        if(err){
            res
                .status(500)
                .json(err);
        }else{//returning the new review with the new id only instad of returning the whole document
            res
                .status(201)
                .json(hotelUpdated.reviews[hotelUpdated.reviews.length - 1]);
        }
    });



};

module.exports.reviewsAddOne = function(req, res){
    var hotelId = req.params.hotelId;//when the request comes in, hotelId will be identified and store in var hotelId.
    console.log("GET One HotelID", hotelId);
    //return only one document
    //since Obj Id data type is special to mongodb
    //mongo driver has method to help querying mongodb using Obj Id
    Hotel
        .findById(hotelId)
        //.findOne({这一行跟下一样都是mongodb native driver找single document的方法
           // _id : ObjectId(hotelId)
        .select('reviews')//specify which field of the document to be returned
        .exec(function(err, doc){
            var response = {
                status : 200,
                "message" : []
            };
            if(err){
                res
                    response.status = 500;
                    response.message = {err};
            } else if( !doc){
                console.log("Hotel id is not found in DB", id);
                res
                    response.status = 404;
                    response.message = {
                        "message" : "Hotel Id not found" + id
                    };
            }

            if(doc){
                _addReview(req, res, doc);
            }else{
                res
                    .status(response.status)
                    .json( response.message );//think of our data structure, Hotel里面有reviews这个sub document so that to access it, use the dot method as if we access objects in javascript

            }

        });
};

var _updateReview = function(req, res, hotel){
    // 1. Find the review we want to update
    var reviewId = req.params.reviewId;
    var originalReview = hotel.reviews.id(reviewId);
    // 2. update it
    originalReview.name = req.body.name;
    originalReview.review = req.body.review;
    originalReview.rating = parseInt(req.body.rating, 10);;
    // 3. save it


    hotel.save(function(err, hotelUpdated ){//second para is the returned doc
        if(err){
            res
                .status(500)
                .json(err);
        }else{//returning the new review with the new id only instad of returning the whole document
            res
                .status(204)
                .json();
        }
    });
};


module.exports.reviewsUpdateOne = function(req, res){
    var hotelId = req.params.hotelId;//when the request comes in, hotelId will be identified and store in var hotelId.
    console.log("GET One HotelID", hotelId);
    //return only one document
    //since Obj Id data type is special to mongodb
    //mongo driver has method to help querying mongodb using Obj Id
    Hotel
        .findById(hotelId)
        //.findOne({这一行跟下一样都是mongodb native driver找single document的方法
           // _id : ObjectId(hotelId)
        .select('reviews')//specify which field of the document to be returned
        .exec(function(err, doc){
            var response = {
                status : 200,
                "message" : []
            };
            if(err){
                res
                    response.status = 500;
                    response.message = {err};
            } else if( !doc){
                console.log("Hotel id is not found in DB", id);
                res
                    response.status = 404;
                    response.message = {
                        "message" : "review Id not found" + reviewId
                    };
            }

            if(doc){
                _updateReview(req, res, doc);
            }else{
                res
                    .status(response.status)
                    .json( response.message );//think of our data structure, Hotel里面有reviews这个sub document so that to access it, use the dot method as if we access objects in javascript

            }

        });
};





module.exports.reviewsDeleteOne = function(req, res){
    var hotelId = req.params.hotelId;//when the request comes in, hotelId will be identified and store in var hotelId.
    console.log("GET One HotelID", hotelId);
    var reviewId = req.params.reviewId;
    //return only one document
    //since Obj Id data type is special to mongodb
    //mongo driver has method to help querying mongodb using Obj Id
    Hotel
        .findById(hotelId)
        //.findOne({这一行跟下一样都是mongodb native driver找single document的方法
           // _id : ObjectId(hotelId)
        .select('reviews')//specify which field of the document to be returned
        .exec(function(err, hotel){
            var response = {
                status : 200,
                "message" : []
            };
            if(err){
                res
                    response.status = 500;
                    response.message = {err};
            } else if( !hotel){
                console.log("Hotel id is not found in DB", id);
                res
                    response.status = 404;
                    response.message = {
                        "message" : "Review Id not found" + reviewId
                    };
            }

            if(response.status !== 200){
                res
                    .status(response.status)
                    .json(response.message);
            }else{
                //do the delete action here
                hotel.reviews.id(reviewId).remove();
                hotel.save(function(err, hotelUpdated){
                    if(err){
                        res
                            .status(500)
                            .json(err);
                    } else{
                        res
                            .status(204)
                            .json();//think of our data structure, Hotel里面有reviews这个sub document so that to access it, use the dot method as if we access objects in javascript
                    }    

                })

            }

        });
};


