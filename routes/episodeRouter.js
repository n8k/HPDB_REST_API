// Require ________________________________________________________________________________________

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// const authenticate = require('../authenticate');
const cors = require('./cors');
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
	.options(cors.corsWithOptions, (req,res) => {res.sendStatus(200);})
	.get(cors.corsWithOptions, (req, res, next) => {
		Episode.find({})
		.then(
			(response) => { okFactory(res, response);},
			(err) 		 => next(err))
		.catch((err) => next(err));
	})

	.put(cors.corsWithOptions, (req,res,next) => { forbiddenFactory(req,res); })

	.post(cors.corsWithOptions, (req,res,next) => {
		Episode.create(req.body)
		.then(
			(response) => { okFactory(res, response);},
			(err) 		 => next(err))
		.catch((err) => next(err));
	})

	.delete(cors.corsWithOptions, (req,res,next) => {
		Episode.remove({})
		.then(
			(response) => { okFactory(res, response);},
			(err) 		 => next(err))
		.catch((err) => next(err));
	})

// Route at /episode/:episodeId for one episode____________________________________________________

episodeRouter.route('/id/:episodeId')
	.options(cors.corsWithOptions, (req,res) => {res.sendStatus(200);})
	.get(cors.corsWithOptions, (req,res,next) => {
		Episode.findById(req.params.episodeId)
		.then(
			(response) => { okFactory(res, response);},
			(err) 		 => next(err))
		.catch((err) => next(err));
	})

	.put(cors.corsWithOptions, (req, res, next) => {
		Episode.findByIdAndUpdate(
			req.params.episodeId,
			{ $set: req.body }, 
			{ new: true })
		.then(
			(response) => { okFactory(res, response);},
			(err)  		 => next(err))
		.catch((err) => next(err));
	})

	.post(cors.corsWithOptions, (req,res,next) => { forbiddenFactory(req,res); })

	.delete(cors.corsWithOptions, (req,res,next) => {
		Episode.findByIdAndRemove(req.params.episodeId)
		.then(
			(response) => { okFactory(res, response);},
			(err) 		 => next(err))
		.catch((err) => next(err));
	})

// Route at /character/:characterName to find episodes with one main character ____________________

episodeRouter.route('/characters/')
	.options(cors.corsWithOptions, (req,res) => {res.sendStatus(200);})
	.get(cors.corsWithOptions, (req,res,next) => {

		lowerCaseQuery = Object.keys(req.query).reduce(
			(newObj, key) => (newObj[key] = req.query[key].toLowerCase(), newObj), {})

		Episode.booleanSearch("mainCharacters", lowerCaseQuery)
		.then(
			(response) => {okFactory(res, response);},
			(err) 		 => next(err))
		.catch((err) => next(err));
	})

// Route at /crime with case-insensitive search of criminalAct, perpetrator, victim, means, motive,
// & opportunity.

episodeRouter.route('/crime')
	.options(cors.corsWithOptions, (req,res) => {res.sendStatus(200);})
	.get(cors.corsWithOptions, (req,res,next) => {
		let queryObject = {}
		Episode.findCrime(req.query)
		.then(
			(response) => {okFactory(res, response);},
			(err) 		 => next(err))
		.catch((err) => next(err));
	})

// Route at /s:seasonNumber to find all episodes in a season_______________________________________
episodeRouter.route('/s:seasonNumber')
	.options(cors.corsWithOptions, (req,res) => {res.sendStatus(200);})
	.get(cors.corsWithOptions, (req,res,next) => {
		Episode.findSeason(req.params.seasonNumber)
		.then(
			(response) => {okFactory(res, response);},
			(err) 		 => next(err))
		.catch((err) => next(err));
	})

// Route at /s:seasonNumber/e:episodeNumber to find a specifc episode in a season__________________
episodeRouter.route('/s:seasonNumber/e:episodeNumber')
	.options(cors.corsWithOptions, (req,res) => {res.sendStatus(200);})
	.get(cors.corsWithOptions, (req,res,next) => {
		Episode.findEpisode(req.params.seasonNumber, req.params.episodeNumber)
		.then(
			(response) => {okFactory(res, response);},
			(err) 		 => next(err))
		.catch((err) => next(err));
	})

