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
  var imdbID = { imdbID: 'Please look up IMDB ID' };

  res.render('reviews/new', { movie: imdbID });
});

// OMDB API
let key = '6d82971b';
let omdb = 'http://www.omdbapi.com/?apikey=' + key + '&i=';
let searchOmdb = 'http://www.omdbapi.com/?apikey=' + key + '&s=';

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
});

// Search for IMDB ID and return ID to form
router.post('/searchImdbId', (req, res) => {
  var searchTitle = req.body.title;

  ajaxRequest(
    {
      url: searchOmdb + searchTitle,
      method: 'GET',
      data: null
    },
    function(err, res, searchResults) {
      if (err) {
        console.log(err);
      } else {
        refresh(searchResults);
      }
    }
  );

  var refresh = searchResults => {
    if (JSON.parse(searchResults).Search) {
      var searchSend = JSON.parse(searchResults).Search;
    } else {
      var searchSend = [];
    }

    res.render('reviews/searchImdbId', {
      searchResults: searchSend
    });
  };
});

router.post('/searchImdbId/return', (req, res) => {
  // console.log(req.body.movie);
  res.render('reviews/new', { movie: JSON.parse(req.body.movie) });
});
// ajaxRequest(
//   {
//     url: searchOmdb + req.body.imdbId,
//     method: 'GET',
//     data: null
//   },
//   function(err, res, movieID) {
//     if (err) {
//       console.log(err);
//     } else {
//       // console.log(body);
//       rerenderForm(movieID);
//     }
//   }
// );

// var rerenderForm = movieID => {
//   // console.log(searchResults);
//   res.redirect('/new', {
//     movieID: movieID
//   });
// };
// });

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
