var express = require('express'),
  router = express.Router(),
  Review = require('../models/review'),
  middleware = require('../middleware'),
  ajaxRequest = require('ajax-request');

router.get('/', (req, res) => {
  //Get all reviews from DB
  Review.find({}, (err, reviews) => {
    if (err) {
      console.log(err);
    } else {
      res.render('reviews/index', { reviews: reviews });
    }
  });
  //res.render('reviews', {reviews: reviews});
});

router.get('/new', middleware.isLoggedIn, (req, res) => {
  res.render('reviews/new');
});

// OMDB API
let key = '6d82971b';
let omdb = 'http://www.omdbapi.com/?apikey=' + key + '&i=';

// CREATE - add new review to DB
router.post('/', middleware.isLoggedIn, (req, res) => {
  let author = {
    id: req.user._id,
    username: req.user.username
  };

  //   request('url', function(err, res, body) {});

  ajaxRequest(
    {
      url: omdb + req.body.imdbID,
      method: 'GET',
      data: null
    },
    function(err, res, body) {
      if (err) {
        console.log(err);
      } else {
        let newReview = {
          imdbID: req.body.imdbID,
          omdbInfo: body,
          reviewText: req.body.reviewText,
          date: req.body.date,
          rating: req.body.rating,
          author: author
        };

        //   console.log(newReview.omdbInfo);
        createReview(newReview);
      }
    }
  );

  let createReview = createdReview => {
    Review.create(createdReview, (err, newlyCreated) => {
      if (err) {
        console.log(err);
      } else {
        console.log(createdReview);
        res.redirect('/reviews');
      }
    });
  };

  //   $.ajax({
  //     type: 'GET',
  //     url: omdb + movieID,
  //     success: function(data) {
  //       fName(data, i);
  //     },
  //     data: null
  //   });

  //   let omdbInfo = {};

  //   function server() {
  //     xmlhttp = new XMLHttpRequest();
  //     xmlhttp.open('GET', omdb + req.body.imdbID, true);
  //     xmlhttp.onreadystatechange = function() {
  //       if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
  //         console.log(xmlhttp.responseText);
  //         omdbInfo = xmlhttp.responseText;
  //       }
  //     };
  //     xmlhttp.send();
  //   }
});

// SHOW - show more info about one review
router.get('/:id', (req, res) => {
  Review.findById(req.params.id)
    .populate('comments')
    .exec((err, foundReview) => {
      if (err || !foundReview) {
        console.log(err);
        req.flash('error', 'Sorry, that review does not exist');
        return res.redirect('/reviews');
      } else {
        res.render('reviews/show', { review: foundReview });
      }
    });
});

// Edit Review Route
router.get('/:id/edit', middleware.checkReviewOwnership, (req, res) => {
  Review.findById(req.params.id, (err, foundReview) => {
    if (err) {
      res.redirect('/reviews');
    } else {
      res.render('reviews/edit', { review: foundReview });
    }
  });
});

// Update Review Route
router.put('/:id', middleware.checkReviewOwnership, (req, res) => {
  ajaxRequest(
    {
      url: omdb + req.body.imdbID,
      method: 'GET',
      data: null
    },
    function(err, res, body) {
      if (err) {
        console.log(err);
      } else {
        let updatedReview = {
          imdbID: req.body.imdbID,
          omdbInfo: body,
          reviewText: req.body.reviewText,
          date: req.body.date,
          rating: req.body.rating
        };

        //   console.log(newReview.omdbInfo);
        updateReview(updatedReview);
      }
    }
  );

  let updateReview = updatedReview =>
    Review.findByIdAndUpdate(
      req.params.id,
      updatedReview,
      (err, updatedCampground) => {
        if (err) {
          res.redirect('/reviews');
        } else {
          res.redirect('/reviews/' + req.params.id);
        }
      }
    );
});

// Destroy Review Route
router.delete('/:id', middleware.checkReviewOwnership, (req, res) => {
  Review.findByIdAndRemove(req.params.id, err => {
    if (err) {
      res.redirect('/reviews');
    } else {
      res.redirect('/reviews');
    }
  });
});

module.exports = router;
