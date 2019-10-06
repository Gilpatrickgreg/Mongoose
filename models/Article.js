var mongoose = require("mongoose");

var Schema = mongoose.Schema;
var ArticleSchema = new Schema({

  title: {
    type: String,
    required: false
  },
  
  link: {
    type: String,
    required: false
  },
  summary: {
      type: String,
      required: false
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment"
    }
  ]
  
});

var Article = mongoose.model("Article", ArticleSchema);
module.exports = Article;