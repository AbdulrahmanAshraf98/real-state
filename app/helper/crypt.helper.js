const bcryptjs = require("bcryptjs");

const hash = async (password, saltRound) => {
	return await bcryptjs.hash(password, saltRound);
};
const validatePassword = async (password, hashPassword) => {
	return await bcryptjs.compare(password, hashPassword);
};
module.exports = { hash, validatePassword };
