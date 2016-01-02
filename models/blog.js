var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Blog = new Schema({
    user: Schema.Types.Mixed,
    slug: String,
    title: String,
    date: {
        created: Date,
        edited: Date
    }
});

module.exports = mongoose.model('blogs', Blog);
