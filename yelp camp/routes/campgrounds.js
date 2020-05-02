var express = require("express"),
    router  = express.Router(),
    Campground = require("../models/campground"),
    middleware = require("../middleware");

// show all campgrounds
router.get("/", function (req, res) {
    Campground.find({}, function (err, campGrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {campGrounds: campGrounds});
        }
    });
});

// show new campground form
router.get("/new", middleware.isLoggedIn, function (req, res) {
    res.render("campgrounds/new");
});

// add new campgrounds to DB
router.post("/", middleware.isLoggedIn, function (req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var price = req.body.price;
    var description = req.body.description;
    var author = {id: req.user._id, username: req.user.username};
    var newCampGround = {name: name, image: image, description: description, author: author, price: price};
    Campground.create(newCampGround, function (err, newCamp) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });
});

// show detail info about one campground
router.get("/:id", function (req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundcamp) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/show", {campGround: foundcamp});
        }
    });
});

// edit campgrounds
router.get("/:id/edit", middleware.checkCampOwnership, function (req, res) {
    Campground.findById(req.params.id, function (err, foundCamp) {
        res.render("campgrounds/edit", {campground: foundCamp});
    });
});

// update campgrounds
router.put("/:id", middleware.checkCampOwnership, function (req, res) {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, updatedCamp) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// destroy campgrounds
router.delete("/:id", middleware.checkCampOwnership, function (req, res) {
    Campground.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});

module.exports= router;