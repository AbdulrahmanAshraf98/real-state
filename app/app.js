const express = require("express");
const app = express();
const userRoutes = require("../routes/user.routes");
const roleRoutes = require("../routes/role.routes");
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/role", roleRoutes);
app.all("*", (req, res) => {
	res.status(404).send({
		apisStatus: false,
		message: "Invalid URL",
		data: {},
	});
});
module.exports = app;
