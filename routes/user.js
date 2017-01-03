var express = require('express'),
	router = express.Router(),
	User = require('../models/user');

router.route('/new')
	.get(function(req, res) {
		res.render('user/new');
	})
	.post(function(req, res) {
		if(!req.body || !req.body.username || !req.body.password)
			res.json({"success":false});

		var username = req.body.username,
			password = req.body.password;
		User.create(username, password, function(err, newUser) {
			if(err)
				throw new Error(err);
			else {
				req.session.userId = newUser._id;
				req.session.username = newUser.username;
				res.json({
					"success": newUser
				});
			}
		});
	});

module.exports = router;