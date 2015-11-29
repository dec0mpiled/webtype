var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var List = new Schema({
    user: Schema.Types.Mixed,
    slug: String,
    item: [
      content: String,
      hash: 
      date: {
        created: Date,
        edited: Date
      }
    ],
    date: {
        created: Date,
        edited: Date
    }
});

module.exports = mongoose.model('lists', List);
