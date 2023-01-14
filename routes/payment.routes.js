const router = require("express").Router({ mergeParams: true });
const PaymentController = require("../app/controller/payment.controller");
const {
	auth,
	restrictTo,
	checkPermission,
} = require("../app/middleware/auth.middleware");

router
	.route("/")
	.get(
		auth,
		restrictTo("employee", "admin"),
		checkPermission,
		PaymentController.allPayments,
	);

router
	.route("/:paymentId")
	.get(auth, PaymentController.getSinglePaymentById)
	.patch(
		auth,
		restrictTo("employee", "admin"),
		checkPermission,
		PaymentController.editPayment,
	)
	.delete(
		auth,
		restrictTo("admin"),
		checkPermission,
		PaymentController.deletePayment,
	);
router
	.route("/:paymentId/PaymentPdf")
	.get(auth, PaymentController.sendPaymentPdf);
router
	.route("/:paymentId/newPaymentAmount")
	.post(
		auth,
		restrictTo("employee", "admin"),
		checkPermission,
		PaymentController.newPaymentPaidAmount,
	);
router
	.route("/owner/:ownerId")
	.get(
		auth,
		restrictTo("employee", "admin"),
		checkPermission,
		PaymentController.getSinglePaymentByOwnerId,
	);

module.exports = router;
