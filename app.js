const bodyParser  = require('body-parser'),
      express     = require('express'),
      mongoose    = require('mongoose'),
      flash       = require('connect-flash'),
      passport    = require('passport'),
      LocalStrategy = require('passport-local'),
      Review      = require('./models/review'),
      Comment     = require('./models/comment'),
      User        = require('./models/user'),
      methodOverride = require('method-override');

// requiring routes
var commentRoutes = require('./routes/comments'),
    reviewRoutes  = require('./routes/reviews'),
    indexRoutes   = require('./routes/index');

const app = express();

// Body Parser Middleware
app.use(bodyParser.urlencoded({extended: true}));

// Mongoose Connect
mongoose.connect("mongodb://localhost/ck-reviews");

// Set view engine and public directory
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));

// Method Override
app.use(methodOverride('_method'));

// Connect Flash
app.use(flash());

// PASSPORT CONFIGURATON
app.use(require('express-session')({
    secret: "Poopycat",
    resave: false,
    saveUninitialized: false
}));
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

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
});
