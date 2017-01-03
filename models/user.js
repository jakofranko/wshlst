var mongoose = require('mongoose'),
	bcrypt = require('bcrypt-nodejs');

var UserSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	email: {
		type: String
	}
});

var User = mongoose.model('User', UserSchema);

module.exports = {
	authenticate: function(username, password, callback) {
		console.log(username, password);
		User.findOne({ username: username }, function(err, user) {
			console.log(err, user);
			if(err)
				throw new Error(err);
			else if(user && bcrypt.compareSync(password, user.password))
				callback(err, user);
			else
				callback(err, false);
		});
	},
	findOne: function(query, callback) {
		User.findOne(query, function(err, results) {
			if(err) callback(err);
			else callback(err, results);
		});
	},
	create: function(username, password, callback) {
		var user = new User({ username: username, password: bcrypt.hashSync(password) });
		user.save(function(err, user) {
			if(err)
				callback(err);
			else
				callback(err, user);
		});
	}
};