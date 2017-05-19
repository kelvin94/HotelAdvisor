var express = require('express');
var router = express.Router();

var ctrlHotels = require('../controllers/hotels.controllers.js');
//put fileType at the end, '.js', allows to access the functions exported from that file
var ctrlReviews = require('../controllers/reviews.controllers.js');
var ctrlUsers = require('../controllers/users.controllers.js');

router//add a route
    .route('/hotels')
    .get(ctrlUsers.authenticate, ctrlHotels.hotelsGetAll);//if token's header info is matched ( checked by ctrlUsers.authenticate), then proceed to hotelsGetAll function

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

//Auth route
router
    .route('/users/register')
    .post(ctrlUsers.register);
router
    .route('/users/login')
    .post(ctrlUsers.login);

module.exports = router;

