var express               = require("express"),
    app                   = express(),
    bodyParser            = require("body-parser"),
    mongoose              = require("mongoose"),
    passport              = require("passport"),
    localStrategy         = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    User                  = require("./models/user"),
    expressSession        = require("express-session");

app.set("view engine", "ejs");
mongoose.connect("mongodb://localhost/auth");
app.use(bodyParser.urlencoded({extended: true}));

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

app.get("/", function (req, res) {
    res.render("home");
});

app.get("/secret", isLogedIn, function (req, res) {
    res.render("secret");
});

app.get("/register", function (req, res) {
    res.render("register");
});

app.post("/register", function (req, res) {
    User.register(new User({username: req.body.username}), req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            return res.render("/register");
        }
        passport.authenticate("local")(req, res, function () {
            res.redirect("/secret");
        })
    })
});

app.get("/login", function (req, res) {
    res.render("login");
});

app.post("/login", passport.authenticate("local", {
    successRedirect: "/secret",
    failureRedirect: "/login"
}), function (req, res) {

});

app.get("/logout", function (req, res) {
   req.logout();
   res.redirect("/");
});

function isLogedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

app.listen(3000, function () {
    console.log("Server running on port 3000!")
});