const BuildingModel = require("../../db/models/building.model");
const ProjectModel = require("../../db/models/project.model");
const UnitModel = require("../../db/models/unit.model");
const ArrayHelper = require("../helper/array.helper");
const Helper = require("../helper/helper");
const ModelHelper = require("../helper/model.helper");
const ApiFeatures = require("../helper/api.feature");
class BuildingController {
	static allBuildings = Helper.catchAsyncError(async (req, res, next) => {
		const apiFeatures = new ApiFeatures(BuildingModel.find(), req.query)
			.filter()
			.pagination()
			.selectedFields()
			.sort();
		const Buildings = await apiFeatures.query;
		Helper.resHandler(res, 200, true, Buildings, "Buildings fetched");
	});

	static getSingleBuilding = Helper.catchAsyncError(async (req, res, next) => {
		const buildingId = Helper.getIdFromRequest(req, "buildingId");
		if (!buildingId) throw new Error("must have a building id");
		
		const Building = await ModelHelper.findOne(BuildingModel, {
			_id: buildingId,
		});
		if (!Building) throw new Error("Invalid user Id");
		Helper.resHandler(res, 200, true, Building, "Building fetched");
	});
	static addBuilding = Helper.catchAsyncError(async (req, res, next) => {
		const projectId = Helper.getIdFromRequest(req, "projectId");
		if (!projectId) throw new Error("must have a project id");
		const project = await ModelHelper.findOne(ProjectModel, {
			_id: projectId,
		});
		if (!project) throw new Error("project not found ");
		const building = await ModelHelper.createOne(BuildingModel, {
			createdBy: req.user._id,
			...req.body,
		});
		project.buildings.push(building._id);
		await project.save();
		Helper.resHandler(res, 200, true, building, "Building created");
	});
	static editBuilding = Helper.catchAsyncError(async (req, res) => {
		const buildingId = Helper.getIdFromRequest(req, "buildingId");
		if (!buildingId) throw new Error("must have a building id");
		if(!req.body.buildingImages.length)delete req.body.buildingImages
		const Building = await ModelHelper.updateOne(
			BuildingModel,
			{
				_id: buildingId,
			},
			{ updateBy: req.user._id, ...req.body },
		);
		Helper.resHandler(res, 200, true, Building, "Building updated");
	});
	static deleteBuilding = Helper.catchAsyncError(async (req, res) => {
		const buildingId = Helper.getIdFromRequest(req, "buildingId");
		if (!buildingId) throw new Error("must have a building id");
		console.log(buildingId);
		const projectId = Helper.getIdFromRequest(req, "projectId");
		
		if (!projectId) throw new Error("must have a project id");
		const project = await ModelHelper.findOne(ProjectModel, {
			_id: projectId,
		});
		await ModelHelper.deleteOne(BuildingModel, { _id: buildingId });
		await ModelHelper.deleteALl(UnitModel, { buildingId: buildingId });
		project.buildings = ArrayHelper.deleteObjectFromArray(
			project._doc.buildings,
			"_id",
			buildingId,
		);
		await project.save();
		Helper.resHandler(res, 200, true, null, "building deleted");
	});
}
module.exports = BuildingController;
