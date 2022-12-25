const router = require("express").Router();
const roleController = require("../app/controller/role.controller");
const {
	auth,
	restrictTo,
	checkPermission,
} = require("../app/middleware/auth.middleware");

router
	.route("/")
	.get(
		auth,
		restrictTo("admin", "employee"),
		checkPermission,
		roleController.allRoles,
	)
	.post(auth, restrictTo("admin"), checkPermission, roleController.addRole)
	.delete(
		auth,
		restrictTo("admin"),
		checkPermission,
		roleController.deleteALlRoles,
	);
router
	.route("/:roleName")
	.get(
		auth,
		restrictTo("admin", "employee"),
		checkPermission,
		roleController.getSingleRole,
	)
	.patch(auth, restrictTo("admin"), checkPermission, roleController.editRole)
	.delete(
		auth,
		restrictTo("admin"),
		checkPermission,
		roleController.deleteRole,
	);

module.exports = router;
