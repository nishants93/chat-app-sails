# chat-app

a [Sails](http://sailsjs.org) application

# To run the application,

-> First of all install all dependencies,
	
	* Install npm (for Debian linux, apt-get install npm)

	* Install Nodejs (for Debian linux)

		* curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
		* sudo apt-get install -y nodejs

	* Install Sailsjs (npm install sails -g)

	* Run npm install in the project directory (npm install)

	* Run "npm install sails-mysql --save" if sails mysql is not installed during "npm install"

-> Then change the database configurations in config/connections.js

-> Then when in the project directory write "sails lift" in the command line to start running the project

-> Then go to "localhost:1337/user/register" to register user

-> Then go to "localhost:1337/user/login" to login

-> after logging in search for a user in the textbox at the top using the other users email id

-> after sending friend request the other user will have to search your name in the same textbox to accept the 			request

-> then click on the friends name on the right to start chatting.

