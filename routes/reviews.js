var express = require('express'),
    router  = express.Router(),
    Review = require('../models/review'),
    middleware = require('../middleware');

router.get('/', (req, res) => {
    //Get all reviews from DB
    Review.find({}, (err, reviews) => {
        if (err) {
            console.log(err);
        } else {
            res.render('reviews/index', {reviews: reviews});
        }
    });
    //res.render('reviews', {reviews: reviews});
});

router.get('/new', middleware.isLoggedIn, (req, res) => {
    res.render("reviews/new");
});

// CREATE - add new review to DB
router.post('/', middleware.isLoggedIn, (req, res) => {
    let author = {
        id: req.user._id,
        username: req.user.username
    };

    let newReview = {
        imdbID: req.body.imdbID,
        title: req.body.title,
        posterURL: req.body.posterURL,
        reviewText: req.body.reviewText, 
        rating: req.body.rating,
        author: author
    };

    Review.create(newReview, (err, newlyCreated) => {
        if (err) {
            console.log(err);
        } else {

            res.redirect('/reviews');
        }
    })

    
});


// SHOW - show more info about one review
router.get('/:id', (req, res) => {
    Review.findById(req.params.id).populate('comments').exec((err, foundReview) => {
        if (err || !foundReview) {
            console.log(err);
            req.flash('error', "Sorry, that review does not exist");
            return res.redirect('/reviews');
        } else {
            res.render('reviews/show', {review: foundReview});
        }
    });
});

// Edit Review Route
router.get('/:id/edit', middleware.checkReviewOwnership, (req, res) => {
    Review.findById(req.params.id, (err, foundReview) => {
        if(err) {
            res.redirect('/reviews');
        } else {
            res.render('reviews/edit', {review: foundReview});
        };
});
});

// Update Review Route
router.put("/:id", middleware.checkReviewOwnership, (req, res) => {
    Review.findByIdAndUpdate(req.params.id, req.body.review, (err, updatedCampground) => {
        if(err) {
            res.redirect('/reviews');
        } else {
            res.redirect('/reviews/' + req.params.id);
        }
    })
});

// Destroy Review Route
router.delete('/:id', middleware.checkReviewOwnership, (req, res) => {
    Review.findByIdAndRemove(req.params.id, (err) => {
        if (err) {
            res.redirect('/reviews');
        } else {
            res.redirect('/reviews');
        };
    });
});

module.exports = router;