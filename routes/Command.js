var fetch = require('node-fetch')
var action = require('./Action')

var Command = {
	start: function(message, chat_id){
		var msg = {'chat_id': chat_id, 'text':'Hello World!!\nyour text:' +  message}
		action.sendMessage(chat_id, "Hello World!!\nyour text: " + message)
	}
}

module.exports = Command
