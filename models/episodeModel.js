// Require ____________________________________________________________________
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = require('bluebird');

// Schema _____________________________________________________________________

var mainCharacters = new Schema({
	poirot: 		{type: Boolean, default: true},
	hastings: 	Boolean,
	lemon: 			Boolean,
	japp: 			Boolean,
	oliver:			Boolean
});

var poirotTropes = new Schema({
	poirotTriesToPreventMurder: Boolean,	// Poirot tries to prevent murder
	poirotTriesToPreventCrime:  Boolean,	// Poirot tries to prevent other crime
	poirotLenientJudgeAndJury: 	Boolean,	// Poirot solves the case or exposes a crime but does not punish the perpetrators
	poirotCompulsiveSymmetry: 	Boolean,	// Poirot exhibits a compulsive obsession with symmetry and straightening items
	poirotIsReallyBelgian: 			Boolean,	// Poirot is mistaken for French and informs them he's Belgian
	poirotSolvesColdCase: 			Boolean,	// Poirot solves an old case
	poirotCommitsCrime:					Boolean,	// Poirot commits a crime
	poirotMatchmaker: 					Boolean,	// Poirot plays matchmaker and pairs a new couple
	poirotRetirement: 					Boolean,	// Poirot retires
	poirotAvuncular: 						Boolean,	// Poirot assumes a protective role of a younger lady
	poirotOnHoliday: 						Boolean,	// Setting is Poirot on holiday
	poirotSmitten:  						Boolean,	// Poirot in love
	poirotDentist: 							Boolean,	// Poirot visits the dentist
	hastingsLadyPuzzlement:  		Boolean,  // Hastings doesn't understand women
	hastingsSolvesCase: 				Boolean,  // Hastings solves the case
	hastingsSmitten: 						Boolean,	// Hastings in love
	hastingsTravel: 						Boolean,  // Hastings travels abroad
	hastingsHobby: 							Boolean,  // Hastings takes up a hobby
	hastingsGolf: 							Boolean,	// Hastings shows an interest in golf
	hastingsCar:  							Boolean,	// Hastings shows an interest in cars
	msLemonOrderAndMethod: 			Boolean,  // Ms. Lemon does detective work
	msLemonsFilingSystem: 			Boolean,	// Ms. Lemon's filing system is featured in the episode
	msLemonSupernatural: 				Boolean,	// Ms. Lemon shows interest or ability in the supernatural or occult
	perpTriesToOutmartPoirot: 	Boolean,	// Perpetrator intentionally involves Poirot as part of the plot
	frenchVsEnglishCuisine:			Boolean,	// Running jokes in episode about British vs. French food
	diggingUpThePast: 					Boolean,  // Setting is in an archaeological dig in the Middle East
	christmasSpecial:						Boolean,	// Christmas episode
	artImitatesArt:							Boolean,	// Episode involves a murder-mystery play or novel
	hostIsMurdered: 						Boolean,	// The host of a party or invite is murdered at, during, or after the event
	bridgeGame: 								Boolean,  // People play the card game Bridge
	bonVoyage: 									Boolean	  // Crime scene is on a train, plane, or boat
});

var crimeSchema = new Schema({
	perpetrator:  String,
	victim: 			String,
	criminalAct:	String,
	means: 				String,
	motive:				String,	
	opportunity: 	String
});

var episodeSchema = new Schema({
	season: 								{required: true, type: Number, min: 1, max: 13},
	episode: 								{required: true, type: Number, min: 1},
	title: 									{required: true, type: String},
	episodeSummary: 				{required: true, type: String},
	originalAirDate:				{type: Date},
	mainCharacters: 				mainCharacters,
	supportingCharacters: 	[String],
	tropes: 								poirotTropes,
	crimes: 								[crimeSchema], 
	director: 							String,
	writer: 								String,
	mood: 									String,
},
{timestamps: true}
);

// Statics ____________________________________________________________________

episodeSchema.statics.findByIdList = function(arrayOfIds) {

	// Returns 1 episode or many episodes given an array of mongoDB _ids

	return this.find({"_id":{$in:[arrayOfIds]}});
}

episodeSchema.statics.findMainCharacter = function(name) {
	
	// Returns all episodes featuring one main character

	let query = "mainCharacters." + name;
	return this.find({[query]:true});
}

episodeSchema.statics.findSeason = function(season) {

	// Returns all episodes of a season, given the season number

	return this.find({"season":[season]});
}

episodeSchema.statics.findEpisode = function(season,episode) {

	// Returns 1 episode given season and episode number

	return this.find({
		"season": [season],
		"episode":[episode]
	});
}

episodeSchema.statics.findTrope = function(queryObject) {

	// Search of tropes.  Accepts any number of trope params, case sensitive

	query = [];
	console.log(queryObject);
	for (var key in queryObject) {
	    if (queryObject.hasOwnProperty(key)) {
	        let text = "tropes." + queryObject[key];
	        query.push({[text]:true});
	    }
	  }
	return this.find({$and:query});
}

episodeSchema.statics.regexSearch = function(field, searchTerm) {

	// Case-insensitive regex term search of episodeSchema fields

	let regexTerm = new RegExp((searchTerm), 'i');
	return this.find({[field]:{$regex:regexTerm}});	
}

episodeSchema.statics.findCrime = function(queryObject) {

	// Multi-param search of crimes, including: criminalAct, means, and motive
	// Checks if any of these 3 params was passed, and if so, adds it to the search query

	query = [];

	if (queryObject.criminalAct) {
		query.push({"crimes.criminalAct": {$regex: new RegExp(queryObject.criminalAct, "i")}});
	};

	if (queryObject.means) {
		query.push({"crimes.means": {$regex: new RegExp(queryObject.means, "i")}});
	};

	if (queryObject.motive) {
		query.push({"crimes.motive": {$regex: new RegExp(queryObject.motive, "i")}});
	};

	return this.find({$and:query});
}

module.exports = mongoose.model('Episode', episodeSchema);