const fs = require("fs");
const multer = require("multer");
const uploadImage = (dist, dirName) => {
	const storage = multer.diskStorage({
		destination: (req, file, cb) => {
			const dir = `public/uploads/${dirName}/${req.user._id}`;
			if (!fs.existsSync(dir)) {
				fs.mkdirSync(dir, { recursive: true });
			}
			cb(null, `${dist}/${req.user._id}/`);
		},
		filename: (req, file, cb) => {
			const ext = file.originalname.split(".").pop();
			const newName = `user-${req.user.id}.${Date.now()}.${ext}`;
			cb(null, newName);
		},
	});
	const upload = multer({
		storage,
		limits: { fileSize: 2000000 },
		fileFilter: (req, file, cb) => {
			if (
				file.mimetype == "image/png" ||
				file.mimetype == "image/jpg" ||
				file.mimetype == "image/jpeg"
			) {
				cb(null, true);
			} else {
				cb(null, false);
				return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
			}
		},
	});
	return upload;
};
const uploadImageBuffer = () => {
	const storage = multer.memoryStorage();
	const upload = multer({
		storage,
		limits: { fileSize: 2000000 },
		fileFilter: (req, file, cb) => {
			if (
				file.mimetype == "image/png" ||
				file.mimetype == "image/jpg" ||
				file.mimetype == "image/jpeg"
			) {
				cb(null, true);
			} else {
				cb(null, false);
				return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
			}
		},
	});
	return upload;
};

module.exports = { uploadImage, uploadImageBuffer };
