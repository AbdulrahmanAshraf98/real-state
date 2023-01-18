const fs = require("fs");
const sharp = require("sharp");
const Helper = require("../helper/helper");
const FileHelper = require("../helper/file.helper");
const { convertFileToJpeg } = require("../helper/sharp.helper");

const resizeUserImageBuffer = (dist, dirName) =>
	Helper.catchAsyncError((req, res, next) => {
		if (!req.file) next();
		const newName = `user-${req.user.id}.jpeg`;
		req.file.filename = `${req.user.id}/${newName}`;
		const dir = `public/uploads/${dirName}/${req.user._id}`;
		FileHelper.createDir(dir);
		convertFileToJpeg(
			req.file.buffer,
			80,
			`${dist}/${req.user._id}/${newName}`,
		);
		next();
	});

const resizeMultiImageBuffer = (dist, dirName, uniqueRequestKey, resize) =>
	Helper.catchAsyncError(async (req, res, next) => {
		if (!req.files) next();
		const dir = `public/uploads/${dirName}/${req.body[uniqueRequestKey]}`;
		FileHelper.createDir(dir);
		req.body.projectImages = [];

		await Promise.all(
			req.files.map(async (file, index) => {
				const newName = `${req.body[uniqueRequestKey]}-${index}.jpeg`;
				convertFileToJpeg(
					file.buffer,
					80,
					`${dist}/${req.body[uniqueRequestKey]}/${newName}`,
					resize,
				);
				req.body.projectImages.push(`${req.body[uniqueRequestKey]}/${newName}`);
			}),
		);
		next();
	});

module.exports = { resizeUserImageBuffer, resizeMultiImageBuffer };
