const router = require("express").Router();
const AuthController = require("../app/controller/auth.controller");
const UserController = require("../app/controller/user.controller");
const {
	checkPermission,
	auth,
	restrictTo,
} = require("../app/middleware/auth.middleware");

router.route("/login").post(AuthController.login);

router.route("/forgetPassword").post(AuthController.forgetPassword);

router.use(auth);
router.route("/logout").delete(AuthController.logout);
router.route("/logoutAll").delete(AuthController.logoutAll);
router.use(restrictTo("admin", "employee"));
router
	.route("/")
	.get(checkPermission, UserController.allUsers)
	.post(checkPermission, UserController.addUser);

router
	.route("/:id")
	.get(checkPermission, UserController.getSingleUser)
	.patch(checkPermission, UserController.editUser)
	.delete(restrictTo("admin"), checkPermission, UserController.deleteUser);


	
module.exports = router;
