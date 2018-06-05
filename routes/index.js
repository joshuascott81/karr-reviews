var express = require('express'),
    router  = express.Router(),
    passport = require('passport'),
    User = require('../models/user'),
    middleware = require('../middleware');

// Root Route
router.get('/', (req, res) => {
    res.render("landing");
});

// AUTH ROUTES

// show register form
router.get('/register', (req, res) => {
    res.render('register');
});

// handle sign up logic
router.post('/register', (req, res) => {
    var newUser = new User({username: req.body.username});

    User.register(newUser, req.body.password, (err, user) => {
        if(err) {
            req.flash('error', err.message);
            return res.redirect('/register');
        } else {
            passport.authenticate('local')(req, res, () => {
                req.flash('success', 'Successfully Registered!');
                res.redirect('/reviews');
            });
        };
    });
});

// show login form
router.get('/login', (req, res) => {
    res.render('login');
});

//  handles login logic
router.post('/login', passport.authenticate('local',
    {
        successRedirect: '/reviews',
        failureRedirect: '/login'
    }), (req, res) => {
    
});

// logout route
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'Logged You Out');
    res.redirect('/reviews');
});

module.exports = router;