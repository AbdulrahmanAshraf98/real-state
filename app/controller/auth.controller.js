const UserModel = require("../../db/models/user.model");
const RoleModel = require("../../db/models/role.model");
const helper = require("../helper/helper");

class AuthController {
	static login = async (req, res) => {
		try {
			// console.log(req.body);
			const userData = await UserModel.loginUser(
				req.body.email,
				req.body.password,
			);
			const token = await userData.generateToken();
			helper.resHandler(
				res,
				200,
				true,
				{ user: userData, token },
				"user added successfully",
			);
		} catch (error) {
			helper.resHandler(res, 500, false, error, error.message);
		}
	};
}
module.exports = AuthController;
