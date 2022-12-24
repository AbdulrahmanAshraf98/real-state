const mongoose = require("mongoose");
const connectToMongoDb = async function main() {
	await mongoose.connect(process.env.MONGODB_URL, () => {
		console.log("connected");
	});
};
module.exports = connectToMongoDb;
