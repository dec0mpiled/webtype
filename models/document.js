var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Document = new Schema({
    _user: Schema.Types.ObjectId,
    _origin_id: Schema.Types.ObjectId,
    slug: String,
    draft: Boolean,
    archive: Boolean,
    license: {
        url: String,
        type: String
    },
    content: {
        words: Number,
        title: String,
        data: {
          raw: String,
          html: String
        },
        published: {
            title: String,
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
