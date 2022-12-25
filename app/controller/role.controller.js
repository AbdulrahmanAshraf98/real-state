const RoleModel = require("../../db/models/role.model");
const Helper = require("../helper/helper");
const helper = require("../helper/helper");

class RoleController {
	static allRoles = async (req, res) => {
		try {
			const roles = await RoleModel.find();
			helper.resHandler(res, 200, true, roles, "all roles fetched");
		} catch (error) {
			helper.resHandler(res, 500, false, error, error.message);
		}
	};

	static getSingleRole = Helper.catchAsyncError(async (req, res) => {
		const role = await RoleModel.findOne({ name: req.params.roleName });
		helper.resHandler(res, 200, true, role, "role fetched");
	});
	static addRole = Helper.catchAsyncError(async (req, res) => {
		const role = await RoleModel.create(req.body);
		helper.resHandler(res, 200, true, role, "role created");
	});
	static editRole = Helper.catchAsyncError(async (req, res) => {
		const role = await RoleModel.findOneAndUpdate(
			{ name: req.params.roleName },
			req.body,
			{ new: true },
		);
		helper.resHandler(res, 200, true, role, "role edit");
	});
	static deleteRole = Helper.catchAsyncError(async (req, res) => {
		await RoleModel.deleteOne({
			name: req.params.roleName,
		});
		helper.resHandler(res, 200, true, "", "role deleted");
	});
	static deleteALlRoles = Helper.catchAsyncError(async (req, res) => {
		await RoleModel.deleteMany();
		helper.resHandler(res, 200, true, "", "all roles deleted");
	});
	//under testing
	static addNewUrlToRole = Helper.catchAsyncError(async (req, res) => {
		const role = await RoleModel.findOne({ name: req.params.roleName });
		role.urls.urls.push(req.body);
		role.save();
		helper.resHandler(res, 200, true, "", "all roles deleted");
	});
	static addNewMethodToRole = Helper.catchAsyncError(async (req, res) => {
		const role = await RoleModel.findOne({ name: req.params.roleName });
		role.urls.urls.methods = { ...role._doc.urls.urls.methods, ...req.body };
		role.save();
		helper.resHandler(res, 200, true, "", "all roles deleted");
	});
	static removeMethodFromRole = Helper.catchAsyncError(async (req, res) => {
		const role = await RoleModel.findOne({ name: req.params.roleName });
		delete role.urls.urls.methods.methods[req.body.methodName];
		role.save();
		helper.resHandler(res, 200, true, "", "all roles deleted");
	});
}
module.exports = RoleController;
