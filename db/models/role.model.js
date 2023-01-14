const mongoose = require("mongoose");
const roleScheme = mongoose.Schema({
	name: {
		type: String,
		unique: [true, "role name used before"],
		trim: true,
		lowercase: true,
		minLength: [3, "role name must be more than 3 characters"],
		maxLength: [20, "role name must be less than 20 characters"],
		required: [true, "role name is required"],
	},
	type: {
		type: String,
		trim: true,
		lowercase: true,
		enum: ["admin", "employee", "customer"],
		default: "customer",
		required: [true, "role name is required"],
	},
	urls: [
		{
			url: String,
			methods: Object,
			params: Object,
			query: Object,
		},
	],
});
const Role = mongoose.model("Role", roleScheme);
module.exports = Role;
