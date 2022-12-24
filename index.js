require("dotenv").config();
const app = require("./app/app");
const connectToMongoDb = require("./db/connection");

connectToMongoDb().catch((error) => console.error(error));
app.listen(PORT, () => {
	console.log(`App Running in Port :${PORT}`);
});