var express = require("express");
var app = express();

app.get("/", function (req, res) {
    res.send("hi there!")
});

app.get("/speak/:animal", function (req, res) {
    var a = req.params.animal.toLowerCase();
    var sound = {"pig": "oink", "dog": "wrof", "cow": "moo"};
    res.send("The " + a + " says " + sound[a]);
});

app.get("/repeat/:message/:times", function (req, res) {
   var message = req.params.message;
   var times = req.params.times;
   var result = "";
    for (var i = 0; i < times; i++) {
        result += message + " ";
    }
   res.send(result);
});

app.get("/*", function (req, res) {
   res.send("not found!")
});


app.listen(3000, function () {
    console.log("Server running on port 3000!")
});