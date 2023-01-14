const mongoose = require("mongoose");
const unitScheme = mongoose.Schema({
	name: {
		type: String,
		unique: [true, "unit name name used before"],
		trim: true,
		lowercase: true,
		required: [true, "unit name is required"],
	},
	buildingId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Building",
		required: [true, "unit must be in a building "],
	},
	unitAddress: String,
	ownerId: {
		type: mongoose.Schema.Types.ObjectId,
	},
	price: { type: Number },
	status: {
		type: Boolean,
		default: false,
		required: function () {
			if (this.status) {
				if (!this.ownerId) {
					throw new Error("must have a owner id ");
				}
			}
		},
	},
	createdBy: {
		type: mongoose.Schema.Types.ObjectId,
	},
	updatedBy: {
		type: mongoose.Schema.Types.ObjectId,
	},
	unitImages: { type: [String], max: 5 },
});

const Unit = mongoose.model("Unit", unitScheme);
module.exports = Unit;
