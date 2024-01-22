var express = require("express");
var router = express.Router();
var command = require("./Command");

router.post("/", (req, res) => {
	var msg_info = req.body;
	console.log(msg_info)
	var message;
	if(msg_info.message){
		message = msg_info.message.text;
		console.log(message);
	
		var chat_id = msg_info.message.chat.id;
		if(msg_info.message.entities){
			if(msg_info.message.entities[0].type == "bot_command"){
				var cmd = message.split(' ')[0];
				var msg = message.substring(cmd.length);
				if(cmd == '/start'){
					command.start(msg, chat_id);   
				}
				if(cmd == '/dccon'){
					command.dccon(msg, chat_id);
				}
				
			}
		}	 
	}

	res.json(200,{ok:true});
	
});

module.exports = router;
