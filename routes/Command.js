var fetch = require('node-fetch')
var action = require('./Action')
var fs = require('fs')

global.dcqueue = []
global.hqueue = []
var Command = {
	start: function(message, chat_id){
		action.sendMessage(chat_id, "Hello World!!\nyour text: " + message);
	},
	dccon: dccon
}

function dccon(message, chat_id){
	if(message == 'queue'){
		var msg = ""
		if(dcqueue.length == 0){
			action.sendMessage(chat_id, '대기열이 비어있습니다.')
			return;
		}else{
			msg += '대기열 목록(1번이 현재 진행중인 디시콘입니다.):\n'
			for(var i = 0;i<dcqueue.length;i++){
				msg += `${i + 1}: ${dcqueue[i].title} \n`
			}
			action.sendMessage(chat_id, msg);
			return;
		}
	}
	var getDCcon = require('./getDCcon')
	async function makesticker(path){
		var times = parseInt(path.length/50) + 1
		for(var i = 0;i<times;i++){
			var id = process.env.ADMIN_ID;
			var name = `dccon_num_${dcqueue[0].number}_count_${i}_by_${process.env.BOT_USERNAME}`
			var title = `${dcqueue[0].title} ${i+1}th by @${process.env.BOT_USERNAME}`
			var format = "video"
			var stickers = []
			var re = path.length
			var f = path.length
			if(i==0 && path.length>50){
				re = 50
				f = 50
			}else if(path.length>50){
				re = path.length==100 ? 50 : path.length%50
			}
			for(var j = 0;j<re;j++){
				var file = `attach://${j}dccon`
				var list = ['🍞']
				stickers[stickers.length] = {sticker:file, emoji_list:list}
			}
			var inputpath
			inputpath = path.slice((i*50), f)
			await action.createNewStickerSet(id, name, title, stickers, format, inputpath)
			var set = await action.getStickerSet(name)
			var sticker = set.result.stickers[0].file_id
			await action.sendSticker(chat_id, sticker)
		}
	}
	async function complete(path){
		action.sendMessage(chat_id,`${dcqueue[0].title} 스티커가 제작중입니다.`);
		await makesticker(path);
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
