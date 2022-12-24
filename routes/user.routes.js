const router = require("express").Router();
const UserController = require("../app/controller/user.controller");

router.route("/").get(UserController.allUsers).post(UserController.addUser);

router
	.route("/:id")
	.post(UserController.getSingleUser)
	.patch(UserController.editUser)
	.delete(UserController.deleteUser);
module.exports = router;
