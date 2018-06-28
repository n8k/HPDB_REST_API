const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
	poirotInsultsSelf: 										Boolean,
	special: 															Boolean,
	poirotInvitedToCrimeScene: 						Boolean,
	tryToOutsmartWorldsGreatestDetective: Boolean,
	poirotLenientJudgeAndJury: 						Boolean
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

episodeSchema.statics.findMainCharacter = function(name) {
	let query = "mainCharacters." + name;
	return this.find({[query]:true});
}

module.exports = mongoose.model('Episode', episodeSchema);