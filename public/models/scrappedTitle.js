var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TitleScrape = new Schema({
  title: {
    type:String
  },
  comments: [{
      type: Schema.Types.ObjectId,
      ref: 'Comment'
  }]
});

var Title = mongoose.model('Title', TitleScrape);
module.exports = Title;
