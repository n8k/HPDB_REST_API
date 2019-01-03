const express = require('express');
const cors = require('cors');
const app = express();

const whitelist = [
	'http://localhost:3000',
	'https://localhost:3443',
	'http://localhost:4200',
	'https://localhost:4200',
	'http://localhost:3000/undefined',
	'https://poirotdb.appspot.com'
	]


var corsOptionsDelegate = (req,callback)=> {
	var corsOptions = {
		"origin": 'https://poirotdb.appspot.com',
		"optionSucessStatus":200,
		"Access-Control-Allow-Origin":"https://poirotdb.appspot.com"
	}
	callback(null, corsOptions);
};

exports.cors=cors();
exports.corsWithOptions=cors(corsOptionsDelegate);
