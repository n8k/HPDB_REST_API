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
	poirotCompulsiveBehavior: 	Boolean,	// Poirot exhibits some nervous, compulsive behavior
	poirotIsReallyBelgian: 			Boolean,	// Poirot is mistaken for French and informs them he's Belgian
	poirotAvuncular: 						Boolean,	// Poirot assumes a protective role of a younger lady
	poirotCommitsCrime:					Boolean,	// Poirot commits a crime
	poirotSmitten:  						Boolean,	// Poirot in love
	poirotLenientJudgeAndJury: 	Boolean,	// Poirot solves the case, but does not punish the perpetrators
	poirotSolvesColdCase: 			Boolean,	// Poirot solves an old case
	poirotMatchmaker: 					Boolean,	// Poirot plays matchmaker and pairs a new couple
	poirotRetirement: 					Boolean,	// Poirot retires
	poirotDentist: 							Boolean,	// Poirot visits the dentist
	hastingsGolf: 							Boolean,	// Hastings shows an interest in golf
	hastingsCar:  							Boolean,	// Hastings shows an interest in cars
	hastingsSmitten: 						Boolean,	// Hastings in love
	msLemonsFilingSystem: 			Boolean,	// Ms. Lemon's filing system is featured in the episode
	msLemonSupernatural: 				Boolean,	// Ms. Lemon shows interest or ability in the supernatural, occult or playacting/deception.
	artImitatesArt:							Boolean,	// Episode involves a murder-mystery play or novel
	hostIsMurdered: 						Boolean,	// The host of a party or invite is murdered at, during, or after the event
	bonVoyage: 									Boolean,	// Crime scene is on a train, plane, or boat
	frenchVsEnglishCuisine:			Boolean,	// Running jokes in episode about British vs. French food
	perpTriesToOutmartPoirot: 	Boolean,	// Perpetrator intentionally involves Poirot as part of the plot
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
return new Promise(
	(resolve, reject) => {
		this.find({})
		.then(
			(episodeList) => {
				let query = [];
				for (var i = episodeList.length - 1; i >= 0; i--) {
					for (var j = episodeList[i].crimes.length - 1; j>=0; j--){
						let compareString = episodeList[i].crimes[j].criminalAct.toUpperCase();
						if (compareString.includes(crime.toUpperCase())) {
							query.push(episodeList[i]._id.toString());
						}
					}
				}
				resolve(this.findByIdList(query));
			})
		.catch(err => console.log(err))
	})
}

module.exports = mongoose.model('Episode', episodeSchema);