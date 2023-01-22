const mongoose = require("mongoose");
const buildingScheme = mongoose.Schema({
	name: {
		type: String,
		unique: [true, "building name used before"],
		trim: true,
		lowercase: true,
		minLength: [3, "building name must be more than 3 characters"],
		maxLength: [20, "building name must be less than 20 characters"],
		required: [true, "building name is required"],
	},
	projectId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Project",
		required: [true, "must have a  project id"],
	},
	buildNumber: Number,
	floorNum: { type: Number, default: 0, max: 3 },
	units: {
		type: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Unit",
				required: [true, "must have a unit id "],
			},
		],
		default: [],
	},
	buildingImages: { type: [String], max: 5 },
});
buildingScheme.pre("save", function () {
	if (this.units.length == this.floorNum * 4) {
		this.floorNum++;
	}
});
buildingScheme.pre(/^find/, function (next) {
	this.populate({ path: "units", select: "-buildingId" });
	next();
});

const Building = mongoose.model("Building", buildingScheme);
module.exports = Building;
