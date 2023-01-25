const mongoose = require("mongoose");
const validator = require("validator");
const { hash, validatePassword } = require("../../app/helper/crypt.helper");
const { generateJwtToken } = require("../../app/helper/jwttoken.helper");
const ValidateHelper = require("../../app/helper/validate.helper");
var crypto = require('crypto');

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
		lName: {
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
				if (!ValidateHelper.validateEmail(this.email))
					throw new Error("Invalid email");
			},
		},
		password: {
			type: String,
			lower: true,
			trim: true,
			required: true,
			select: false,
		},
		Phone: [
			{
				type: String,
				validate: function () {
					if (!ValidateHelper.validatePassword(this.password))
						throw new Error("Invalid password");
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
		profileImage: {
			type:String,
			default:"default-avatar.jpg"
		},
		tokens: {
			type: [
				{
					token: { type: String, required: true },
				},
			],
			select: false,
		},
		role: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Role",
		},
	},
	{
		timestamps: true,
		toJSON: { virutals: true },
		toOBJECT: { virutals: true },
	},
);

userSchema.pre("save", async function () {
	if (this.isModified("password")) {
		this.password = await hash(this.password, 10);
	}
});
userSchema.statics.loginUser = async (email, password) => {
	const user = await User.findOne({ email }).select("+password +tokens");
	if (!user) throw new Error("invalid Email");
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

userSchema.methods.generateResetToken = async function () {
	const resetToken = crypto.randomBytes(32).toString("hex");
	this.passwordResetToken = crypto
		.createHash("sha256")
		.update(resetToken)
		.digest("hex");
	this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
	return this.passwordResetToken;
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
	delete data.tokens;
	return data;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
