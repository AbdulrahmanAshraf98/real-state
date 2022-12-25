const router = require("express").Router();
const AuthController = require("../app/controller/auth.controller");
const UserController = require("../app/controller/user.controller");
const {
	checkPermission,
	auth,
	restrictTo,
} = require("../app/middleware/auth.middleware");

router.route("/login").post(AuthController.login);
router.route("/register").get(UserController.register);

router
	.route("/")
	.get(
		auth,
		restrictTo("admin", "employee"),
		checkPermission,
		UserController.allUsers,
	)
	.post(
		auth,
		restrictTo("admin", "employee"),
		checkPermission,
		UserController.addUser,
	);

router
	.route("/:id")
	.get(
		auth,
		restrictTo("admin", "employee"),
		checkPermission,
		UserController.getSingleUser,
	)
	.patch(
		auth,
		restrictTo("admin", "employee"),
		checkPermission,
		UserController.editUser,
	)
	.delete(
		auth,
		restrictTo("admin"),
		checkPermission,
		UserController.deleteUser,
	);


	
module.exports = router;
