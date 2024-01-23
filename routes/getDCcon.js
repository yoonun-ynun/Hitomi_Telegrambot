var fetch = require("node-fetch");
var fs = require("fs");
var FormData = require('form-data');

function getDCcon(code, func){
	var body = FormData();
	body.append("package_idx", code)
	fetch('https://dccon.dcinside.com/index/package_detail', {
		method: 'POST',
		headers: {'x-requested-with': 'XMLHttpRequest'},
		body
	}).then((response) => response.json()).then((data) => func(data.info.title)).catch((error) => console.error(error))
}

module.exports = getDCcon
