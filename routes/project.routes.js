const router = require("express").Router();
const ProjectController = require("../app/controller/project.controller");
const { uploadImageBuffer } = require("../app/middleware/multer.middleware");
const {
	resizeMultiImageBuffer,
} = require("../app/middleware/resizeImages.middleware");
const upload = uploadImageBuffer();
const resizeProjectImage = resizeMultiImageBuffer(
	`public/uploads/projects/`,
	"projects",
	"projectImages",
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
	.get(ProjectController.allProjects)
	.post(
		auth,
		restrictTo("employee", "admin"),
		checkPermission,
		upload.array("projectImages", 5),
		resizeProjectImage,
		ProjectController.addProject,
	);

router
	.route("/:projectId")
	.get(ProjectController.getSingleProject)
	.patch(
		auth,
		restrictTo("employee", "admin"),
		checkPermission,
		upload.array("projectImages", 5),
		resizeProjectImage,
		ProjectController.editProject,
	)
	.delete(
		auth,
		restrictTo("admin"),
		checkPermission,
		ProjectController.deleteProject,
	);

module.exports = router;
