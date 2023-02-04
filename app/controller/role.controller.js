const RoleModel = require("../../db/models/role.model");
const ArrayHelper = require("../helper/array.helper");
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
		console.log(role)
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
	static getRoleUrls= Helper.catchAsyncError(async (req, res) => {
		const role = await RoleModel.findOne({ name: req.params.roleName });
		if(!role)throw new Error("role not found");
		helper.resHandler(res, 200, true, role.urls, "role urls fetched  successfully");
	});
	static editRoleUrl=Helper.catchAsyncError(async (req, res) => {
		const role = await RoleModel.findOne({ name: req.params.roleName });
		if(!role)throw new Error("role not found");
		const urlIndex = ArrayHelper.getIndexOfObject(role._doc.urls, "_id", urlId);
		if (urlIndex < 0) throw new Error("invalid url id");
		role._doc.urls[urlIndex].url =req.body.url;
		await role.save();
		helper.resHandler(res, 200, true, role, "edit role url  successfully");
	});
	static addNewUrlToRole = Helper.catchAsyncError(async (req, res) => {
		const role = await RoleModel.findOne({ name: req.params.roleName });
		if(!role)throw new Error("role not found");
		role.urls.push(req.body);
		role.save();
		helper.resHandler(res, 200, true, "", "url add to role successfully");
	});
	
	static addNewMethodToUrl = Helper.catchAsyncError(async (req, res) => {
		const urlId = req.body.urlId;
		const role = await RoleModel.findOne({
			name: req.params.roleName,
		});
		if(!role)throw new Error("role not found");
		const urlIndex = ArrayHelper.getIndexOfObject(role._doc.urls, "_id", urlId);
		if (urlIndex < 0) throw new Error("invalid url id");
		role._doc.urls[urlIndex].methods[req.body.method.toUpperCase()] =
			req.body.method.toUpperCase();
		await role.save();
		helper.resHandler(res, 200, true, role, "method add to  url successfully");
	});
	static removeMethodFromRole = Helper.catchAsyncError(async (req, res) => {
		const urlId = req.body.urlId;
		let role = await RoleModel.findOne({
			name: req.params.roleName,
		});
		if(!role)throw new Error("role not found");
		console.log(role)
		const urlIndex = ArrayHelper.getIndexOfObject(role._doc.urls, "_id", urlId);
		if (urlIndex < 0) throw new Error("invalid url id");
		delete role._doc.urls[urlIndex].methods[req.body.method.toUpperCase()];
		await role.save();	
		helper.resHandler(
			res,
			200,
			true,
			role,
			"method removed to  url successfully",
		);
	});
	static removeUrlFromRole = Helper.catchAsyncError(async (req, res) => {
		const urlId = req.params.urlId;
		const role = await RoleModel.findOne({
			name: req.params.roleName,
		});
		if(!role)throw new Error("role not found");
		role.urls=role._doc.urls.filter(url=>url.id!=urlId);
		await role.save();
		helper.resHandler(
			res,
			200,
			true,
			role,
			" url  removed successfully",
		);
	});
	
}
module.exports = RoleController;
