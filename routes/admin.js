var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var Document = require('../models/document');
var admin = express.Router();
var md5 = require('md5');

admin.get('/updateUsers', ensureAuthentication, function(req, res) {
	if (req.user.admin) {
		Account.find({}, function(err, accounts) {
			if (err) return console.log(err);
			
			for (var i = 0; i < accounts.length; i++) {
				updateAccount(accounts[i]._id);
			}
			
			function updateAccount(id) {
				Account.findOne({ _id: id }, function(err, account) {
					if (err) return console.log(err);
					account.md5 = md5(account.email);
					account.save(function(err) {
						if (err) return console.log(err);
						return console.log('success!');
					});
				});
			}
		});
	}
});

// admin (all accounts and documents)
admin.get('/', ensureAuthentication, function(req, res) {
	if (req.user.admin) {
		Account.find({}, function(err, accounts) {
			if (err) return next(err);
			Document.find({}, function(err, documents) {
				if (err) return next(err);
				res.render('admin/home', { accounts: accounts, documents: documents });
			});
		});
	} else {
		return next(err);
	}
});

// individual user data
admin.get('/user/:id', ensureAuthentication, function(req, res) {
	if (req.user.admin) {
		Account.findOne({ _id: req.params.id }, function(err, account) {
			if (err) return next(err);
			Document.find({ _user: req.params.id }, function(err, documents) {
				if (err) return next(err);
				res.render('admin/user', { account: account, documents: documents });
			});
		});
	} else {
		return next(err);
	}
});

// user data delete
admin.get('/user/:id/delete', ensureAuthentication, function (req, res) {
	if (req.user.admin) {
		Account.findOneAndRemove({ _id: req.params.id }, function(err, account) {
			if (err) return next(err);
			Document.find({ _user: req.params.id }).remove().exec(function(err, data) {
			  if (err) return next(err);
			  console.log(data);
			  res.redirect('/admin');
			});
		});
	} else {
		return next(err);
	}
});

// individual document data
admin.get('/doc/:id', ensureAuthentication, function (req, res) {
	if (req.user.admin) {
		Document.findOne({ _id: req.params.id }, function(err, document) {
			if (err) return next(err);
			Account.findOne({ _id: document._user }, function(err, account) {
				if (err) return next(err);
				res.render('admin/doc', { document: document, account: account });
			});
		});
	} else {
		return next(err);
	}
});

// individual document data delete
admin.get('/doc/:id/delete', ensureAuthentication, function (req, res) {
	if (req.user.admin) {
		Document.findOneAndRemove({ _id: req.params.id }, function(err, document) {
			if (err) return next(err);
			res.redirect('/admin');
		});
	} else {
		return next(err);
	}
});


function ensureAuthentication(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	} else {
		return res.redirect('/login');
	}
}

module.exports = admin;
