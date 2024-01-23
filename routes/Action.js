var fetch = require('node-fetch')
var fs = require('fs')

var key = process.env.BOT_KEY;
var bot_addr = 'https://api.telegram.org/bot' + key + '/';


var Action = {
	sendMessage: function(chat_id, text){
		var msg = {"chat_id": chat_id, "text": text};
		fetch(bot_addr + 'sendMessage',{
                        method: "POST",
                        headers:{"Content-Type": "application/json"},
                        body: JSON.stringify(msg)
                })
		.then((response) => response.json())
		.then((data) => logResponse(data))
	}
}


function logResponse(data){
  var getdate = new Date();
  var date = getdate.getFullYear() + '-' + ('0' + (getdate.getMonth() + 1)).slice(-2) + '-' + ('0' + getdate.getDate()).slice(-2)
  var time = `${('0' + getdate.getHours()).slice(-2)}:${('0' + getdate.getMinutes()).slice(-2)}:${('0' + getdate.getSeconds()).slice(-2)}`;
  console.log('[log/' + date  + '/' + time +']: response json logged in logs folder');
  var file_name = "./logs/response_log_" + date + ".log"
  fs.appendFile(file_name, `[${time}]: ${JSON.stringify(data)}\n`, (err) => {if(err) throw err;});	
}


module.exports = Action;
