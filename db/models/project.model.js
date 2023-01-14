const mongoose = require("mongoose");
const projectScheme = mongoose.Schema({
	name: {
		type: String,
		unique: [true, "project name used before"],
		trim: true,
		lowercase: true,
		minLength: [3, "project name must be more than 3 characters"],
		maxLength: [20, "project name must be less than 20 characters"],
		required: [true, "project name is required"],
	},
	type: {
		type: String,
		trim: true,
		lowercase: true,
		enum: ["show", "buy"],
		required: [true, "project type is required"],
	},
	buildings: {
		type: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Building",
			},
		],
		default: [],
	},
	createdBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	updatedBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
	projectImages: { type: [String], max: 5 },
});
projectScheme.pre(/^find/, function (next) {
	this.populate({ path: "buildings", select: "-projectId" });
	next();
});
const Project = mongoose.model("Project", projectScheme);
module.exports = Project;
