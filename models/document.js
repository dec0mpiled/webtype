var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Document = new Schema({
    _user: Schema.Types.ObjectId,
    slug: String,
    private: Boolean,
    draft: Boolean,
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
