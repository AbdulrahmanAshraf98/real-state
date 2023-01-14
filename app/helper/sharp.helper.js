const sharp = require("sharp");

module.exports.convertFileToJpeg = async (
	fileBuffer,
	quality = 80,
	toFilePath,
	resizeObject = { width: 500, height: 500 },
) => {
	return await sharp(fileBuffer)
		.resize(resizeObject.width, resizeObject.height)
		.toFormat("jpeg")
		.jpeg({ quality })
		.toFile(toFilePath);
};
