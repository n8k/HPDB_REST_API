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

// Route at /crime:/criminalAct to find episodes with the specified criminalAct ___________________
	episodeRouter.route('/crime/:criminalAct')
		.get((req,res,next) => {
			let criminalAct = req.params.criminalAct.toLowerCase();
			Episode.findCrime(criminalAct)
			.then(
				(response) => {{okFactory(res, response);}},
				(err) 		 => next(err))
			.catch((err) => next(err));
		})

// Route at /s:seasonNumber to find all episodes in a season_______________________________________
episodeRouter.route('/s:seasonNumber')
	.get((req,res,next) => {
		Episode.findSeason(req.params.seasonNumber, null)
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

// Route at /s:seasonNumber/e:episodeNumber to find a specifc episode in a season__________________
episodeRouter.route('/tropes/:tropeType')
.get((req,res,next) => {
	Episode.findTrope(req.params.tropeType)
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

module.exports = episodeRouter;