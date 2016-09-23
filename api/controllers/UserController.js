/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

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
		console.log(userId);
		UserFriend.find({
											'where' :
												{
													or :
														[
															{
																user_1 : userId
															},
															{
																user_2 : userId
															}
														],
														is_blocked : false,
														is_friend : 2
													}
											}).exec(function(err, users){
												console.log(err);
												console.log(users);
											});
	}
};
