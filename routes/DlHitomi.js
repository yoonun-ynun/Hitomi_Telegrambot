var fetch = require('node-fetch')
var fs = require('fs')

async function page(number, page){
	var res = await fetch(`https://ltn.hitomi.la/galleries/${number}.js`);
	var body = await res.text();
	eval(body);
	if(!galleryinfo){
		return;
	}
	var hash = galleryinfo.files[page].hash;
	var addr = Get_Address(hash);
	var img = await fetch(addr, {
		method: "GET",
		headers:{'Referer': `https://hitomi.ls/reader/${number}.html#1`}
	})
	var buffer = img.buffer();
	return buffer;
}

async function comic(number, send_per, send_res){
	
}

async function Get_Address(hash){
	var key = parseInt(hash.charAt(hash.length-1) + hash.charAt(hash.length-3) + hash.charAt(hash.length-2), 16)
	var fres = await fetch(`https://ltn.hitomi.la/gg.js`);
	var body = await fres.text();
	var code = body.substr(14);
	var gg;
	eval(code);
	if(!gg){
		return;
	}
	var result = gg.m(key); 
	if(result == 0){
		return `https://aa.hitomi.la/webp/${hash}`
	}else{
		return `https://ba.hitomi.la/webp/${hash}`
	}
}

module.exports = {'page': page, 'comic': comic}
