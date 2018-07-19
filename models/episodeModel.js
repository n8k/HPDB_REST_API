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
	poirotOnHoliday: 						Boolean,	// Setting is Poirot on holiday
	poirotTriesToPreventMurder: Boolean,	// Poirot tries to prevent murder
	poirotTriesToPreventCrime:  Boolean,	// Poirot tries to prevent other crime
	poirotCompulsiveSymmetry: 	Boolean,	// Poirot exhibits a compulsive obsession with symmetry and straightening items
	poirotIsReallyBelgian: 			Boolean,	// Poirot is mistaken for French and informs them he's Belgian
	poirotAvuncular: 						Boolean,	// Poirot assumes a protective role of a younger lady
	poirotCommitsCrime:					Boolean,	// Poirot commits a crime
	poirotSmitten:  						Boolean,	// Poirot in love
	poirotLenientJudgeAndJury: 	Boolean,	// Poirot solves the case or exposes a crime but does not punish the perpetrators
	poirotSolvesColdCase: 			Boolean,	// Poirot solves an old case
	poirotMatchmaker: 					Boolean,	// Poirot plays matchmaker and pairs a new couple
	poirotRetirement: 					Boolean,	// Poirot retires
	poirotDentist: 							Boolean,	// Poirot visits the dentist
	hastingsGolf: 							Boolean,	// Hastings shows an interest in golf
	hastingsCar:  							Boolean,	// Hastings shows an interest in cars
	hastingsHobby: 							Boolean,  // Hastings takes up a hobby
	hastingsSmitten: 						Boolean,	// Hastings in love
	hastingsLadyPuzzlement:  		Boolean,  // Hastings doesn't understand women
	hastingsSolvesCase: 				Boolean,  // Hastings solves the case
	hastingsTravel: 						Boolean,  // Hastings travels abroad
	msLemonsFilingSystem: 			Boolean,	// Ms. Lemon's filing system is featured in the episode
	msLemonSupernatural: 				Boolean,	// Ms. Lemon shows interest or ability in the supernatural or occult
	msLemonOrderAndMethod: 			Boolean,  // Ms. Lemon does detective work
	artImitatesArt:							Boolean,	// Episode involves a murder-mystery play or novel
	hostIsMurdered: 						Boolean,	// The host of a party or invite is murdered at, during, or after the event
	bonVoyage: 									Boolean,	// Crime scene is on a train, plane, or boat
	frenchVsEnglishCuisine:			Boolean,	// Running jokes in episode about British vs. French food
	perpTriesToOutmartPoirot: 	Boolean,	// Perpetrator intentionally involves Poirot as part of the plot
	diggingUpThePast: 					Boolean,  // Setting is in an archaeological dig in the Middle East
	bridgeGame: 								Boolean,  // People play the card game Bridge
	christmasSpecial:						Boolean		// Christmas episode
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
	return this.find({"_id":{$in:[arrayOfIds]}});
}

episodeSchema.statics.findMainCharacter = function(name) {
	let query = "mainCharacters." + name;
	return this.find({[query]:true});
}

episodeSchema.statics.findSeason = function(season) {
	return this.find({"season":[season]});
}

episodeSchema.statics.findEpisode = function(season,episode) {
	return this.find({
		"season": [season],
		"episode":[episode]
	});
}

episodeSchema.statics.findTrope = function(tropeType) {
	let query = "tropes." + tropeType;
	return this.find({[query]:true});
}

episodeSchema.statics.regexSearch = function(field, searchTerm) {
	let regexTerm = new RegExp((searchTerm), 'i');
	return this.find({[field]:{$regex:regexTerm}});	
}

episodeSchema.statics.findCrime = function(crime) {
	let regexTerm = new RegExp((crime), 'i');
	return this.find({'crimes.criminalAct':{$regex:regexTerm}
	})
}

module.exports = mongoose.model('Episode', episodeSchema);