const router = require("express").Router();
const roleController = require("../app/controller/role.controller");
const {
	auth,
	restrictTo,
	checkPermission,
} = require("../app/middleware/auth.middleware");

router
	.route("/")
	.get(auth, roleController.allRoles)
	.post(auth, restrictTo("admin"), checkPermission, roleController.addRole)
	.delete(auth, roleController.deleteALlRoles);
router
	.route("/:roleName")
	.get(auth, roleController.getSingleRole)
	.patch(auth, restrictTo("admin"), checkPermission, roleController.editRole)
	.delete(
		auth,
		restrictTo("admin"),
		checkPermission,
		roleController.deleteRole,
	);
router
	.route("/:roleName/newRoleUrl")
	.post(
		auth,
		restrictTo("admin"),
		checkPermission,
		roleController.addNewUrlToRole,
	);
router
	.route("/:roleName/method")
	.post(
		auth,
		restrictTo("admin"),
		checkPermission,
		roleController.addNewMethodToUrl,
	)
	.delete(
		auth,
		restrictTo("admin"),
		checkPermission,
		roleController.removeMethodFromRole,
	);
module.exports = router;
