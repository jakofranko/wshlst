/* Notes on routing:

- Creating a new wishlist happens via the '/new' route 
  (posting returns JSON and thus functions as an api endpoint)
- An Backbone front-end for viewing wishlists is under the '/view/:wishListId' route.
  This front-end interacts with the JSON API detailed below.

JSON API
- Creating list items happens via POST requests to '/:wishListId'
- Viewing, updating and deleting wishlists happen via GET, PUT and DELETE requests to '/:wishListId'
- Viewing, updating and deleting list items happens via GET, PUT, and DELETE requests to'/:wishListId/:itemId'
*/


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

router.get('/new', function(req, res) {
	res.render('wishlist/new', {userId: req.session.userId});
});
router.post('/new', function(req, res) {
	console.log(req.body);
	if(!req.body || !req.body.name)
		res.json({"success": false});
	WishList.create(req.session.userId, req.body.name, function(err, wishlist) {
		if(err) throw new Error(err);
		else
			res.json({"success": wishlist});
	});
});

router.get('/view/:wishListId', function(req, res) {
		WishList.getById(req.params.wishListId, function(err, wishlist) {
			if(err) throw new Error(err);
			else {
				res.render('wishlist/view', {
					wishlist: wishlist,
					isOwner: req.session.userId === wishlist.userId
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
		// TODO: add validation here
		WishList.update(req.params.wishListId, req.body, function(err, wishlist) {
			if(err) throw new Error(err);
			else
				res.json(wishlist);
		});
	})
	.delete(checkUser, function(req, res) {
		WishList.delete(req.params.wishListId, function(err) {
			if(err) throw new Error(err);
			else
				res.json({"success":true});
		});
	})
	.post(checkUser, function(req, res) {
		console.log(req.body);
		// TODO: add validation here
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
	.put(checkUser, function(req, res) {
		// TODO: add validation here
		WishList.updateListItem(req.params.wishListId, req.params.itemId, req.body, function(err, newItem) {
			if(err) throw new Error(err);
			else {

			}
		});
	})
	.delete(checkUser, function(req, res) {
		WishList.removeListItem(req.params.wishListId, req.params.itemId, function(err) {
			if(err) throw new Error(err);
			else res.json({"success": true});
		});
	});

module.exports = router;