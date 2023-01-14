class ModelHelper {
	static findOne = async (model, condition) => {
		return await model.findOne(condition);
	};
	static findAll = async (model, condition = {}) => {
		return await model.find(condition);
	};
	static createOne = async (model, payload) => {
		return await model.create(payload);
	};
	static updateOne = async (model, condition, payload) => {
		return await model.findByIdAndUpdate(condition, payload, { new: true });
	};
	static deleteOne = async (model, payload) => {
		return await model.deleteOne(payload);
	};
	static deleteALl = async (model, payload) => {
		return await model.deleteMany({});
	};
}
module.exports = ModelHelper;
