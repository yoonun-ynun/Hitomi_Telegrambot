var fetch = require("node-fetch");
var fs = require("fs");
var FormData = require('form-data');

var getDCcon = {
	"getinfo": function(code, func){
		var body = FormData();
		body.append("package_idx", code)
		fetch('https://dccon.dcinside.com/index/package_detail', {
			method: 'POST',
			headers: {'x-requested-with': 'XMLHttpRequest'},
			body
		}).then((response) => response.json()).then((data) => func(data)).catch((error) => console.error(error))
	},
	"manage": manage
}
module.exports = getDCcon
function manage(complete){
	if(!fs.existsSync('./logs/dccon')){
		fs.mkdirSync('./logs/dccon');
	}
	if(!dcqueue[0].start()){
		dcqueue.shift()
		if(dcqueue.length > 0){
			startqueue()
		}
		return
	}
	function startqueue(){
		download(dcqueue[0].number, dcqueue[0].images).then((path) => {
			dcqueue[0].complete(path).then(() => {
				if(dcqueue.length != 0){
					startqueue()
				}
			})
		})
	}
	if(dcqueue.length == 1){
		startqueue()
		console.log('start')
	}
}


async function download(number, images){
	var paths = []
	for(var i = 0;i<images.length;i++){
		var image = images[i]
		var res = await fetch('https://dcimg5.dcinside.com/dccon.php?no=' + image.path, {
			method: 'GET',
			headers: {'Referer': "https://dccon.dcinside.com/#" + number}
		})
		var buffer = await res.buffer();
		var filename = res.headers.get('Content-Disposition').split('filename=')[1];
		paths[i] = './temp/dccon_' + i + filename.slice(-4);
		fs.writeFileSync(paths[i], buffer);
	}
	for(var i = 0;i<paths.length;i++){
		await FfmpegSync(paths[i], './temp/conv_' + i + '.webm');
	}
	return paths.map(function(element){return element.replaceAll('dccon', 'conv').replaceAll('png', 'webm').replaceAll('gif', 'webm')})
}

function FfmpegSync(input, output){
	var ffmpeg = require('fluent-ffmpeg');
	var ffprobe = require('fluent-ffmpeg');
	return new Promise((resolve, reject) => {
		ffprobe.ffprobe(input, function(err, data){
		var duration = parseFloat(data.format.duration);
		if(duration > 3){
			var fast = 3/duration - 0.1;
			ffmpeg(input)
				.format('webm')
				.videoBitrate('560k')
				.size('512x512')
				.fps(30)	
				.noAudio()
				.videoCodec('libvpx-vp9')
				.videoFilters('setpts=(' + fast + ')*PTS')
				.outputOptions('-pix_fmt rgba')
				.on('error', function(err){return reject(new Error(err))})
				.on('end', () => {resolve()})
				.save(output);
		}else{
			ffmpeg(input)	
				.format('webm')
				.videoBitrate('560k')
				.size('512x512')
				.fps(30)
				.noAudio()
				.videoCodec('libvpx-vp9')
				.outputOptions('-pix_fmt rgba')
				.on('error', function(err){return reject(new Error(err))})
				.on('end', () =>{resolve()})
				.save(output);
			}
		})
	})
}


