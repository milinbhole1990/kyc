var express = require("express");
var bodyParser = require("body-parser");
var session = require("express-session");

var NoSQL = require('nosql');
var db = NoSQL.load('database.nosql');

var app = express();

app.use(express.static("public"));

app.use(session({
    cookie: {
        maxAge: 60 * 1000
    },
    resave: false,
    rolling: true,
    saveUninitialized: true,
    secret: "COOKIE_SECRET"
}));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));

/*app.post("/login", function (req, res, next) {
    console.log("start session"+req.session.id);
    var user = req.body.username;
    var pass = req.body.password;
    if (user === "user" && pass === "pass") {
        req.session.user = "user";
        res.end();
    } else {
        res.status(401).end();
    }
});

app.get("/logout", function (req, res, next) {
    console.log("destroy session"+req.session.id);
    req.session.destroy(function(err) {
        res.end();
    });
});

app.get("/me", function (req, res, next) {
    console.log(req.session.id);
    if (req.session.user) {
        res.send(req.session.user);
    } else {
        res.status(401).end();
    }
});*/

app.post("/dbregister", function (req, res, next) {
    console.log("insert : "+req.body.params.username);
    
    db.find().make(function(builder) {
        builder.where('username', '=', req.body.params.username);
        builder.where('password', '=', req.body.params.password);
        builder.callback(function(err, response) {
            console.log('resonse:', response);
            if(response == ""){
                db.insert({ username: req.body.params.username, password: req.body.params.password}).callback(function(err) {
                     console.log('The user has been created.');
                });
            }
            res.send(response);
        });
    });
});

app.post("/dbupdate", function (req, res, next) {
    console.log("update : "+req.body.params.username);
    
    db.update({ username: req.body.params.username, password: req.body.params.password, ethaddress: req.body.params.ethaddress, category: req.body.params.category, name: req.body.params.name}).make(function(builder) {
        builder.where('username', req.body.params.username);
        builder.where('password', req.body.params.password);
        builder.callback(function(err, response) {
            console.log('updated documents:', response);
            res.send();
        });
    });
});

app.post("/dblogin", function (req, res, next) {
    console.log("select : "+req.body.params.username);

     db.find().make(function(builder) {
        builder.where('username', '=', req.body.params.username);
        builder.where('password', '=', req.body.params.password);
        builder.where('category', '=', req.body.params.category);
        builder.callback(function(err, response) {
            console.log(err);
            console.log(response);
             if(response != ""){
                 res.send(response);
             } else {
                 res.send(err);
             }
        });
     });
});

var server = app.listen(4000, function () {
  console.log("Sample login server running");
});
