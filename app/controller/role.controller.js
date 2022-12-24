const RoleModel = require("../../db/models/role.model");
const helper = require("../helper/helper");

class RoleController {
	static allRoles = async (req, res) => {
		try {
			const users = await RoleModel.find();
			helper.resHandler(res, 200, true, users, "all roles fetched");
		} catch (error) {
			helper.resHandler(res, 500, false, e, e.message);
		}
	};

	static getSingleRole = async (req, res) => {
		try {
			const user = await RoleModel.find({ name: req.params.roleName });
			helper.resHandler(res, 200, true, user, "role fetched");
		} catch (error) {
			helper.resHandler(res, 500, false, e, e.message);
		}
	};
	static addRole = async (req, res) => {
		try {
			const user = await RoleModel.create(req.body);
			helper.resHandler(res, 200, true, user, "role created");
		} catch (error) {
			helper.resHandler(res, 500, false, e, e.message);
		}
	};
	static editRole = async (req, res) => {
		try {
			const user = await RoleModel.findByIdAndUpdate(
				{ name: req.params.roleName },
				req.body,
				{ new: true },
			);
			helper.resHandler(res, 200, true, user, "role edit");
		} catch (error) {
			helper.resHandler(res, 500, false, e, e.message);
		}
	};
	static deleteRole = async (req, res) => {
		try {
			await RoleModel.findByIdAndDelete({ name: req.params.roleName });
			helper.resHandler(res, 200, true, "", "role deleted");
		} catch (error) {
			helper.resHandler(res, 500, false, e, e.message);
		}
	};
	static deleteALlRoles = async (req, res) => {
		try {
			await RoleModel.deleteMany();
			helper.resHandler(res, 200, true, "", "all roles deleted");
		} catch (error) {
			helper.resHandler(res, 500, false, e, e.message);
		}
	};
}
module.exports = RoleController;
