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
	poirotOnHoliday: 											Boolean,
	poirotTriesToPreventMurder: 					Boolean,
	poirotCompulsiveBehavior: 						Boolean,
	poirotIsReallyBelgian: 								Boolean,
	poirotInvitedToCrimeScene: 						Boolean,
	tryToOutsmartWorldsGreatestDetective: Boolean,
	poirotLenientJudgeAndJury: 						Boolean,
	hastingsGolf: 												Boolean,
	frenchVsEnglishCuisine:								Boolean,
	poirotSolvesColdCase: 								Boolean,
	special: 															Boolean
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
	director: 							{String},
	writer: 								{String},
	mood: 									{String},
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

// episodeSchema.statics.searchInTitle = function(searchTerm) {
// 	let regexTerm = new RegExp((searchTerm), 'i');
// 	return this.find({title:{$regex:regexTerm}});
// }

// episodeSchema.statics.searchInSummary = function(searchTerm) {
// 	let regexTerm = new RegExp((searchTerm), 'i');
// 	return this.find({episodeSummary:{$regex:regexTerm}});
// }

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