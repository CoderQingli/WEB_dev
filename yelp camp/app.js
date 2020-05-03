var express               = require("express"),
    app                   = express(),
    bodyParser            = require("body-parser"),
    Campground            = require("./models/campground"),
    Comment               = require("./models/comment"),
    mongoose              = require("mongoose"),
    passport              = require("passport"),
    localStrategy         = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    User                  = require("./models/user"),
    expressSession        = require("express-session"),
    methodOverride        = require("method-override"),
    flash                 = require("connect-flash"),
    seedDB                = require("./seeds");

// requiring routes
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes       = require("./routes/index");

var url = process.env.DATABASE_KEY || "mongodb://localhost/yelp_camp";
mongoose.connect(url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("connected to DB!");
}).catch(err => {
    console.log("Error: ", err.message);
});

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// seedDB();

// passport config
app.use(expressSession({
    secret: "abc abc abc abc",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campGrounds/:id/comments", commentRoutes);

app.listen(process.env.PORT || 3000, function () {
    console.log("Server running!");
});