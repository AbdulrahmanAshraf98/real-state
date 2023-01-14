const ProjectModel = require("../../db/models/project.model");
const UnitModel = require("../../db/models/unit.model");
const BuildingModel = require("../../db/models/building.model");
const Helper = require("../helper/helper");
const ModelHelper = require("../helper/model.helper");
const ApiFeatures = require("../helper/api.feature");
class ProjectController {
	static allProjects = Helper.catchAsyncError(async (req, res, next) => {
		const apiFeatures = new ApiFeatures(ProjectModel.find(), req.query)
			.filter()
			.pagination()
			.selectedFields()
			.sort();
		const projects = await apiFeatures.query;
		Helper.resHandler(res, 200, true, projects, "projects fetched");
	});

	static getSingleProject = Helper.catchAsyncError(async (req, res, next) => {
		const projectId = Helper.getIdFromRequest(req, "projectId");
		if (!projectId) throw new Error("must have a project id");
		const project = await ModelHelper.findOne(ProjectModel, {
			_id: projectId,
		});
		if (!project) throw new Error("Invalid project Id");
		Helper.resHandler(res, 200, true, project, "project fetched");
	});
	static addProject = Helper.catchAsyncError(async (req, res, next) => {
		const project = await ModelHelper.createOne(ProjectModel, {
			createdBy: req.user._id,
			...req.body,
		});
		Helper.resHandler(res, 200, true, project, "project created");
	});
	static editProject = Helper.catchAsyncError(async (req, res) => {
		const projectId = Helper.getIdFromRequest(req, "projectId");
		if (!projectId) throw new Error("must have a project id");
		const project = await ModelHelper.updateOne(
			ProjectModel,
			{
				_id: projectId,
			},
			{ updateBy: req.user._id, ...req.body },
		);
		Helper.resHandler(res, 200, true, project, "project updated");
	});
	static deleteProject = Helper.catchAsyncError(async (req, res) => {
		const projectId = Helper.getIdFromRequest(req, "projectId");
		if (!projectId) throw new Error("must have a project id");
		const project = await ModelHelper.findOne(ProjectModel, {
			_id: projectId,
		});
		await project.buildings.forEach(async (building) => {
			try {
				await building.units.forEach(async (unit) => {
					try {
						await ModelHelper.deleteOne(UnitModel, { _id: unit._id });
					} catch (err) {
						throw new Error(err);
					}
				});
				await ModelHelper.deleteOne(BuildingModel, { _id: building._id });
			} catch (e) {
				throw new Error(err);
			}
		});
		await ModelHelper.deleteOne(ProjectModel, { _id: projectId });
		Helper.resHandler(res, 200, true, null, "project deleted");
	});
	static uploadProjectImages = Helper.catchAsyncError(
		async (req, res, next) => {
			const projectId = Helper.getIdFromRequest(req, "projectId");
			if (!projectId) throw new Error("must have a project id");
			const project = await ModelHelper.findOne(ProjectModel, {
				_id: projectId,
			});
			if (!project) throw new Error("Invalid project Id");
			Helper.resHandler(res, 200, true, project, "project images added");
		},
	);
}
module.exports = ProjectController;
