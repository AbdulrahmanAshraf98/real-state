const UnitModel = require("../../db/models/unit.model");
const UserModel = require("../../db/models/user.model");
const BuildingModel = require("../../db/models/building.model");
const PaymentModel = require("../../db/models/payment.model");
const Helper = require("../helper/helper");
const ModelHelper = require("../helper/model.helper");
const ApiFeatures = require("../helper/api.feature");
class UnitController {
	static allUnits = Helper.catchAsyncError(async (req, res, next) => {
		const apiFeatures = new ApiFeatures(UnitModel.find(), req.query)
			.filter()
			.pagination()
			.selectedFields()
			.sort();
		const Units = await apiFeatures.query;
		Helper.resHandler(res, 200, true, Units, "Units fetched");
	});
	static getSingleUnit = Helper.catchAsyncError(async (req, res, next) => {
		const unitId = Helper.getIdFromRequest(req, "unitId");
		if (!unitId) throw new Error("must have a unit id");
		const unit = await ModelHelper.findOne(UnitModel, {
			_id: unitId,
		});
		if (!unit) throw new Error("Invalid Unit Id");
		Helper.resHandler(res, 200, true, unit, "Unit fetched");
	});

	static getEmployeeUnits = Helper.catchAsyncError(async (req, res, next) => {
		const employeeId = getIdFromRequest(req, "employeeId");
		if (!employeeId) throw new Error("must have a employee id");
		const unit = await ModelHelper.findAll(UnitModel, {
			createdBy: employeeId,
		});
		if (!unit) throw new Error("Invalid Unit Id");
		Helper.resHandler(res, 200, true, unit, "Unit fetched");
	});
	static getUserUnits = Helper.catchAsyncError(async (req, res, next) => {
		const userId = Helper.getIdFromRequest(req, "userId");
		if (!userId) throw new Error("must have a user id");
		const unit = await ModelHelper.findAll(UnitModel, {
			owner: userId,
		});
		if (!unit) throw new Error("Invalid owner Id");
		Helper.resHandler(res, 200, true, unit, "Unit fetched");
	});

	static addUnit = Helper.catchAsyncError(async (req, res, next) => {
		const buildingId = Helper.getIdFromRequest(req, "buildingId");
		if (!buildingId) throw new Error("must have a building id");
		const building = await ModelHelper.findOne(BuildingModel, {
			_id: buildingId,
		});
		if (!building) throw new Error("building not found ");
		const unitAddress = `b-${building.buildNumber}-f-${building.floorNum}-u-${req.body.unitNumber}`;
		const Unit = await ModelHelper.createOne(UnitModel, {
			createdBy: req.user._id,
			unitAddress,
			...req.body,
		});
		building.units.push(Unit._id);
		await building.save();
		Helper.resHandler(res, 200, true, Unit, "Unit created");
	});
	static editUnit = Helper.catchAsyncError(async (req, res) => {
		const unitId = Helper.getIdFromRequest(req, "unitId");
		if (!unitId) throw new Error("must have a unit id");
		const Unit = await ModelHelper.updateOne(
			UnitModel,
			{
				_id: unitId,
			},
			{ updateBy: req.user._id, ...req.body },
		);
		Helper.resHandler(res, 200, true, Unit, "Unit updated");
	});
	static deleteUnit = Helper.catchAsyncError(async (req, res) => {
		const unitId = Helper.getIdFromRequest(req, "unitId");
		const buildingId = Helper.getIdFromRequest(req, "buildingId");
		if (!unitId) throw new Error("must have a unit id");
		if (!buildingId) throw new Error("must have a building id");
		const building = await ModelHelper.findOne(BuildingModel, {
			_id: buildingId,
		});
		if (!building) throw new Error("building not found ");
		building.units = ArrayHelper.deleteObjectFromArray(
			building._doc.units,
			"_id",
			unitId,
		);
		await building.save();
		await ModelHelper.deleteOne(UnitModel, { _id: unitId });
		Helper.resHandler(res, 200, true, null, "user created");
	});
	static sellUnit = Helper.catchAsyncError(async (req, res, next) => {
		const unitId = Helper.getIdFromRequest(req, "unitId");
		if (!unitId) throw new Error("must have a unit id");
		if(!req.body.ownerEmail)throw new Error("must have a owner email");
		const owner=await ModelHelper.findOne(UnitModel, {
			email: req.body.ownerEmail,
		});
		if (!owner) throw new Error("must have a valid user email");
		const unit = await ModelHelper.findOne(UnitModel, {
			_id: unitId,
		});

		if (!unit) throw new Error("Invalid unit Id");
		unit.status = true;
		unit.ownerId = owner._id;
		await unit.save();
		const paymentObject = {
			paymentMethod:req.body.paymentMethod,
			amountPaid:req.body.amountPaid,
			unit,
			owner: owner._id,
			employee: req.user._id,
		};
		const payment = await ModelHelper.createOne(PaymentModel, paymentObject);
		if(!owner.payment)owner.payment=[];
		owner.payment.push(payment._id);
		await owner.save();
		Helper.resHandler(res, 200, true, payment, "unit sell successfully");
	});
	static newPaymentPaidAmount = Helper.catchAsyncError(
		async (req, res, next) => {
			const paymentId = Helper.getIdFromRequest(req, "paymentId");
			if (!paymentId) throw new Error("must have a payment id");
			const payment = await ModelHelper.findOne(PaymentModel, {
				_id: paymentId,
			});
			if (!payment) throw new Error("Invalid user Id");
			payment.amountPaid = req.body.amountPaid;
			await payment.save();
			Helper.resHandler(res, 200, true, payment, "user created");
		},
	);
}
module.exports = UnitController;
