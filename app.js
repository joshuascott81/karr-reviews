const bodyParser = require('body-parser'),
  express = require('express'),
  mongoose = require('mongoose'),
  flash = require('connect-flash'),
  passport = require('passport'),
  LocalStrategy = require('passport-local'),
  Review = require('./models/review'),
  Comment = require('./models/comment'),
  User = require('./models/user'),
  methodOverride = require('method-override');

// requiring routes
var commentRoutes = require('./routes/comments'),
  reviewRoutes = require('./routes/reviews'),
  indexRoutes = require('./routes/index'),
  domRoutes = require('./routes/dom');

const app = express();

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Mongoose Connect
mongoose.connect('mongodb://localhost/ck-reviews');

// Set view engine and public directory
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

// Method Override
app.use(methodOverride('_method'));

// Connect Flash
app.use(flash());

// PASSPORT CONFIGURATON
app.use(
  require('express-session')({
    secret: 'Poopycat',
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware to include user in all routes
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

// Connect Route Files
app.use(indexRoutes);
app.use('/reviews/:id/comments', commentRoutes);
app.use('/reviews', reviewRoutes);
app.use('/dom', domRoutes);

var querystring = require('querystring');

app.get('/getReview', (req, res) => {
  var query = querystring.parse(req._parsedUrl.query)['reviewSearchOption'];
  var queryLimit = parseInt(
    querystring.parse(req._parsedUrl.query)['reviewSearchLimit']
  );
  var reviewsArray = [];
  var reviewFind = {};
  var reviewOrder = 1;

  if (query == 'sort-oldest') {
    reviewOrder = 1;
  } else {
    reviewOrder = -1;
  }

  // if (query == 'featured-review') {
  //     reviewFind = {date: 1};
  // };

  Review.find(reviewFind)
    .sort({ date: reviewOrder })
    .limit(queryLimit)
    .exec((err, reviews) => {
      if (err) {
        console.log(err);
      } else {
        if (query == 'az') {
          for (var movie in reviews) {
            reviewsArray.push(reviews[movie]);
          }

          reviewsArray.sort((a, b) => {
            var titleA = JSON.parse(a.omdbInfo).Title.toUpperCase();
            var titleB = JSON.parse(b.omdbInfo).Title.toUpperCase();

            if (titleA < titleB) {
              return -1;
            }
            if (titleA > titleB) {
              return 1;
            }

            return 0;
          });
          reviews = reviewsArray;
        } else if (query == 'za') {
          for (var movie in reviews) {
            reviewsArray.push(reviews[movie]);
          }

          reviewsArray.sort((a, b) => {
            var titleA = JSON.parse(a.omdbInfo).Title.toUpperCase();
            var titleB = JSON.parse(b.omdbInfo).Title.toUpperCase();

            if (titleA < titleB) {
              return 1;
            }
            if (titleA > titleB) {
              return -1;
            }

            return 0;
          });
          reviews = reviewsArray;
        } else if (query == 'featured-review') {
          reviews = reviews[0];
        }
        res.send(reviews);
      }
    });
});

// OMDB API
let key = '6d82971b';
let omdb = 'http://www.omdbapi.com/?apikey=' + key + '&i=';

app.get('/movie-details', (req, res) => {
  var searchID = querystring.parse(req._parsedUrl.query);
  //console.log(omdb + searchID.imdbID);

  res.send(omdb + searchID.imdbID);
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
