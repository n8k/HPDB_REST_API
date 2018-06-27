// Require ________________________________________________________________________________________

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// const authenticate = require('../authenticate');
// const cors = require('cors');
const Episode = require('../models/episodeModel');

const episodeRouter = express.Router();
episodeRouter.use(bodyParser.json());

// Functions ______________________________________________________________________________________

function okFactory(response, respondWith) {
	response.statusCode = 200;
	response.setHeader('Content-Type', 'application/json');
	response.json(respondWith);
}

function notFoundFactory(typeOfThing, thingNotFound) {
	err = new Error(typeOfThing + " " + thingNotFound + " not found");
	err.status = 404;
	return err;
}

function forbiddenFactory(request, response) {
	response.statusCode = 403;
	response.end(request.method + ' operation not supported on ' + request.originalUrl);
}

// Route at /episode/ for all episodes_____________________________________________________________

episodeRouter.route('/')
	.get((req, res, next) => {
		Episode.find({})
		.then(
			(response) => { okFactory(res, response);},
			(err) 		 => next(err))
		.catch((err) => next(err));
	})

	.put((req,res,next) => { forbiddenFactory(req,res); })

	.post((req,res,next) => {
		Episode.create(req.body)
		.then(
			(response) => { okFactory(res, response);},
			(err) 		 => next(err))
		.catch((err) => next(err));
	})

	.delete((req,res,next) => {
		Episode.remove({})
		.then(
			(response) => { okFactory(res, response);},
			(err) 		 => next(err))
		.catch((err) => next(err));
	})

// Route at /episode/:episodeId for one episode____________________________________________________

episodeRouter.route('/:episodeId')

	.get((req,res,next) => {
		Episode.findById(req.params.episodeId)
		.then(
			(response) => { okFactory(res, response);},
			(err) 		 => next(err))
		.catch((err) => next(err));
	})

	.put((req, res, next) => {
		Episode.findByIdAndUpdate(
			req.params.episodeId,
			{ $set: req.body }, 
			{ new: true })
		.then(
			(response) => { okFactory(res, response);},
			(err)  		 => next(err))
		.catch((err) => next(err));
	})

	.post((req,res,next) => { forbiddenFactory(req,res); })

	.delete((req,res,next) => {
		Episode.findByIdAndRemove(req.params.episodeId)
		.then(
			(response) => { okFactory(res, response);},
			(err) 		 => next(err))
		.catch((err) => next(err));
	})


module.exports = episodeRouter;