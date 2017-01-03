var express = require('express'),
	router = express.Router(),
	WishList = require('../models/wishlist');

function checkUser(req, res, next) {
	var body = req.body.wishListId;
	var param = req.params.wishListId;
	var wishListId = body || param;
	if(wishListId) {
		WishList.getById(wishListId, function(err, wishlist) {
			if(err)
				throw new Error(err);
			else if(wishlist.userId != req.session.userId)
				res.redirect('/');
			else
				next();
		});
	} else {
		next(); // redirect instead somewhere?
	}
}

router.get('/view/:wishListId', function(req, res) {
		WishList.getById(req.params.wishListId, function(err, wishlist) {
			if(err) throw new Error(err);
			else {
				res.render('wishlist/view', {
					wishlist: wishlist
				});
			}
		});
	});

router.route('/:wishListId')
	.get(function(req, res) {
		WishList.getById(req.params.wishListId, function(err, wishlist) {
			if(err) throw new Error(err);
			else
				res.json(wishlist);
		});
	})
	.put(checkUser, function(req, res) {
		console.log(req.body);
		WishList.update(req.params.wishListId, req.body, function(err, wishlist) {
			if(err) throw new Error(err);
			else
				res.json(wishlist);
		});
	})
	.post(function(req, res) {
		console.log(req.body);
		WishList.addListItem(req.params.wishListId, req.body, function(err, newListItem) {
			if(err) throw new Error(err);
			else
				res.json(newListItem);
		});
	});

router.route('/:wishListId/:itemId')
	.get(function(req, res) {
		WishList.getListItem(req.params.itemId, function(err, item) {
			if(err) throw new Error(err);
			else {
				res.json(item);
			}
		});
	})
	.put(function(req, res) {
		WishList.updateListItem(req.params.wishListId, req.params.itemId, req.body, function(err, newItem) {
			if(err) throw new Error(err);
			else {

			}
		});
	})
	.delete(function(req, res) {
		WishList.removeListItem(req.params.wishListId, req.params.itemId, function(err) {
			if(err) throw new Error(err);
			else res.json({"success": true});
		})
	});

router.get('/new', function(req, res) {
	res.render('wishlist/new', {userId: req.session.userId});
});
router.post('/new', function(req, res) {
	if(!req.body.name)
		res.json({"success": false});
	WishList.create(req.session.userId, req.body.name, function(err, wishlist) {
		if(err) throw new Error(err);
		else
			res.json({"success": wishlist});
	});
});

module.exports = router;