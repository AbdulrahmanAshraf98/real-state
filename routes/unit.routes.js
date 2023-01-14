const router = require("express").Router();
const UnitController = require("../app/controller/unit.controller");
const { uploadImageBuffer } = require("../app/middleware/multer.middleware");
const {
	resizeMultiImageBuffer,
} = require("../app/middleware/resizeImages.middleware");
const upload = uploadImageBuffer();
const resizeProjectImage = resizeMultiImageBuffer(
	`public/uploads/units/`,
	"units",
	{ width: 2000, height: 1200 },
);
const {
	auth,
	restrictTo,
	checkPermission,
} = require("../app/middleware/auth.middleware");

router
	.route("/")
	.get(UnitController.allUnits)
	.post(
		auth,
		restrictTo("employee", "admin"),
		checkPermission,
		upload.array("unitImages", 5),
		resizeProjectImage,
		UnitController.addUnit,
	);
router
	.route("/:unitId")
	.get(UnitController.getSingleUnit)
	.patch(
		auth,
		restrictTo("employee", "admin"),
		checkPermission,
		upload.array("unitImages", 5),
		resizeProjectImage,
		UnitController.editUnit,
	)
	.delete(
		auth,
		restrictTo("admin"),
		checkPermission,
		UnitController.deleteUnit,
	);
router
	.route("/sellUnit")
	.post(
		auth,
		restrictTo("employee", "admin"),
		checkPermission,
		UnitController.sellUnit,
	);
router
	.route("/newPaymentAmount")
	.post(
		auth,
		restrictTo("employee", "admin"),
		checkPermission,
		UnitController.newPaymentPaidAmount,
	);

module.exports = router;
