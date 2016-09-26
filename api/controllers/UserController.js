/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var ns = {};
module.exports = {
	register : function(req, res) {
		if(req.session.userId !== undefined) {
			return res.redirect('/user/home');
		}
		return res.view('user/register');
	},

	getHomeView : function(req, res) {
		if(req.session.userId !== undefined) {
			return res.view('user/home');
		}
		return res.redirect('/user/login');
	},

	getLoginView : function(req, res) {
		if(req.session.userId !== undefined) {
			return res.redirect('/user/home');
		}
		return res.view('user/login');
	},

	login : function(req, res){
		if(req.session.userId !== undefined) {
			return res.redirect('/user/home');
		}
		var data = req.body;
		var email = data.tbEmailLogin;
		var password = data.tbPasswordLogin;
		User.findOne({'where' : {'email' : email}}).exec(function(err, user){
			if(err) {
				res.serverError(err);
			}
			if(user === undefined) {
				//User doesn't exist
				res.redirect('back');
				return;
			}
			if(user.encryptedPassword !== password){
				//Wrong Password
				res.redirect('back');
				return;
			}
			req.session.userId = user.id;
			req.session.userName = user.name;
			res.redirect('/user/home');
			return;
		});
	},

	getFriends : function(req, res) {
		if(req.session.userId === undefined) {
			return res.redirect('user/login');
		}
		var userId = req.session.userId;
		UserFriend.find({'where' :{or :[{user_1 : userId},{user_2 : userId}],is_blocked : false,is_friend : 2}}).exec(function(err, f){
			var data = {}
			if(err) {
				data.status = 0;
				data.message = "Something went wrong!";
				res.json(data);
				return;
			}
			friends = []
			for(var i=0; i<f.length; i++) {
				uid = 0;
				if(f[i].user_1 == userId)
					uid = f[i].user_2;
				else
					uid = f[i].user_1;
				User.findOne({'where' : {id : uid}}).exec(function(error, friend){
					var temp = {};
					temp.userId = friend.id;
					temp.name = friend.name;
					friends.push(temp);
					if(friends.length == f.length) {
						data.status = 1;
						data.content = JSON.stringify(friends);
						res.json(data);
						return;
					}
				});
			}
		});
	},

	registerSocket: function(req, res) {
		var socketid = sails.sockets.getId(req);
		ns[req.session.userId] = socketid;
		console.log(ns);
	},

	sendMessage : function(req, res) {
		Message.create({'reciever_id' : req.body.recipientId, 'sender_id' : req.session.userId, 'content' : req.body.message}, function(error, res){
			if(error) {
				console.log(error);
				return;
			}
			sails.sockets.broadcast(ns[req.body.recipientId], req.body);
			return;

		});
	},

	search : function(req, res) {
		if(req.session.userId === undefined) {
			return res.forbidden(403);
		}
		var userOneId = req.session.userId;
		var data = req.body;
		var email = data.emailId;
		User.findOne({'where' : {email : email}}).exec(function(err, user) {
			if(err) {
				console.log(err);
				return;
			}
			var userTwoId = user.id;
			UserFriend.findOne({
					'where' : {or : [{'user_1' : userOneId, 'user_2' : userTwoId}, {'user_1' : userTwoId, 'user_2' : userOneId}]}
				}).exec(function(err, friendStatus){
					if(err) {
						console.log(err);
						return;
					}
					var responseData = {};
					if(friendStatus !== undefined){
						if(friendStatus.is_blocked === true && friendStatus.blocker_id === user.id) {
							return res.json({'reqStatus' : 0});
						}
						console.log(friendStatus);
						responseData.name = user.name;
						responseData.email = user.email;
						responseData.id = user.id;
						if(friendStatus.is_blocked === false && friendStatus.is_friend == 0) {
							responseData.status = 0;
						}
						else if(friendStatus.is_blocked === true && friendStatus.blocker_id === userOneId) {
							responseData.status = 1;  //client side status for blocked
						}
						else if(friendStatus.is_friend === 1 && friendStatus.user_1 === userOneId) {
							responseData.status = 2;  //client side status if current user has sent friend request
						}
						else if (friendStatus.is_friend === 1 && friendStatus.user_1 === userTwoId) {
							responseData.status = 3;  //user has to accept the request
						}
						else {
							responseData.status = 4; //both users are friends
						}
						responseData.reqStatus = 1;
						res.json(responseData);
						return;
					}
					else{
						responseData.reqStatus = 1;
						responseData.name = user.name;
						responseData.email = user.email;
						responseData.id = user.id;
						responseData.status = 0;
						res.json(responseData);
						return;
					}
				});
		});
	}


};
