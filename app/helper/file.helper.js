const fs = require("fs");
const { relative } = require("path");
const path = require("path");
const PDFDocument = require("pdfkit");
class FileHelper {
	static getFilePath = (relativePath) => {
		return path.join(__dirname, relativePath);
	};
	static generateBasicPdf = async (pdfName, data) => {
		const doc = new PDFDocument();
		doc.pipe(
			fs.createWriteStream(
				path.join(__dirname, `../../public/pdf/${pdfName}.pdf`),
			),
		);
		doc.fontSize(25).text(JSON.stringify(data), 100, 100);
		doc.end();
		return doc;
	};
	static createDir = (dirPath) => {
		try {
			if (!fs.existsSync(dirPath)) {
				fs.mkdirSync(dirPath, { recursive: true });
			}
		} catch (error) {
			throw new Error(error);
		}
	};
}
module.exports = FileHelper;
