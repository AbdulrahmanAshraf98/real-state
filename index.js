require("dotenv").config();
const app = require("./app/app");
const connectToMongoDb = require("./db/connection");

connectToMongoDb().catch((error) => console.error(error));
