var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Blog = new Schema({
    user: Schema.Types.Mixed,
    slug: { type: String, trim: true, index: true, unique: true, sparse: true },
    title: { type: String, trim: true, index: true, unique: true, sparse: true },
    post: [Schema.Types.ObjectId],
    date: {
        created: Date,
        edited: Date
    }
});

module.exports = mongoose.model('blogs', Blog);
