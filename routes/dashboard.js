var express = require('express'),
	router = express.Router(),
	WishList = require('../models/wishlist');

function checkSession(req, res, next) {
	if(!req.session || !req.session.userId)
		res.redirect('/');
	else
		next();
}

router.get('/', checkSession, function(req, res) {
	WishList.getByUserId(req.session.userId, function(err, wishlists) {
		if(err) throw new Error(err);
		else {
			res.render('dashboard/index', {
				username: req.session.username,
				wishlists: wishlists
			});	
		}
	});
});

module.exports = router;