require("dotenv").config();
const app = require("./app/app");
const connectToMongoDb = require("./db/connection");

const PORT = process.env.PORT || 8080;
connectToMongoDb().catch((error) => console.error(error));
app.listen(PORT, () => {
	console.log(`App Running in Port :${PORT}`);
});