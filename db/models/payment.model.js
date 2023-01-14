const mongoose = require("mongoose");
const paymentScheme = mongoose.Schema({
	unit: {
		type: Object,
		required: true,
	},
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	employee: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	paymentMethod: {
		type: String,
		enum: ["month", "quarter", "half", "cash"],
		required: true,
	},
	numberOfYears: { type: Number, default: 0 },
	amountPaid: { type: Number, default: 0 },
	remainingAmount: { type: Number, default: 0 },
	totalPaidAmount: { type: Number, default: 0 },
	requiredAmount: { type: Number, default: 0 },
	createdAt: {
		type: Date,
		default: Date.now(),
	},
	updatedBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
	updatedAt: {
		type: Date,
		default: Date.now(),
	},
});

paymentScheme.pre("save", async function () {
	if (this.totalPaidAmount < this.unit.price) {
		this.totalPaidAmount += this.amountPaid;
		this.remainingAmount = this.unit.price - this.totalPaidAmount;
	}
	if (this.isModified("numberOfYears") || this.isModified("paymentMethod")) {
		if (this.paymentMethod == "month")
			this.requiredAmount = this.remainingAmount / 12;
		if (this.paymentMethod == "quarter")
			this.requiredAmount = this.remainingAmount / 4;
		if (this.paymentMethod == "half")
			this.requiredAmount = this.remainingAmount / 2;
		if (this.paymentMethod == "cash") this.requiredAmount = 0;
	}
	if (this.remainingAmount == 0) this.requiredAmount = 0;
});
paymentScheme.pre(/^find/, function (next) {
	this.populate({
		path: "owner",
		select: "fName lName email phone age",
	}).populate({
		path: "employee",
		select: "fName lName email ",
	});
	next();
});
paymentScheme.methods.toJSON = function () {
	const data = this.toObject();
	// delete data._id;
	delete data.createdAt;
	delete data.updatedAt;
	delete data.unit._id;
	delete data.unit.createdBy;
	delete data.unit.updatedBy;
	delete data.unit.__v;
	delete data.unit.ownerId;
	return data;
};
const payment = mongoose.model("Payment", paymentScheme);
module.exports = payment;
