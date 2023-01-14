const router = require("express").Router({ mergeParams: true });
const {
	uploadImage,
	uploadImageBuffer,
} = require("../app/middleware/multer.middleware");
// const upload = uploadImage(`public/uploads/users/`, "users");
const upload = uploadImageBuffer();
const MeController = require("../app/controller/me.controller");
const UnitController = require("../app/controller/unit.controller");
const { auth } = require("../app/middleware/auth.middleware");
const {
	resizeUserImageBuffer,
} = require("../app/middleware/resizeImages.middleware");
const resizeProfileImage = resizeUserImageBuffer(
	`public/uploads/users/`,
	"users",
);
const injectUserIdInRequestBody = (req, res, next) => {
	req.body.userId = req.user._id;
	next();
};

router.use(auth);
router.route("/").get(MeController.me).patch(MeController.updateMe);
router.route("/updatePassword").post(MeController.changePassword);
router.route("/changeEmail").post(MeController.changeEmail);
router
	.route("/changeProfileImage")
	.patch(
		upload.single("photo"),
		resizeProfileImage,
		MeController.changeProfileImage,
	);
router
	.route("/myUnit")
	.get(injectUserIdInRequestBody, UnitController.getUserUnits);

module.exports = router;
