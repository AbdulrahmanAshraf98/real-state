const UserModel = require("../../db/models/user.model");
const helper = require("../helper/helper");

class UserController {
	static allUsers = async (req, res) => {
		try {
			const users = await UserModel.find();
			helper.resHandler(res, 200, true, users, "users fetched");
		} catch (error) {
			helper.resHandler(res, 500, false, e, e.message);
		}
	};

	static getSingleUser = async (req, res) => {
		try {
			const user = await UserModel.find({ _id: req.param.id });
			helper.resHandler(res, 200, true, user, "user fetched");
		} catch (error) {
			helper.resHandler(res, 500, false, e, e.message);
		}
	};
	static addUser = async (req, res) => {
		try {
			const user = await UserModel.create(req.body);
			helper.resHandler(res, 200, true, user, "user created");
		} catch (error) {
			helper.resHandler(res, 500, false, e, e.message);
		}
	};
	static editUser = async (req, res) => {
		try {
			const user = await UserModel.findByIdAndUpdate(
				{ _id: req.params.id },
				req.body,
				{ new: true },
			);
			helper.resHandler(res, 200, true, user, "user created");
		} catch (error) {
			helper.resHandler(res, 500, false, e, e.message);
		}
	};
	static deleteUser = async (req, res) => {
		try {
			await UserModel.findByIdAndDelete({ _id: req.params.id });
			helper.resHandler(res, 200, true, user, "user created");
		} catch (error) {
			helper.resHandler(res, 500, false, e, e.message);
		}
	};
	static me = async (req, res) => {
		try {
			helper.resHandler(res, 200, true, req.user, "user fetched");
		} catch (error) {
			helper.resHandler(res, 500, false, e, e.message);
		}
	};
}
module.exports = UserController;
