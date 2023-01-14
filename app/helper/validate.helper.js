const validator = require("validator");
class ValidateHelper {
	static validatePassword = (password) =>
		validator.isStrongPassword(password, {
			minLength: 8,
			minUppercase: 1,
			minLowercase: 1,
			minNumbers: 4,
			minSymbols: 1,
		});
	static validateEmail = (email) => validator.isEmail(email);
	static validateMobilePhone = (mobilePhone) =>
		validator.isMobilePhone(mobilePhone, "ar-EG");
	static validateName = (name) => (name.split(" ").length === 1 ? true : false);
}
module.exports=ValidateHelper;