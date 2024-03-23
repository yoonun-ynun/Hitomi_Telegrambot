var express = require("express");
var router = express.Router();
var command = require("./Command");

router.post("/", (req, res) => { 
	var msg_info = req.body;
	console.log(msg_info)
	var message;
	if(msg_info.callback_query){
		var callback = msg_info.callback_query;
		var chat_id = callback.message.chat.id;
		var message_id = callback.message.message_id;
		var data = JSON.parse(callback.data);


		if(data.Command == "view"){
			command.viewer(data.key, chat_id);
		}else if(data.Command == "tags"){
			command.tags(data.key, chat_id);
		}else if(data.Command == "info"){
			command.hitomi(data.key, chat_id);
		}else if(data.Command == "view_next"){
			command.view_next(data.key, data.page, chat_id, message_id, true);
		}else if(data.Command == "view_prev"){
			command.view_next(data.key, data.page, chat_id, message_id, false);
		}else if(data.Command == "download"){
			command.download(data.key, chat_id);
		}
	}
	if(msg_info.message){
		message = msg_info.message.text;
		console.log(message);
	
		var chat_id = msg_info.message.chat.id;
		if(msg_info.message.entities){
			if(msg_info.message.entities[0].type == "bot_command"){
				var cmd = message.split(' ')[0];
				var msg = message.substring(cmd.length + 1);
				if(cmd == '/start'){
					command.start(msg, chat_id);   
				}
				if(cmd == '/dccon'){
					command.dccon(msg, chat_id);
				}
				if(cmd == '/hitomi'){
					command.hitomi(msg, chat_id);
				}
				if(cmd == '/view'){
					command.viewer(msg, chat_id);
				}
				if(cmd == '/tag'){
					command.tags(msg, chat_id);
				}
				if(cmd == '/download'){
					command.download(msg, chat_id);
				}
			}
		}	 
	}
	res.json(200,{ok:true});
	
});

module.exports = router;
