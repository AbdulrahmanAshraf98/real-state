const UserModel = require("../../db/models/user.model");
const Helper = require("../helper/helper");
const { decodedToken } = require("../helper/jwttoken.helper");

const auth = Helper.catchAsyncError(async (req, res, next) => {
	let token = req.header("Authorization");
	if (!token) throw new Error("must have a token");
	token = token.replace("Bearer ", "");
	const decoded = decodedToken(token);
	const userData = await UserModel.findOne({
		_id: decoded._id,
		"tokens.token": token,
	}).populate("role");
	if (!userData) throw new Error("unauthorized");
	req.user = userData;
	req.token = token;
	next();
});
const restrictTo = (...roles) =>
	Helper.catchAsyncError(async (req, res, next) => {
		if (!roles.includes(req.user.role.type)) throw new Error("unauthorized");
		next();
	});
const checkPermission = Helper.catchAsyncError(async (req, res, next) => {
	let validUrl;
	validUrl = req.user.role.urls.find((item) => item.url == req.baseUrl);
	if (!validUrl) throw new Error("unauthorized");
	if (!validUrl.methods[req.method]) throw new Error("unauthorized");
	next();
});

module.exports = { auth, restrictTo, checkPermission };
