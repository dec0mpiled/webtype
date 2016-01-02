var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Document = new Schema({
    user: Schema.Types.Mixed,
    slug: String,
    blog: Schema.Types.Mixed,
    content: {
        title: String,
        data: {
          raw: String,
          html: String
        }
    },
    date: {
        created: Date,
        edited: Date
    }
});

module.exports = mongoose.model('documents', Document);
