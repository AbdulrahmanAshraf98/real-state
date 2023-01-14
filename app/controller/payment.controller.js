const PaymentModel = require("../../db/models/payment.model");
const Helper = require("../helper/helper");
const ModelHelper = require("../helper/model.helper");
const FileHelper = require("../helper/file.helper");
const getSinglePayment = async (condition, errorMessage) => {
	const payment = await ModelHelper.findOne(PaymentModel, condition);
	if (!payment) throw new Error("Invalid payment Id");
	return payment;
};
class PaymentController {
	static allPayments = Helper.catchAsyncError(async (req, res, next) => {
		const payments = await ModelHelper.findAll(PaymentModel, req.body);
		Helper.resHandler(res, 200, true, payments, "payments fetched");
	});

	static getSinglePaymentById = Helper.catchAsyncError(
		async (req, res, next) => {
			const paymentId = Helper.getIdFromRequest(req, "paymentId");
			if (!paymentId) throw new Error("must have a payment id");
			const payment = await getSinglePayment({ _id: paymentId });
			Helper.resHandler(res, 200, true, payment, "payment fetched");
		},
	);
	static getSinglePaymentByOwnerId = Helper.catchAsyncError(
		async (req, res, next) => {
			const ownerId = Helper.getIdFromRequest(req, "ownerId");
			if (!ownerId) throw new Error("must have a owner id");
			const payment = await getSinglePayment({
				owner: ownerId,
			});
			Helper.resHandler(res, 200, true, payment, "payment fetched");
		},
	);
	static newPaymentPaidAmount = Helper.catchAsyncError(
		async (req, res, next) => {
			const paymentId = Helper.getIdFromRequest(req, "paymentId");
			if (!paymentId) throw new Error("must have a payment id");
			const payment = await getSinglePayment({ _id: paymentId });
			payment.amountPaid += req.body.amountPaid;
			await payment.save();
			Helper.resHandler(res, 200, true, payment, "payment successfully");
		},
	);
	static editPayment = Helper.catchAsyncError(async (req, res) => {
		const paymentId = Helper.getIdFromRequest(req, "paymentId");
		if (!paymentId) throw new Error("must have a payment id");
		const payment = await ModelHelper.updateOne(
			PaymentModel,
			{
				_id: paymentId,
			},
			{ updateBy: req.user._id, ...req.body },
		);
		Helper.resHandler(res, 200, true, payment, "payment updated");
	});
	static deletePayment = Helper.catchAsyncError(async (req, res) => {
		const paymentId = Helper.getIdFromRequest(req, "paymentId");
		if (!paymentId) throw new Error("must have a payment id");
		await ModelHelper.deleteOne(PaymentModel, { _id: paymentId });
		Helper.resHandler(res, 200, true, null, "payment deleted");
	});
	static sendPaymentPdf = Helper.catchAsyncError(async (req, res) => {
		const paymentId = Helper.getIdFromRequest(req, "paymentId");
		if (!paymentId) throw new Error("must have a payment id");
		const payment = await getSinglePayment({ _id: paymentId });
		await FileHelper.generateBasicPdf(payment._id, payment);
		res.sendFile(FileHelper.getFilePath(`../../public/pdf/${payment._id}.pdf`));
	});
}
module.exports = PaymentController;
