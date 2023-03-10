const UserModel = require("../../db/models/user.model");
const RoleModel = require("../../db/models/role.model");
const Helper = require("../helper/helper");
const ModelHelper = require("../helper/model.helper");
const sendEmail = require("../helper/email.helper");

class AuthController {
	static login = async (req, res) => {
		try {
			const user = await UserModel.loginUser(req.body.email, req.body.password);
			const token = await user.generateToken();
			Helper.SendUserToken(user, token, "user login successfully", req, res);
			
		} catch (error) {
			Helper.resHandler(res, 500, false, error, error.message);
		}
	};
	//forgetPassword
	static forgetPassword = Helper.catchAsyncError(async (req, res, next) => {
		const user = await ModelHelper.findOne(UserModel, {
			email: req.body.email,
		});

		if (!user) throw new Error("there no user with this email ");
		const resetToken = await user.generateResetToken();
		const resetUrl = `${req.protocol}://${req.get(
			"host",
		)}/api/v1/user/resetPassword/${resetToken}`;
		const massage =
			"Forget your password ? submit  a patch request  with your new password and password confirm";
		try {
			await sendEmail({
				email: user.email,
				subject: "reset password  valid for 10 m",
				massage,
				text: resetUrl,
			});
		} catch (error) {
			user.passwordResetToken = undefined;
			user.passwordResetExpires = undefined;
			user.save();
			throw new Error(error);
		}
		Helper.resHandler(res, 200, true, null, "resetToken send to email");
	});
	static resetPassword = Helper.catchAsyncError(async (req, res, next) => {
		const hashToken = crypto
			.createHash("sha256")
			.update(req.params.token)
			.digest("hex");
		const user = await ModelHelper.findOne(UserModel, {
			passwordResetToken: hashToken,
			passwordResetExpires: { $gt: Date.now() },
		});
		if (!user) throw new Error("token is invalid or expired ", 400);
		user.password = req.body.password;
		user.passwordResetToken = undefined;
		user.passwordResetExpires = undefined;
		await user.save();
		Helper.SendUserToken(user, token, "resetPassword successfully", req, res);
	});
      static logout =Helper.catchAsyncError(async (req, res, next)=>{
            req.user.tokens = req.user.tokens.filter(
                t => t.token != req.token 
            )
            await req.user.save()
            Helper.resHandler(res, 200, true,null,"logged out")
      

    })
    static logoutAll = Helper.catchAsyncError(async (req, res, next)=>{
            req.user.tokens = []
            await req.user.save()
            Helper.resHandler(res, 200, true,null,"logged out")
    })
}
module.exports = AuthController;
