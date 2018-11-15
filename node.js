const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

const MongoClient = require('mongodb').MongoClient;


// Connect to the db
MongoClient.connect("mongodb://omega.unasec.info", function (err, client) {
   
  console.log("connected")
 
     if(err) throw err;

//UPDATE
app.put('reviews/:reviewid', (req, res) => {
  var dbo = db.db("amazon");
  amazon.reviews.update({_id : ObjectId("5bd0dcffe25a5350c21ff517")},{"verified_purchase" : "Y"})(function(err, result) {
    if (err) throw err;
    console.log(result);
    

     res.send("Review Updated");
    });
});


//ADD A REVIEW
app.post('/reviews/:reviewid', (req, res) => {
    amazon.reviews.insert({
        "_id" : ObjectId("5bd0dcffe25a5350c21ff713"),
        "day" : 30,
        "marketplace" : "US",
        "customer_id" : "12201275",
        "vine" : "N",
        "verified_purchase" : "Y",
        "review" : {
                "id" : "R666TUDCXPP4HZ",
                "headline" : "Comfortable",
                "body" : "These shoes fits great and feels so soft. The fit is firm and does an excellent job.",
                "star_rating" : 4,
                "date" : ISODate("2015-08-30T00:00:00Z")
        },
        "product" : {
                "id" : "B0140UFIKJ",
                "parent" : "555753777",
                "title" : "Men's Boots",
                "category" : "Apparel"
        },
        "votes" : {
                "helpful_votes" : 4,
                "total_votes" : 4
        }
 })(function(err, result) {
    if (err) throw err;
    console.log(result);
    
    
    res.send();
})
});


//GET A REVIEW
app.get('/reviews/:reviewid/', (req, res) => {
    var dbo = db.db("amazon");
  dbo.reviews.find({ }.pretty().limit(1))(function(err, result) {
    if (err) throw err;
    console.log(result);
    
    res.send(result);
})
});

//GET A REVIEW BY STARS
app.get('/reviews/:n/:stars', (req, res) => {

  amazon.reviews.find({review: {star_rating: 5} }.pretty().limit(1)).toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
    
    res.send(result);
})
});

//GET A RANDOM REVIEW BY DATE
app.get('/reviews/:n/:from_date/:to_date', (req, res) => {
    amazon.reviews.find({review: {date : ISODate("2015-08-30T00:00:00Z")} }).limit(1).skip(333).next()(function(err, result) {
    if (err) throw err;
    console.log(result);
    res.send(result);
})
});


   
    
//DELETE A REVIEW    
app.delete('/reviews/:reviewid', (req, res) => {
    amazon.reviews.deleteOne( {} ).limit(1).skip(1234).next()(function(err, result) {
    if (err) throw err;
    console.log(result);
    res.send(result);

    
    res.send("Review Deleted");
})
});

//AVG OF REVIEW STARS OVER TIME
app.get('/review/:from/:to', (req, res) => {
     var dbo = db.db("amazon");
  dbo.collection("reviews").aggregate(  { 
        $unwind : "$review"}, {$group: { _id: $_id, AvgStar: { $avg: $review.star_rating } }} ).toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
    db.close();
  })
});

//AVG OF HELPFUL VOTES BY PRODUCT
app.get('/review/helpful/:prodid', (req, res) => {
     var dbo = db.db("amazon");
  dbo.collection("reviews").aggregate(  { 
        $unwind : "$votes"}, {$group: { _id: $_id, AvgVote: { $avg: $votes.helpful_votes } }} ).toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
    db.close();
  })
});

//AVG REVIEW INFO FOR CUSTOMER BY CATEGORY
app.get('/review/info/:custid', (req, res) => {
     var dbo = db.db("amazon");
  dbo.collection("reviews").aggregate(  { 
        $unwind : "$product"}, {$group: { _id: $_id, AvgCategory: { $avg: $product.category } }} ).toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
    db.close();
  })
});

//PORT
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}...`))


});
