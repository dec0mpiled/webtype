var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var List = new Schema({
    user: Schema.Types.Mixed,
    slug: String,
    title: String,
    item: [
      {
        content: String,
        date: {
          created: Date,
          edited: Date
        }
      }
    ],
    date: {
        created: Date,
        edited: Date
    }
});

module.exports = mongoose.model('lists', List);
