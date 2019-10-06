var cheerio = require("cheerio");
var axios = require("axios");
var express = require("express");
var mongoose = require("mongoose");

var db = require("./models");

var PORT = process.env.PORT || 3002;

var app = express();

app.use(express.urlencoded({extended: true }));
app.use(express.json());
app.use(express.static("Public"));

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);


axios.get("https://www.surfline.com/").then(function(response) {

  var $ = cheerio.load(response.data);

  var results = [];

  $(".quiver-feed-card").each(function(i, element) {

    var title = $(element).find(".quiver-feed-card__content").children().text();
    var summary = $(element).find(".quiver-feed-card__content").find(".quiver-feed-card__subtitle").text();
    var link = $(element).find(".quiver-feed-card__content").find(".quiver-feed-card__title").attr("href");

    results.push({
      title: title,
      summary: summary,
      link: link
    });

    db.Article.create({
        title: title,
        summary: summary,
        link: link
      })
      .then(function(result){
          console.log(result)

      })
      .catch(function(err){
          console.log(err)
      })
  });

  app.get("/all", function(req, res) {
    // Find all results from the scrapedData collection in the db
    db.Article.find({}, function(error, found) {
      // Throw any errors to the console
      if (error) {
        console.log(error);
      }
      // If there are no errors, send the data to the browser as json
      else {
        res.json(found);
      }
    });
  });

  app.get("/articles", function(req, res) {
    db.Article.find({})
    .then(function(dbArticle){
        res.json(dbArticle);
    })
    .catch(function(err){
        res.json(err);
    })
});

app.get("/comments", function(req, res) {
  db.Comment.find({})
    .then(function(dbComment) {
      res.json(dbComment);
    })
    .catch(function(err) {
      res.json(err);
    });
});

  app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });
});