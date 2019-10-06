$(document).ready(function() {
    var articleContainer = $(".article-container");
    $(".scrape-new").click(function() {
        articleContainer.empty();

    $.get("/scrape").then(function(result) {
        }); 
    });

    $(".clear").click(function() {
        articleContainer.empty();
    });
});