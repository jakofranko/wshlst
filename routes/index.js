var express = require('express'),
	router = express.Router(),
	User = require('../models/user');

router.get('/', function(req, res) {
	res.render('index/index');
});

router.post('/', function(req, res) {
	console.log(req.body);
	User.authenticate(req.body.username, req.body.password, function(err, user) {
		console.log(err, user);
		if(err)
			throw new Error(err);

		if(user !== false) {
			req.session.userId = user._id;
			req.session.username = user.username;
		}

		console.log(req.session);

		res.json({
			"success": user
		});
	});
});

module.exports = router;