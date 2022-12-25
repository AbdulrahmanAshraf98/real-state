const jwt = require("jsonwebtoken");

const generateJwtToken = (payload) => {
	return jwt.sign(payload, process.env.Jwt_PRIVATE_KEY);
};
const decodedToken = (token) => {
	return jwt.verify(token, process.env.Jwt_PRIVATE_KEY);
};

module.exports = { generateJwtToken, decodedToken };
