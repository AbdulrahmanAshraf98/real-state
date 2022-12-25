const mongoose = require("mongoose");
const validator = require("validator");
const { hash, validatePassword } = require("../../app/helper/crypt.helper");
const { generateJwtToken } = require("../../app/helper/jwttoken.helper");

const userSchema = mongoose.Schema(
	{
		fName: {
			type: String,
			trim: true,
			lowercase: true,
			minLength: 5,
			maxLength: 20,
			required: true,
		},
		lname: {
			type: String,
			trim: true,
			lowercase: true,
			minLength: 5,
			maxLength: 20,
			required: true,
		},
		age: {
			type: Number,
			min: 18,
			default: 18,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			validate: function () {
				if (!validator.isEmail(this.email)) throw new Error("Invalid email");
			},
		},
		password: {
			type: String,
			lower: true,
			trim: true,
			required: true,
		},
		Phone: [
			{
				type: String,
				validate(value) {
					if (!validator.isMobilePhone(value, "ar-EG"))
						throw new Error("invalid number");
				},
			},
		],
		gender: {
			type: String,
			trim: true,
			lowercase: true,
			enum: ["male", "female"],
		},
		dOfBirth: {
			type: Date,
		},
		tokens: [
			{
				token: { type: String, required: true },
			},
		],
		role: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Role",
		},
	},
	{
		timestamps: true,
	},
);

userSchema.pre("save", async function () {
	if (this.isModified("password")) {
		this.password = await hash(this.password, 10);
	}
});
userSchema.statics.loginUser = async (email, password) => {
	const user = await User.findOne({ email });
	console.log(password);
	if (!user) return new Error("invalid Email");
	if (!validatePassword(password, user.password))
		throw new Error("invalid password");
	return user;
};

userSchema.methods.generateToken = async function () {
	const user = this;
	const token = generateJwtToken({ _id: user._id });
	user.tokens.push({ token });
	await user.save();
	return token;
};

userSchema.methods.toJSON = function () {
	const data = this.toObject();
	delete data.password;
	// delete data.tokens
	return data;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
