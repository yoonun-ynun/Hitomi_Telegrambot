var fetch = require('node-fetch')
var action = require('./Action')

var Command = {
	start: function(message, chat_id){
		action.sendMessage(chat_id, "Hello World!!\nyour text:" + message);
	},
	dccon: dccon
}

function dccon(message, chat_id){
	action.sendMessage(chat_id, "dccon_Command");
}

module.exports = Command
