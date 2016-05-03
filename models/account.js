var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
var findOrCreate = require('mongoose-findorcreate');

var Account = new Schema({
    email: String,
    name: String,
    username: String,
    password: String,
    level: String
});

Account.plugin(passportLocalMongoose);
Account.plugin(findOrCreate);

module.exports = mongoose.model('accounts', Account);
