/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var ns = {};
module.exports = {
	login : function(req, res){
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
		console.log(req.body);
		sails.sockets.broadcast(ns[req.body.recipientId], 'foo', req.body);
		console.log(ns[req.body.recipientId]);
		res.send(200);
		return;
	}
};
