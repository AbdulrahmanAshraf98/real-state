const UserModel = require("../../db/models/user.model");
const RoleModel = require("../../db/models/role.model");
const Helper = require("../helper/helper");
const ModelHelper = require("../helper/model.helper");
class UserController {
	static allUsers = Helper.catchAsyncError(async (req, res, next) => {
		const users = await UserModel.find({}).populate({path:"role",select:"name type"});
		
		Helper.resHandler(res, 200, true, users, "users fetched");
	});

	static getSingleUser = Helper.catchAsyncError(async (req, res, next) => {
		const user = await ModelHelper.findOne(UserModel, { _id: req.params.id });
		if (!user) throw new Error("Invalid user Id");
		await user.populate("role");
		Helper.resHandler(res, 200, true, user, "user fetched");
	});
	static addUser = Helper.catchAsyncError(async (req, res, next) => {
		if(req.user.role.type=="employee")
		{
			if(req.body.roleType=="admin")throw new Error("you can not create a admin user");
			req.body.role= {type:"customer"};
			
		}
		else{
			req.body.role={name:req.body.roleName,type:req.body.roleType}
		}
		
		const role = await ModelHelper.findOne(RoleModel, req.body.role);
		if (!role) throw new Error("this Role not found");
		
		req.body.role = role._id;
		const user = await ModelHelper.createOne(UserModel, req.body);
		Helper.resHandler(res, 200, true, user, "user created");
	});
	static editUser = Helper.catchAsyncError(async (req, res) => {
		
		if (req.body.role) {
			if(req.user.role.type!="admin")
			throw new Error("admin only can edit role");
			req.body.role = await ModelHelper.findOne(RoleModel, {
				name: req.body.role,
			});
			
			
		}
		const user = await ModelHelper.updateOne(
			UserModel,
			{ _id: req.params.id },
			req.body,
		);

		Helper.resHandler(res, 200, true, user, "user updated");
	});
	static deleteUser = Helper.catchAsyncError(async (req, res) => {
		await ModelHelper.deleteOne(UserModel, { _id: req.params.id });
		Helper.resHandler(res, 200, true, null, "user deleted");
	});
	static me = Helper.catchAsyncError((req, res) => {
		Helper.resHandler(res, 200, true, req.user, "user fetched");
	});
}
module.exports = UserController;
