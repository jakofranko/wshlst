var mongoose = require('mongoose');

var ListItemSchema = new mongoose.Schema({
	title: String,
	link: String
});
var WishListSchema = new mongoose.Schema({
	userId: {
		type: String,
		required: true
	},
	name: {
		type: String,
		required: true
	},
	items: [ListItemSchema]
});

var WishList = mongoose.model('WishList', WishListSchema);

module.exports = {
	create: function(userId, name, callback) {
		var list = new WishList({
			userId: userId,
			name: name
		});
		list.save(function(err, wishlist) {
			if(err) callback(err);
			else callback(err, wishlist);
		});
	},
	delete: function(id, callback) {
		WishList.findOneAndRemove({_id: id}, function(err) {
			callback(err);
		});
	},
	update: function(id, updates, callback) {
		if(updates.items) { // this should be handled by addListItem
			delete updates.items;
		}
		WishList.findOneAndUpdate({_id: id}, updates, {
			new: true,
			runValidators: true
		}, function(err, updatedWishList) {
			callback(err, updatedWishList);
		});
	},
	getById: function(id, callback) {
		WishList.findById(id, function(err, wishlist) {
			callback(err, wishlist);
		});
	},
	getByUserId: function(userId, callback) {
		WishList.find({userId: userId}, function(err, wishlists) {
			callback(err, wishlists);
		});
	},
	addListItem: function(wishListId, title, link, callback) {
		WishList.findById(wishListId, function(err, wishlist) {
			if(err) callback(err);
			else {
				var item = {
					title: title,
					link: link
				};
				wishlist.items.push(item);
				wishlist.save(function(err) {
					callback(err);
				});
			}
		});
	},
	updateListItem: function(wishListId, itemId, updates, callback) {
		WishList.findById(wishListId, function(err, wishlist) {
			if(err) callback(err);
			else {
				for (var i = 0; i < updates.length; i++) {
					wishlist.items.id(itemId)[i] = updates[i];
				}
				wishlist.save(function(err) {
					callback(err, wishlist.items.id(itemId));
				});
			}
		});
	},
	removeListItem: function(wishListId, listItemId, callback) {
		WishList.findById(wishListId, function(err, wishlist) {
			if(err) callback(err);
			else {
				wishlist.items.id(listItemId).remove();
				wishlist.save(function(err) {
					callback(err);
				});
			}
		});
	}
};