// Route at /tropes/ with query find 1 or more tropes (AND-inclusive, case sensitive) _____________
episodeRouter.route('/tropes/')
	.options(cors.corsWithOptions, (req,res) => {res.sendStatus(200);})
	.get(cors.corsWithOptions, (req,res,next) => {
		Episode.booleanSearch("tropes", req.query)
		.then(
			(response) => {okFactory(res, response);},
			(err) 		 => next(err))
		.catch((err) => next(err));
	})

// Route at /title/:searchTerm for regex search of words within the episode title__________________
episodeRouter.route('/title/:searchTerm')
	.options(cors.corsWithOptions, (req,res) => {res.sendStatus(200);})
	.get(cors.corsWithOptions, (req,res,next) => {
		Episode.regexSearch("title", req.params.searchTerm)
		.then(
			(response) => {okFactory(res, response);},
			(err) 		 => next(err))
		.catch((err) => next(err));
	})

// Route at /summary/:searchTerm for regex search of words within the episode title__________________
episodeRouter.route('/summary/:searchTerm')
	.options(cors.corsWithOptions, (req,res) => {res.sendStatus(200);})
	.get(cors.corsWithOptions, (req,res,next) => {
		Episode.regexSearch("episodeSummary", req.params.searchTerm)
		.then(
			(response) => {okFactory(res, response);},
			(err) 		 => next(err))
		.catch((err) => next(err));
	})

// Route at /writer/:searchTerm for regex search of words within writer field______________________
episodeRouter.route('/writer/:searchTerm')
	.options(cors.corsWithOptions, (req,res) => {res.sendStatus(200);})
	.get(cors.corsWithOptions, (req,res,next) => {
		Episode.regexSearch("writer", req.params.searchTerm)
		.then(
			(response) => {okFactory(res, response);},
			(err) 		 => next(err))
		.catch((err) => next(err));
	})

// Route at /writer/:searchTerm for regex search of words within writer field______________________
episodeRouter.route('/director/:searchTerm')
	.options(cors.corsWithOptions, (req,res) => {res.sendStatus(200);})
	.get(cors.corsWithOptions, (req,res,next) => {
		Episode.regexSearch("director", req.params.searchTerm)
		.then(
			(response) => {okFactory(res, response);},
			(err) 		 => next(err))
		.catch((err) => next(err));
	})

// Route at /mood/:searchTerm for regex search within mood field___________________________________
episodeRouter.route('/mood/:searchTerm')
	.options(cors.corsWithOptions, (req,res) => {res.sendStatus(200);})
	.get(cors.corsWithOptions, (req,res,next) => {
		Episode.regexSearch("mood", req.params.searchTerm)
		.then(
			(response) => {okFactory(res, response);},
			(err) 		 => next(err))
		.catch((err) => next(err));
	})

// Route at /search/ for global search ____________________________________________________________
episodeRouter.route('/global/')
	.options(cors.corsWithOptions, (req,res) => {res.sendStatus(200);})
	.get(cors.corsWithOptions, (req,res,next) => {

		// Robust search of all schema in the database.  This route accepts multiple query-strings:
		// 
		// QUERYSTRING 						FORMAT  								EXAMPLE
		// 
		// season=								Number  								1
		// episode=								Number  								1
		// title= 								String  								Adventure
		// episodeSummary=				String  								snowbound
		// originalAirDate=				YYYY-MM-DD String 	 		1970-01-01
		// supportingCharacters=	String  								Eliza Dunn
		// mainCharacters=				String 									hastings
		// mainCharacters=				String comma-separated 	hastings,lemon,japp 
		// tropes= 								String 									poirotIsReallyBelgian
		// tropes= 								String comma-separated 	poirotIsReallyBelgian,hastingsGolf
		// director=							String  								Edward Bennett
		// writer=								String 									Clive Exton
		// mood=									String 									light
		// perpetrator=						String 									Carla Romero
		// victim=								String 									The London and Scottish Bank
		// criminalAct=						String 									Murder
		// means=									String 									Pistol
		// motive=								String 									Greed
		// opportunity=						String 									Posing as

		Episode.globalSearch(req.query)
		.then(
			(response) => {okFactory(res, response);},
			(err) 		 => next(err))
		.catch((err) => next(err));
	})

module.exports = episodeRouter;