const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;
const userRoutes = require("../routes/user.routes");

app.use(userRoutes);
app.all("*", (req, res) => {
	res.status(404).send({
		apisStatus: false,
		message: "Invalid URL",
		data: {},
	});
});
module.exports = app;
