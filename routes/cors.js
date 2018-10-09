const express = require('express');
const cors = require('cors');
const app = express();

const whitelist = [
	'http://localhost:3000',
	'https://localhost:3443',
	'http://localhost:4200',
	'https://localhost:4200',
	'http://localhost:3000/undefined'
	]


var corsOptionsDelegate = (req,callback)=> {
	var corsOptions = {
		"origin": 'http://localhost:4200',
		"optionSucessStatus":200,
		"Access-Control-Allow-Origin":"http://localhost:4200"
	}
	callback(null, corsOptions);
};

exports.cors=cors();
exports.corsWithOptions=cors(corsOptionsDelegate);