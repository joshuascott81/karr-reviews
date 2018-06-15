var express = require('express'),
    router  = express.Router(),
    Review = require('../models/review');

router.post('/', (req, res) => {
    // var searchOptionObject = {};
    // console.log(typeof req.headers.title);
    // if (req.headers.title != 'undefined') {
    //     searchOptionObject = {title: req.headers.title}
    // } else {
    //     searchOptionObject = {};
    // }

    //console.log(searchOptionObject);

    Review.find({}, (err, reviews) => {
        if (err) {
            console.log(err);
        } else {
            var reviewsArray = [];
            for (var movie in reviews) {
                reviewsArray.push(reviews[movie]);
            }

            //console.log(reviewsArray);

            if (req.headers.title == 'az') {
                reviewsArray.sort((a,b) => {
                    var titleA = a.title.toUpperCase();
                    var titleB = b.title.toUpperCase();

                    if (titleA < titleB) {
                        return -1;
                    }
                    if (titleA > titleB) {
                        return 1;
                    }

                    return 0;
                });
                reviews = reviewsArray;
            } else if (req.headers.title == 'za') {
                reviewsArray.sort((a,b) => {
                    var titleA = a.title.toUpperCase();
                    var titleB = b.title.toUpperCase();

                    if (titleA < titleB) {
                        return 1;
                    }
                    if (titleA > titleB) {
                        return -1;
                    }

                    return 0;
                });
                reviews = reviewsArray;
            } else if (req.headers.title == 'mostRecent') {
                reviews.sort({date: 'desc'});
            }
            res.send(reviews);
        };
    });
});

module.exports = router;

// app.post('/wall', (req, res) => {
//     Review.find({title: req.body.number}, (err, reviews) => {
//         if (err) {
//             console.log(err);
//         } else {
//             res.send(reviews);
//         };
//     });
// });