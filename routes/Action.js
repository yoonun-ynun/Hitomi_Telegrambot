var fetch = require('node-fetch')
var fs = require('fs')
var FormData = require('form-data')

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
	},
	createNewStickerSet: createNewStickerSet,
	getStickerSet: async function(name){
		var result = await fetch(bot_addr + 'sendMessage', {
			method: "POST",
			headers:{"Content-Type": "application/json"},
			body: JSON.stringify({name:name})
		})
		var json = await result.json()
		logResponse(json)
		return json
	},
	sendSticker: async function(chat_id, file_id){
		var result = await fetch(bot_addr + 'sendSticker', {
			method: "POST",
			headers:{"Content-Type": "application/json"},
			body: JSON.stringify({chat_id:chat_id, file_id:file_id})
		})
		result.json().then((data) => logResponse(data)).catch((error) => console.error(error))
	}

}

async function createNewStickerSet(user_id, name, title, stickers, sticker_format, inputpath){
	var body = new FormData()
	body.append('user_id', user_id)
	body.append('name', name)
	body.append('title', title)
	body.append('stickers', JSON.stringify(stickers))
	body.append('sticker_format', sticker_format)
	for(var i = 0;i<inputpath.length;i++){
		body.append(`${i}dccon`, fs.createReadStream(inputpath[i]), {filename: `${i}.webm`, contentType:'video/VP9'})
	}
	var res = await fetch(bot_addr + 'createNewStickerSet',{
		method:"POST",
		headers:{"Content-Type": "multipart/form-data"},
		body
	})
	res.json().then((data) => logResponse(data)).catch((error) => console.error(error))
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
