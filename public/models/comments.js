var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Comments = new Schema({
  comment: {
    type:String
  }
});

var Comment = mongoose.model('Comment', Comments);
module.exports = Comment;
