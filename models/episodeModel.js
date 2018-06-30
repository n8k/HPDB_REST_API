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
	poirotOnHoliday: 											String,
	poirotTriesToPreventMurder: 					String,
	poirotCompulsiveBehavior: 						String,
	poirotIsReallyBelgian: 								String,
	poirotInvitedToCrimeScene: 						String,
	tryToOutsmartWorldsGreatestDetective: String,
	poirotLenientJudgeAndJury: 						String,
	hastingsGolf: 												String,
	frenchVsEnglishCuisine:								String,
	poirotSolvesColdCase: 								String,
	special: 															String
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

episodeSchema.statics.findCrime = function(crime) {
return new Promise(
	(resolve, reject) => {
		this.find({})
		.then(
			(episodeList) => {
				let query = [];
				for (var i = episodeList.length - 1; i >= 0; i--) {
					for (var j = episodeList[i].crimes.length - 1; j>=0; j--){
						if (episodeList[i].crimes[j].criminalAct.includes(crime)) {
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