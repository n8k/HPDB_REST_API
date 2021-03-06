// Require ____________________________________________________________________
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema _____________________________________________________________________

var mainCharacters = new Schema({
	hastings: 	Boolean,
	lemon: 			Boolean,
	japp: 			Boolean,
	oliver:			Boolean,
	george:			Boolean
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

episodeSchema.statics.booleanSearch = function(targetField, queryObject) {

	// Generalized function for search of any Boolean fields in the schema.
	// Accepts any number of query-strings in queryObject and a target field.

	query = [];
	for (var key in queryObject) {
	    if (queryObject.hasOwnProperty(key)) {
	        let field = [targetField] + "." + queryObject[key];
	        query.push({[field]:true});
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

	// Multi-param case-insensitive query-string search of crimes, including:
	// criminalAct, perpetrator, victim, means, motive, opportunity.

	query = [];
	for (var key in queryObject) {
		if (queryObject.hasOwnProperty(key)) {
			let field = "crimes." + key;
			query.push({[field]:{$regex: new RegExp(queryObject[key], "i")}});
		}
	}
	return this.find({$and:query});
}

episodeSchema.statics.globalSearch = function(queryObject) {

	// Robust search of all schema in the database.  This function inspects all
	// of queryObject's keys and then formats each as a mongoDB search-ready object.
	// All formated objects are then added to a mongoDB $and-query.
	// 
	// It will generate a 400 bad-request error if the key does not match the correct format.
	// 
	// mainCharacters and tropes accept multiple parameters separated by commas,
	// for example /global?mainCharacters=hastings,lemon,japp returns all episodes with 
	// Captain Hastings, Miss Lemon and Inspector Japp.
	// 
	// All other keys accept only a single parameter.

	var query = [];
	var invalidKeys  = [];
	var dateField    = ['originalAirDate'];  
	var numberField  = ['season','episode'];
	var booleanField = ['mainCharacters','tropes'];
	var stringField  = ['title','episodeSummary','director','writer','mood','supportingCharacters'];
	var crimeField   = ['perpetrator','victim','criminalAct','means','motive','opportunity'];
	var allFields    = dateField.concat(numberField).concat(booleanField).concat(stringField).concat(crimeField);

	for (var key in queryObject) {
		if (!allFields.includes(key)) {
			invalidKeys.push(key);
		}
		if (dateField.includes(key)) {
			var date = new Date(queryObject[key]);
			query.push({[key]:date});
		}
		if (numberField.includes(key)) {
			query.push({[key]:[queryObject[key]]});
		}
		if (booleanField.includes(key)) {
			splitString = queryObject[key].split(",");
			for (var i = 0; i < splitString.length; i++) {
				let field = key + "." + splitString[i];
				query.push({[field]:true});
			}
		}
		if (stringField.includes(key)) {
			let regexTerm = new RegExp((queryObject[key]), 'i');
			query.push({[key]:{$regex:regexTerm}});
		}
		if (crimeField.includes(key)) {
			let field = "crimes." + key;
			query.push({[field]:{$regex: new RegExp(queryObject[key], "i")}});	
		}
	}
	if (invalidKeys.length > 0) {
		var errMess = 'Bad request. Invalid query parameter'
		if (invalidKeys.length > 1)  {errMess = errMess + "s"}
		errMess = errMess + ":\n" + invalidKeys.toString();

		var err = new Error(errMess);
		err.status = 400;
		throw err;
	}

	return this.find({$and:query});
}

module.exports = mongoose.model('Episode', episodeSchema);