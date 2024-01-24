var fetch = require('node-fetch')
var action = require('./Action')
global.dcqueue = []
global.hqueue = []
var Command = {
	start: function(message, chat_id){
		action.sendMessage(chat_id, "Hello World!!\nyour text:" + message);
	},
	dccon: dccon
}

function dccon(message, chat_id){
	var getDCcon = require('./getDCcon')
	function complete(){
		action.sendMessage(chat_id, `${dcqueue[0].title} 호출`);
		dcqueue.shift();
	}
	function send(json){
		dcqueue[dcqueue.length] = {"number": message,"title": json.info.title, "images": json.detail, "chat_id": chat_id, "complete": complete};
		action.sendMessage(chat_id, `대기열에 추가되었습니다.[${dcqueue.length}/${dcqueue.length}]`)
		getDCcon.manage();
	}
	getDCcon.getinfo(message, send)
}

module.exports = Command
