const bodyParser  = require('body-parser'),
      express     = require('express'),
      mongoose    = require('mongoose'),
      Review      = require('./models/review'),
      Comment     = require('./models/comment');


const app = express();

// Body Parser Middleware
app.use(bodyParser.urlencoded({extended: true}));

// Mongoose Connect
mongoose.connect("mongodb://localhost/ck-reviews");

app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));

app.get('/', (req, res) => {
    res.render("landing");
});

app.get('/reviews', (req, res) => {
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

app.get('/reviews/new', (req, res) => {
    res.render("reviews/new");
});

app.post('/reviews', (req, res) => {
    let newReview = {
        imdbID: req.body.imdbID,
        title: req.body.title,
        posterURL: req.body.posterURL,
        reviewText: req.body.reviewText, 
        rating: req.body.rating
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
app.get('/reviews/:id', (req, res) => {
    Review.findById(req.params.id).populate('comments').exec((err, foundReview) => {
        if (err) {
            console.log(err);
        } else {
            res.render('reviews/show', {review: foundReview});
        }
    });
});

// COMMENTS ROUTES

app.get('/reviews/:id/comments/new', (req, res) => {
    Review.findById(req.params.id, (err, foundReview) => {
        if (err) {
            console.log(err);
        } else {
            res.render('comments/new', {review: foundReview});
        }
    })
    
});

app.post('/reviews/:id/comments', (req, res) => {
    Review.findById(req.params.id, (err, foundReview) => {
        if (err) {
            console.log(err);
            res.redirect("/reviews");
        } else {
            Comment.create(req.body.comment, (err, newlyCreated) => {
                if (err) {
                    console.log(err);
                } else {
                    foundReview.comments.push(newlyCreated);
                    foundReview.save();
                    res.redirect('/reviews/' + req.params.id);
                }
            });
        }
    });
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
});
