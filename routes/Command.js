var action = require('./Action')
var dlH = require('./DlHitomi')
var fs = require('fs')

global.dcqueue = []
global.hqueue = []
var Command = {
	start: function(message, chat_id){
		action.sendMessage(chat_id, "Hello World!!\nyour text: " + message);
	},
	dccon: dccon,
	hitomi: hitomi,
	viewer: viewer,
	view_next: view_next,
	tags: tags,
	download: download
} 

function download(key, chat_id){
	if(key == 'queue'){
		var msg = ""
		if(hqueue.length == 0){
			action.sendMessage(chat_id, '대기열이 비어있습니다.')
			return;
		}else{
			msg += '대기열 목록(1번이 현재 진행중인 작품입니다.):\n'
			for(var i = 0;i<hqueue.length;i++){
				msg += `${i + 1}: ${hqueue[i].title} \n`
			}
			action.sendMessage(chat_id, msg);
			return;
		}
	}

	dlH.getInfo(key).then((result) =>{
		if(!result){
			action.sendMessage(chat_id, "해당하는 번호의 작품이 없습니다.");
			return;
		}
		hqueue[hqueue.length] = {"title": result.title, "key": key, "chat_id": chat_id}
		action.sendMessage(chat_id, "대기열에 추가되었습니다.")
		Hmanage();
	})
	
	function Hmanage(){
		function startqueue(){
			dlH.comic(hqueue[0].key, ()=>{
				action.sendMessage(chat_id, `Download: https://${process.env.DOMAIN}/download/${hqueue[0].key}.zip`);
				hqueue.shift();
				if(hqueue.length != 0){
					startqueue();
				}
			}).then((result)=>{
				if(!result){
					action.sendMessage(chat_id, "해당하는 번호의 작품이 없습니다.");
					hqueue.shift();
					if(hqueue.length != 0){
						startqueue();
					}
				}
			}).catch((error) => {
				action.sendMessage(chat_id, "다운로드에 실패하였습니다.");
				hqueue.shift();
				if(hqueue.length != 0){
					startqueue()
				}
			})
		}
		if(hqueue.length == 1){
			startqueue();
		}
	}
}

function tags(key, chat_id){
	dlH.getInfo(key).then((result) =>{
		if(!result){
			action.sendMessage(chat_id, "해당하는 번호의 작품이 없습니다.");
		}
		var text = `Title:\n${result.title}\nTags:\n`;
		text += result.tags.join(', ');
		action.sendMessage(chat_id, text);
	})
}

function view_next(key, page, chat_id, message_id, norp){
	dlH.page(key, page).then((result) => {
		if(!result){
			if(norp){
				action.sendMessage(chat_id, "마지막 페이지 입니다.");
			}else{
				action.sendMessage(chat_id, "첫번째 페이지 입니다.");
			}
		}else{
			var inline = {
				inline_keyboard:[
					[
						{"text": "Prev", "callback_data": JSON.stringify({Command: "view_prev", key: key, page: page-1})},
						{"text": "Next", "callback_data": JSON.stringify({Command: "view_next", key: key, page: page+1})}
					],
					[{"text": "Get info", "callback_data": JSON.stringify({Command: "info", key: key})}]
				]
			}
			action.editMessagePhoto(chat_id, message_id, result, inline);
		}
	})
}

async function viewer(key, chat_id){
	var info = await dlH.getInfo(key);
	if(!info){
		action.sendMessage(chat_id, "해당하는 번호의 작품이 없습니다.");
		return;
	}
	action.sendMessage(chat_id, `Viewer about: ${info.title}`)

	dlH.page(key, 1).then((result) => {
		if(!result){
			action.sendMessage(chat_id, "해당하는 번호의 작품이 없습니다.");
		}else{
			var inline = {
				inline_keyboard:[
					[{"text": "Next", "callback_data": JSON.stringify({Command: "view_next", key: key, page: 2})}],
					[{"text": "Get info", "callback_data": JSON.stringify({Command: "info", key: key})}]
				]
			}
			action.sendPhoto(chat_id, result, inline);
		}
	})

}

function hitomi(message, chat_id){
	dlH.getInfo(message).then((result) => {
		if(!result){
			action.sendMessage(chat_id, "해당하는 번호의 작품이 없습니다.");
			return;
		}else{
			action.sendMessage(chat_id, `Title: ${result.title}`)
		}
	})
	dlH.page(message, 1).then((result) => {
		if(!result){
			action.sendMessage(chat_id, "해당하는 번호의 작품이 없습니다.");
		}else{
			var inline = {
				inline_keyboard:[
					[{"text": "Get viewer", "callback_data": JSON.stringify({Command: "view", key: message})}],
					[{"text": "Get tags", "callback_data": JSON.stringify({Command: "tags", key: message})}],
					[{"text": "Download", "callback_data": JSON.stringify({Command: "download", key: message})}]
				]
			}
			action.sendPhoto(chat_id, result, inline);
		}
	})
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
			var name = `dccon_num_${message}_count_${i}_by_${process.env.BOT_USERNAME}`
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
			if(i==0){
				fs.appendFileSync('./logs/dccon/check.js', `case ${message}:\n`)
			}else if(i==1){
				fs.appendFileSync('./logs/dccon/secon.js', `case ${message}:\n`)
			}
		}
	}
	function start(){
		var checked = false
		try{
			var check_file = fs.readFileSync('./logs/dccon/check.js')
			var code = `switch(parseInt(message)){\n${check_file}checked=true;break;}`
			eval(code)
		}catch(err){
			console.log('아직 디시콘을 한번도 변환하지 않았거나 ./logs/dccon/check.js에 무언가 오류가 있는 것 같습니다.')
		}

		if(checked){
			var secon = false
			action.sendMessage(chat_id, '이미 변환된 디시콘입니다.')
                	try{
				var secon_file = fs.readFileSync('./logs/dccon/secon.js')
				var code = `switch(parseInt(message)){\n${secon_file}secon=true;break;}`
				eval(code)
			}catch(err){
				console.log('아직 개수가 51개 이상인 디시콘을 한번도 변환하지 않았거나 secon.js에 무언가 오류가 있는 것 같습니다.')
			}
			var loop = 1;
			if(secon){
				loop = 2
			}
			for(var i = 0;i<loop;i++){
				var name = `dccon_num_${message}_count_${i}_by_${process.env.BOT_USERNAME}`
				action.getStickerSet(name).then((result) => {
					var sticker = result.result.stickers[0].file_id
					action.sendSticker(chat_id, sticker)
				})

			}
			return false
		}else{
			action.sendMessage(chat_id, '디시콘 변환이 시작되었습니다.')
			return true
		}
	}
	async function complete(path){
		action.sendMessage(chat_id,`${dcqueue[0].title} 스티커가 제작중입니다.`);
		await makesticker(path);
		dcqueue.shift();
	}
	function Send_Error(message){
		var msg = "Error:\n" + message + "관리자에게 문의해 주세요."
		action.sendMessage(chat_id, msg);
	}
	function send(json){
		dcqueue[dcqueue.length] = {"number": message,"title": json.info.title, "images": json.detail, "chat_id": chat_id, "complete": complete, "start": start, "Send_Error": Send_Error};
		action.sendMessage(chat_id, `대기열에 추가되었습니다.[${dcqueue.length}/${dcqueue.length}]`)
		getDCcon.manage();
	}
	function unexist(){
		action.sendMessage(chat_id,'존재하지 않는 디시콘입니다.')
	}
	getDCcon.getinfo(message, send, unexist)
}

module.exports = Command
