/**
 * UserFriendController
 *
 * @description :: Server-side logic for managing Userfriends
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	create : function(req, res) {
		if(req.session.userId === undefined)
			return res.forbidden();
		req.body.user_1 = req.session.userId;
		switch(req.body.action) {
			case 'add-friend' : this.addFriend(req.body, res);
													break;
			case 'block-friend' : this.blockFriend(req.body, res);
														break;
			case 'unblock-friend' : this.unblockFriend(req.body, res);
															break;
			case 'cancel-request' : this.cancelRequest(req.body, res);
															break;
			case 'accept-request' : this.acceptRequest(req.body, res);
															break;
			case 'unfriend' : this.unfriend(req.body, res);
												break;
		}
	},

	addFriend : function(data, res) {
		UserFriend.findOne({
				'where' : {or : [{user_1 : data.user_1, user_2 : data.user_2}, {user_1 : data.user_2, user_2 : data.user_1}]}
			}).exec(function(err, user_friend){
				if(user_friend !== undefined) {
					if(user_friend.blocker_id === data.user_1)
						return res.json({'status' : 0, 'message' : 'Please unblock the user first.'})
					else if (user_friend.blocker_id === data.user_1)
						return res.json({'status' : 0, 'message' : 'Something went wrong.'})
					else if(data.user_2 === user_friend.user_1 && user_friend.is_friend === 1) {
						return res.json({'status' : 0, 'message' : 'Other person has already sent you a request.'})
					}
					else if (data.user_1 === user_friend.user_1 && user_friend.is_friend === 1) {
						return res.json({'status' : 0, 'message' : 'You have already sent a request to this person.'})
					}
					else if(user_friend.is_friend === 2) {
						return res.json({'status' : 0, 'message' : 'You two are already friends.'})
					}
					else {
						UserFriend.update({
							'id' : user_friend.id
						}, {
							'user_1' : data.user_1,
							'user_2' : data.user_2,
							'is_friend' : 1,
							'is_blocked' : false,
							'blocker_id' : 0
						}).exec(function(err, user_friend) {
							return res.json({"status" : 1});
						});
					}

				}
				else {
					UserFriend.create({
						'user_1' : data.user_1,
						'user_2' : data.user_2,
						'is_friend' : 1,
						'is_blocked' : false,
						'blocker_id' : 0
					}).exec(function(err, user_friend) {
						return res.json({"status" : 1});
					});
				}
			});
	},

	blockFriend : function(data, res){
			UserFriend.findOne({
					'where' : {or : [{user_1 : data.user_1, user_2 : data.user_2}, {user_1 : data.user_2, user_2 : data.user_1}]}
				}).exec(function(err, user_friend){
					if(err)
						return;
					if(user_friend !== undefined) {
						if(user_friend.blocker_id === data.user_2) {
							return res.json({"status" : 0, "message" : "Something went wrong."})
						}
						UserFriend.update({'id' : user_friend.id}, {
							'user_1' : data.user_1,
							'user_2' : data.user_2,
							'is_friend' : 0,
							'is_blocked' : true,
							'blocker_id' : data.user_1
						}).exec(function(err, result){
							//successfully blocked user
							return res.json({'status' : 1});
						});
					}
					else{
						UserFriend.create({
							'user_1' : data.user_1,
							'user_2' : data.user_2,
							'is_friend' : 0,
							'is_blocked' : true,
							'blocker_id' : data.user_1
						}).exec(function(err, user_friend) {
							return res.json({"status" : 1});
						});
					}
				});
	},

	unblockFriend : function(data, res) {
		UserFriend.findOne({
				'where' : {or : [{user_1 : data.user_1, user_2 : data.user_2}, {user_1 : data.user_2, user_2 : data.user_1}]}
			}).exec(function(err, user_friend){
				if(err)
					return res.json({"status" : 0, "message" : "Something went wrong."})
				if(user_friend !== undefined) {
					if(user_friend.blocker_id === 0) {
						return res.json({"status" : 0, "message" : "The user is not blocked."})
					}
					else if (user_friend.blocker_id === data.user_2) {
						return res.json({"status" : 0, "message" : "Something went wrong."})
					}
					else {
						UserFriend.update({'id' : user_friend.id}, {
							'user_1' : data.user_1,
							'user_2' : data.user_2,
							'is_friend' : 0,
							'is_blocked' : false,
							'blocker_id' : 0
						}).exec(function(err, result){
							//successfully blocked user
							return res.json({'status' : 1});
						});
					}
				}
				else {
					UserFriend.create({
						'user_1' : data.user_1,
						'user_2' : data.user_2,
						'is_friend' : 0,
						'is_blocked' : false,
						'blocker_id' : 0
					}).exec(function(err, result){
						//successfully blocked user
						return res.json({'status' : 1});
					});
				}
			});
	},

	cancelRequest : function(data, res) {
		UserFriend.findOne({
				'where' : {or : [{user_1 : data.user_1, user_2 : data.user_2}, {user_1 : data.user_2, user_2 : data.user_1}]}
			}).exec(function(err, user_friend){
				if(err)
					return res.json({'status' : 0, 'message' : 'Something went wrong.'});
				if(user_friend !== undefined) {
					if(user_friend.is_friend === 1) {
						UserFriend.update({'id' : user_friend.id}, {
								'is_friend' : 0
							}).exec(function(err, result){
								if(err) {
									return res.json({'status' : 0, 'message' : 'Something went wrong.'});
								}
								return res.json({'status' : 1});
							});
					}
				}
				else {
					UserFriend.create({
						'user_1' : data.user_1,
						'user_2' : data.user_2,
						'is_friend' : 0,
						'is_blocked' : false,
						'blocker_id' : 0
					}).exec(function(err, result){
						//successfully blocked user
						return res.json({'status' : 1});
					});
				}
			});
	},

	acceptRequest : function(data, res) {
		UserFriend.findOne({
				'where' : {'user_1' : data.user_2, 'user_2' : data.user_1, 'is_friend' : 1, 'is_blocked' : false, 'blocker_id' : 0 }
			}).exec(function(err, user_friend){
				if(err) {
					return res.json({'status' : 0, 'message' : 'Something went wrong.'})
				}
				if(user_friend !== undefined) {
					UserFriend.update({'id' : user_friend.id}, {
						'is_friend' : 2
					}).exec(function(err, result){
						if(err) {
							return res.json({'status' : 0, 'message' : 'Something went wrong.'})
						}
						return res.json({'status' : 1})
					});
				}
			});
	},

	unfriend : function(data, res) {
		UserFriend.findOne({
				'where' : {or : [{user_1 : data.user_1, user_2 : data.user_2}, {user_1 : data.user_2, user_2 : data.user_1}]}
			}).exec(function(err, user_friend){
				if(err) {
					return res.json({'status' : 0, 'message' : 'Someting went wrong'});
				}
				if(user_friend !== undefined) {
					UserFriend.update({'id' : user_friend.id}, {
						'is_friend' : 0
					}).exec(function(err, result){
						if(err) {
							return res.json({'status' : 0, 'message' : 'Something went wrong'});
						}
						return res.json({'status' : 1});
					});
				}
			});
	}

};
