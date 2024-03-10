var fetch = require('node-fetch')
var fs = require('fs')

async function page(number, page){
	var res = await fetch(`https://ltn.hitomi.la/galleries/${number}.js`);
	var body = await res.text();
	console.log(body);
	eval(body);
	if(!galleryinfo){
		return;
	}
	var hash = galleryinfo.files[page].hash;
	var addr = await Get_Address(hash);
	console.log("addr: "+addr);
	if(!addr){
		return;
	}
	var img = await fetch(addr, {
		method: "GET",
		headers:{'Referer': `https://hitomi.ls/reader/${number}.html#1`}
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
	console.log("gg.js: "+body);
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

module.exports = {'page': page, 'comic': comic}
