const UserModel = require("../../db/models/user.model");
const RoleModel = require("../../db/models/role.model");
const Helper = require("../helper/helper");

class UserController {
	static allUsers = Helper.catchAsyncError(async (req, res, next) => {
		const users = await UserModel.find().populate("role");
		Helper.resHandler(res, 200, true, users, "users fetched");
	});

	static getSingleUser = Helper.catchAsyncError(async (req, res, next) => {
		const user = await UserModel.findOne({ _id: req.params.id });
		if (!user) throw new Error("Invalid user Id");
		await user.populate("role");
		Helper.resHandler(res, 200, true, user, "user fetched");
	});
	static addUser = Helper.catchAsyncError(async (req, res, next) => {
		if (!req.body.role) {
			req.body.role = { name: "customer" };
		}
		const role = await RoleModel.findOne(req.body.role);
		if (!role) throw new Error("this Role not found");
		req.body.role = role._id;
		const user = await UserModel.create(req.body);
		Helper.resHandler(res, 200, true, user, "user created");
	});
	static editUser = Helper.catchAsyncError(async (req, res) => {
		if (req.body.role) {
			req.body.role = await RoleModel.findOne({ name: req.body.role });
		}
		const user = await UserModel.findByIdAndUpdate(
			{ _id: req.params.id },
			req.body,
			{ new: true },
		);
		Helper.resHandler(res, 200, true, user, "user created");
	});
	static deleteUser = Helper.catchAsyncError(async (req, res) => {
		await UserModel.findByIdAndDelete({ _id: req.params.id });
		Helper.resHandler(res, 200, true, null, "user created");
	});
	static me = Helper.catchAsyncError((req, res) => {
		Helper.resHandler(res, 200, true, req.user, "user fetched");
	});

	static register = async (req, res) => {
		try {
			const role = await RoleModel.create({
				name: "admin",
				type: "admin",
				urls: [
					{
						url: "/api/v1/user",
						methods: {
							POST: "POST",
							PATCH: "PATCH",
						},
					},
				],
			});
			const user = await UserModel.create({
				fName: "abdulrhman",
				lname: "ashraf",
				email: "admin@gmail.com",
				password: "12345678",
				role: role._id,
			});
			Helper.resHandler(res, 200, true, user, "user register");
		} catch (error) {
			Helper.resHandler(res, 500, false, error, error.message);
		}
	};
}
module.exports = UserController;
