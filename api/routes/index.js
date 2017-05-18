var express = require('express');
var router = express.Router();

var ctrlHotels = require('../controllers/hotels.controllers.js');
//put fileType at the end, '.js', allows to access the functions exported from that file
var ctrlReviews = require('../controllers/reviews.controllers.js');

router//add a route
    .route('/hotels')
    .get(ctrlHotels.hotelsGetAll);

router//add a route
    .route('/hotels/:hotelId')
    .get(ctrlHotels.hotelsGetOne)
    .put(ctrlHotels.hotelsUpdateOne)
    .delete(ctrlHotels.hotelsDeleteOne);

router//add a route
    .route('/hotels')
    .post(ctrlHotels.hotelsAddOne);



//Reviews route
router//add a route
    .route('/hotels/:hotelId/reviews')
    .get(ctrlReviews.reviewsGetAll)
    .post(ctrlReviews.reviewsAddOne);

router//add a route
    .route('/hotels/:hotelId/reviews/:reviewId')
    .get(ctrlReviews.reviewsGetOne)
    .put(ctrlReviews.reviewsUpdateOne)
    .delete(ctrlReviews.reviewsDeleteOne);



module.exports = router;

