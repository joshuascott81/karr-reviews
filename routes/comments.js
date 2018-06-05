var express = require('express'),
    router  = express.Router({mergeParams: true}),
    Review  = require('../models/review'),
    Comment = require('../models/comment'),
    middleware = require('../middleware');

// Comments New
router.get('/new', middleware.isLoggedIn, (req, res) => {
    Review.findById(req.params.id, (err, foundReview) => {
        if (err) {
            console.log(err);
        } else {
            res.render('comments/new', {review: foundReview});
        }
    })
    
});

// Comments Create
router.post('/', middleware.isLoggedIn, (req, res) => {
    Review.findById(req.params.id, (err, foundReview) => {
        if (err) {
            console.log(err);
            res.redirect("/reviews");
        } else {
            Comment.create(req.body.comment, (err, newlyCreatedComment) => {
                if (err) {
                    console.log(err);
                } else {
                    //add username and id to comment
                    newlyCreatedComment.author.id = req.user._id;
                    newlyCreatedComment.author.username = req.user.username;
                    //save comment
                    newlyCreatedComment.save();
                    foundReview.comments.push(newlyCreatedComment);
                    foundReview.save();
                    req.flash('success', "Added Comment");
                    res.redirect('/reviews/' + req.params.id);
                }
            });
        }
    });
});

// Edit Comment Route
router.get('/:comment_id/edit', middleware.checkCommentOwnership, (req, res) => {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
        if (err) {
            res.redirect('back');
        } else {
            res.render('comments/edit', {review_id: req.params.id, comment: foundComment});
        };
    });
});

// Update Comment Route
router.put('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
        if (err) {
            res.redirect('back');
        } else {
            res.redirect('/reviews/' + req.params.id);
        };
    });
});

// Destroy Comment Route
router.delete('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err) => {
        if (err) {
            res.redirect('back');
        } else {
            req.flash('success', 'Comment deleted');
            res.redirect('back');
        };
    });
});

module.exports = router;