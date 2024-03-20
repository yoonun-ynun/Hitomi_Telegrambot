var fetch = require('node-fetch')
var fs = require('fs')

async function page(number, page){
	var res = await fetch(`https://ltn.hitomi.la/galleries/${number}.js`);
	var body = await res.text();
	try{
	eval(body);
	}catch(err){
		return;
	}
	if(!galleryinfo){
		return;
	}
	try{
	var hash = galleryinfo.files[page-1].hash;
	}catch(err){
		return;
	}
	var addr = await Get_Address(hash);
	console.log("addr: "+addr);
	if(!addr){
		return;
	}
	var img = await fetch(addr, {
		method: "GET",
		headers:{'Referer': `https://hitomi.la/reader/${number}.html#1`}
	})
	var buffer = await img.buffer();
	console.log(buffer);
	return buffer;
}

async function comic(number, send_per, send_res){
	
}

async function Get_Address(hash){
	var key = parseInt(hash.charAt(hash.length-1) + hash.charAt(hash.length-3) + hash.charAt(hash.length-2), 16)
	var fres = await fetch(`https://ltn.hitomi.la/gg.js`);
	var body = await fres.text();
	var code = body.substr(14);
	eval(code);
	if(!gg){
		console.log("gg.js가 존재하지 않습니다.");
		return;
	}
	var result = gg.m(key); 
	if(result == 0){
		return `https://aa.hitomi.la/webp/${gg.b}${key}/${hash}.webp`
	}else{
		return `https://ba.hitomi.la/webp/${gg.b}${key}/${hash}.webp`
	}
}

async function getInfo(number){
	var res = await fetch(`https://ltn.hitomi.la/galleries/${number}.js`);
	var body = await res.text();
	try{
		eval(body);
	}catch(err){
		return;
	}
	if(!galleryinfo){
		return;
	}

	var title = galleryinfo.title;
	var tag_res = []
	for(var i = 0;i<galleryinfo.tags.length;i++){
		var tagname = galleryinfo.tags[i].tag;
		if(galleryinfo.tags[i].male == 1){
			tagname = "male: " + tagname;
		}
		if(galleryinfo.tags[i].female == 1){
			tagname = "famale: " + tagname;
		}
		tag_res[i] = tagname;
	}
	return {title: title, tags: tag_res}
}

module.exports = {'page': page, 'comic': comic, 'getInfo': getInfo}
