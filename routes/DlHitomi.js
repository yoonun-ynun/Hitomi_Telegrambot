var fetch = require('node-fetch')
var JSZIP = require('jszip')
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
	if(!addr){
		return;
	}

	var buffer;

	async function dl(){
		var img = await fetch(addr, {
			method: "GET",
			headers:{'Referer': `https://hitomi.la/reader/${number}.html#1`}
		})
		if(img.ok){
			buffer = await img.buffer();
		}else if(img.status == 503){
			await dl();
		}
	}
	await dl();
	
	return buffer;
}

async function comic(number, send_res){
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
	console.log(body);
	var length = galleryinfo.files.length;
	var count = 0;
	var zip = new JSZIP();
	for(var i = 0;i<length;i++){
		function success(buffer, num){
			console.log(`${count}/${length} success`);
			console.log(num +" success");
			zip.file(num+1 + '.webp', buffer);
			count++;
			if(count == length){
				zip
				.generateNodeStream({type:'nodebuffer',streamFiles:true})
				.pipe(fs.createWriteStream(`./hitomi/${number}.zip`))
				.on('finish', function () {
    				send_res()
				});
			}
		}
		async function dl(num){
			var hash = galleryinfo.files[num].hash;
			var addr = await Get_Address(hash);
			if(!addr){
				return;
			}
			fetch(addr, {
				method: "GET",
				headers:{'Referer': `https://hitomi.la/reader/${number}.html#1`}
			}).then((result) => {
				if(result.ok){
					console.log(result.status);
					result.arrayBuffer().then((buffer) => success(buffer, num))
				}else if(result.status == 503){
					dl(num);
				}
			});
		}
		dl(i)
		
	}
	return true;
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
