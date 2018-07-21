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

episodeRouter.route('/id/:episodeId')

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

// Route at /character/:characterName to find episodes with one main character ____________________

episodeRouter.route('/character/:characterName')
	.get((req,res,next) => {
		characterName = req.params.characterName.toLowerCase();
		Episode.findMainCharacter(characterName)
		.then(
			(response) => {{okFactory(res, response);}},
			(err) 		 => next(err))
		.catch((err) => next(err));
	})

// Route at /crime with 3 query AND-inclusive search options: criminalAct, means, or motive _______

episodeRouter.route('/crime')
.get((req,res,next) => {
	let queryObject = {}
	if (req.query.criminalAct)  {queryObject.criminalAct = req.query.criminalAct};
	if (req.query.means) 				{queryObject.means = req.query.means};
	if (req.query.motive) 			{queryObject.motive = req.query.motive};

	if (queryObject == {}) {
		res.statusCode = 400;
		res.end("Bad request.  Request must include at least one of: criminalAct, means, or motive.");
	};
	Episode.findCrime(queryObject)
	.then(
		(response) => {{okFactory(res, response);}},
		(err) 		 => next(err))
	.catch((err) => next(err));
})


// Route at /s:seasonNumber to find all episodes in a season_______________________________________
episodeRouter.route('/s:seasonNumber')
	.get((req,res,next) => {
		Episode.findSeason(req.params.seasonNumber)
		.then(
			(response) => {{okFactory(res, response);}},
			(err) 		 => next(err))
		.catch((err) => next(err));
	})

// Route at /s:seasonNumber/e:episodeNumber to find a specifc episode in a season__________________
episodeRouter.route('/s:seasonNumber/e:episodeNumber')
	.get((req,res,next) => {
		Episode.findEpisode(req.params.seasonNumber, req.params.episodeNumber)
		.then(
			(response) => {{okFactory(res, response);}},
			(err) 		 => next(err))
		.catch((err) => next(err));
	})

// Route at /tropes/ with query find 1 or more tropes (AND-inclusive, case sensitive) _____________
episodeRouter.route('/tropes/')
.get((req,res,next) => {
	Episode.findTrope(req.query)
	.then(
		(response) => {{okFactory(res, response);}},
		(err) 		 => next(err))
	.catch((err) => next(err));
})

// Route at /title/:searchTerm for regex search of words within the episode title__________________
episodeRouter.route('/title/:searchTerm')
.get((req,res,next) => {
	Episode.regexSearch("title", req.params.searchTerm)
	.then(
		(response) => {{okFactory(res, response);}},
		(err) 		 => next(err))
	.catch((err) => next(err));
})

// Route at /summary/:searchTerm for regex search of words within the episode title__________________
episodeRouter.route('/summary/:searchTerm')
.get((req,res,next) => {
	Episode.regexSearch("episodeSummary", req.params.searchTerm)
	.then(
		(response) => {{okFactory(res, response);}},
		(err) 		 => next(err))
	.catch((err) => next(err));
})

// Route at /writer/:searchTerm for regex search of words within writer field______________________
episodeRouter.route('/writer/:searchTerm')
.get((req,res,next) => {
	Episode.regexSearch("writer", req.params.searchTerm)
	.then(
		(response) => {{okFactory(res, response);}},
		(err) 		 => next(err))
	.catch((err) => next(err));
})

// Route at /writer/:searchTerm for regex search of words within writer field______________________
episodeRouter.route('/director/:searchTerm')
.get((req,res,next) => {
	Episode.regexSearch("director", req.params.searchTerm)
	.then(
		(response) => {{okFactory(res, response);}},
		(err) 		 => next(err))
	.catch((err) => next(err));
})

// Route at /mood/:searchTerm for regex search within mood field___________________________________
episodeRouter.route('/mood/:searchTerm')
.get((req,res,next) => {
	Episode.regexSearch("mood", req.params.searchTerm)
	.then(
		(response) => {{okFactory(res, response);}},
		(err) 		 => next(err))
	.catch((err) => next(err));
})
module.exports = episodeRouter;