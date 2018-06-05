var Review = require('../models/review'),
    Comment = require('../models/comment');

var middlewareObj = {};

// Middleware
middlewareObj.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'You need to be logged in to do that');
    res.redirect('/login');
}

middlewareObj.checkCommentOwnership = (req, res, next) => {
    // is user logged in
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if(err) {
                req.flash('error', 'You need to be logged in to do that');
                res.redirect('back');
            } else {
                // does user own the comment
                if (foundComment.author.id.equals(req.user._id)) {
                    req.flash('success', 'Edit your comment below');
                    next();
                } else {
                    //otherwise, redirect
                    req.flash('error', 'You do not own this comment');
                    res.redirect("back");
                };
            };
        });
    } else {
        // if not, redirect
        req.flash('error', 'You need to be logged in to do that');
        res.redirect('back');
    };
}

middlewareObj.checkReviewOwnership = (req, res, next) => {
    // is user logged in
    if (req.isAuthenticated()) {
        Review.findById(req.params.id, (err, foundReview) => {
            if(err) {
                req.flash('error', 'Review not found');
                res.redirect('back');
            } else {
                // does user own the review
                if (foundReview.author.id.equals(req.user._id)) {
                    next();
                } else {
                    //otherwise, redirect
                    req.flash('error', "You don't have permission to do that");
                    res.redirect("back");
                };
            };
        });
    } else {
        // if not, redirect
        req.flash('error', 'You need to be logged in to do that');
        res.redirect('back');
    };
};

module.exports = middlewareObj;