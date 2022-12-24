const UserController = require("../app/controller/user.controller");

const router = require("mongoose").Router;

router.route("/").get(UserController.allUsers).post(UserController.addUser);

router
	.route("/:id")
	.post(UserController.getSingleUser)
	.patch(UserController.editUser)
	.delete(UserController.deleteUser);
module.exports = router;
