const checkValidArray = (array) => {
	if (array === null || !array.length) return false;
	return true;
};
class ArrayHelper {
	static addItemToArray = (array, value) => {
		array.push(value);
		return array;
	};
	static removeItemFromArray = (array, value) =>
		array.filter((item) => item != value);
	static getIndexOfObject = (array, key, value) => {
		const validArray = checkValidArray(array);
		if (!validArray || !key || !value) return null;
		return array.findIndex((item) => item[key].toString() == value);
	};
	static getObjectBy = (array, key, value) => {
		const validArray = checkValidArray(array);
		if (!validArray || !key || !value) return null;
		const element = array.find((item) => item[key] == value);
		return element ? element : null;
	};
	static deleteObjectFromArray = (array, key, value) => {
		const validArray = checkValidArray(array);
		if (!validArray || !key || !value) return [];
		const newArray = array.filter((item) => item[key] != value);
		return newArray;
	};
	static sortArrayBy = (
		array,
		type = "normalArray",
		key = "",
		keyType = "string",
		sortOrder = "asc",
	) => {
		if (!key) return array.sort();
		if (type === "normalArray")
			return sortOrder === "asc"
				? array.sort((a, b) => a - b)
				: array.sort((a, b) => b - a);
		if (type === "arrayOfObject")
			if (keyType === "string") {
				return sortOrder === "asc"
					? array.sort((a, b) => a[key].localeCompare(b[key]))
					: array.sort((a, b) => a[key].localeCompare(b[key]));
			}
		return sortOrder === "asc"
			? array.sort((a, b) => a[key] - b[key])
			: array.sort((a, b) => b[key] - a[key]);
	};
	static searchForStringInArray = (
		array,
		value,
		typeOFArray = "normalArray",
		key = "",
	) => {
		if (typeOFArray === "arrayOfObject")
			return array.filter((element) =>
				element[key].trim().toLowerCase().includes(value.trim().toLowerCase()),
			);
		return array.filter((element) =>
			element.trim().toLowerCase().includes(value.trim().toLowerCase()),
		);
	};
}
module.exports = ArrayHelper;
