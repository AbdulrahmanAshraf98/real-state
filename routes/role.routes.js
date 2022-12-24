const router = require("express").Router();
const roleController = require("../app/controller/role.controller");

router
	.route("/")
	.get(roleController.allRoles)
	.post(roleController.addRole)
	.delete(roleController.deleteALlRoles);
router
	.route("/:roleName")
	.get(roleController.getSingleRole)
	.patch(roleController.editRole)
	.delete(roleController.deleteRole);

module.exports = router;
