const path = require("path");
const express = require("express");
const app = express();
const userRoutes = require("../routes/user.routes");
const meRoutes = require("../routes/me.routes");
const roleRoutes = require("../routes/role.routes");
const projectRoutes = require("../routes/project.routes");
const buildingRoutes = require("../routes/building.routes");
const unitRoutes = require("../routes/unit.routes");
const paymentRoutes = require("../routes/payment.routes");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "../public/uploads")));

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/me", meRoutes);
app.use("/api/v1/role", roleRoutes);
app.use("/api/v1/project", projectRoutes);
app.use("/api/v1/building", buildingRoutes);
app.use("/api/v1/unit", unitRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.all("*", (req, res) => {
	res.status(404).send({
		apisStatus: false,
		message: "Invalid URL",
		data: {},
	});
});
module.exports = app;
