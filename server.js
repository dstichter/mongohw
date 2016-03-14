var request = require('request');
var cheerio = require('cheerio');
var express = require('express')
var app = express()
var PORT = 8000
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var expressHandlebars = require('express-handlebars')
app.use(bodyParser.urlencoded({
	extended: false
}));
//Database configuration
mongoose.connect('mongodb://localhost/mongohw');
var db = mongoose.connection;

db.on('error', function(err) {
  console.log('Mongoose Error: ', err);
});
db.once('open', function() {
  console.log('Mongoose connection successful.');
});

app.use(express.static('public'));

app.engine('handlebars', expressHandlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

var Title = require('./public/models/scrappedTitle.js');
var Comment = require('./public/models/comments.js');


app.get('/',function(req,res){
  Title.remove()
  request("https://www.reddit.com", function (error, response, html) {
    var $ = cheerio.load(html);
    var result = [];
      $('p.title').each(function(i, element){
        var title = $(this).text()
        var newTitle = new Title({title: title})
        newTitle.save(function(err, doc) {
          if (err) {
            console.log(err);
          } else {
            //console.log(doc);
          }
        });
      });

  });
  Title.find({})
  .populate('comments')
  .exec(function(err,results){

    var data = {
      data : results[0]
    }
    res.render('index', data)
  })
})



app.post('/submit', function(req, res) {

  var newComment = new Comment(req.body);

//Save the new book
  newComment.save(function(err, dbComment) {
    console.log(dbComment)
    if (err) {
      res.send(err);
    } else {
//Find our library and push the new book id into the Library's books array
//Need "{new: true}" or else it will return the object as it was before it was updated
      Title.findOneAndUpdate({
        _id: req.body.id
      }, {$push: {'comments': dbComment._id}}, {new: true}, function(err, dbComment) {
        console.log(dbComment);
        if (err) {
          res.send(err);
        } else {
          res.redirect('/');
        }
      });

    }
  });

});





















app.listen(PORT, function(){
  console.log('LISTENING ON PORT: %s', PORT);
})
