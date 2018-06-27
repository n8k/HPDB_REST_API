const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var mainCharacters = new Schema({
	Poirot: 		{type: Boolean, default: true},
	Hastings: 	Boolean,
	Lemon: 			Boolean,
	Japp: 			Boolean,
	Oliver:			Boolean
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
	animal: 							  {applies: Boolean, typeOfAnimal: [String]} 
},
{timestamps: true}
);

module.exports = mongoose.model('Episode', episodeSchema);