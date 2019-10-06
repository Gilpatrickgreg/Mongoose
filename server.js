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

  app.get("/articles", function(req, res) {
      db.Article.find({})
      .then(function(dbArticle){
          res.json(dbArticle);
      })
      .catch(function(err){
          res.json(err);
      })
  })

 
  console.log(results);
});