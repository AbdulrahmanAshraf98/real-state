const router = require("express").Router();
const BuildingController = require("../app/controller/building.controller");
const { uploadImageBuffer } = require("../app/middleware/multer.middleware");
const {
	resizeMultiImageBuffer,
} = require("../app/middleware/resizeImages.middleware");
const upload = uploadImageBuffer();
const resizeProjectImage = resizeMultiImageBuffer(
	`public/uploads/buildings/`,
	"buildings",
	"name",
	{ width: 2000, height: 1200 },
);
const {
	auth,
	restrictTo,
	checkPermission,
} = require("../app/middleware/auth.middleware");

router
	.route("/")
	.get(BuildingController.allBuildings)
	.post(
		auth,
		upload.array("buildingImages", 5),
		resizeProjectImage,
		BuildingController.addBuilding,
	);

router
	.route("/:buildingId")
	.get(BuildingController.getSingleBuilding)
	.patch(
		auth,
		upload.array("buildingImages", 5),
		resizeProjectImage,
		BuildingController.editBuilding,
	)
	.delete(auth, BuildingController.deleteBuilding);

module.exports = router;
