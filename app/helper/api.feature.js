class ApiFeatures {
	constructor(query, reqQuery) {
		this.query = query;
		this.reqQuery = reqQuery;
	}

	filter() {
		let queryObject = { ...this.reqQuery };
		const excludesFields = ["page", "limit", "sort", "fields"];
		excludesFields.forEach((element) => delete queryObject[element]);
		let queryString = JSON.stringify(queryObject);
		queryString = queryString.replace(
			/\b(gte|gt|lte|lt)\b/g,
			(match) => `$${match}`,
		);
		queryObject = JSON.parse(queryString);
		this.query = this.query.find(queryObject);
		return this;
	}

	pagination() {
		//pagination
		const page = +this.reqQuery.page || 1;
		const limit = +this.reqQuery.limit || 30;
		const skip = (page - 1) * limit;
		this.query = this.query.skip(skip).limit(limit);
		return this;
	}

	selectedFields() {
		let { fields } = this.reqQuery;
		if (fields) {
			fields = fields.split(",").join(" ");
			this.query = this.query.select(fields);
		}
		this.query = this.query.select("-__v");
		return this;
	}

	sort() {
		let { sort } = this.reqQuery;

		if (sort) {
			const sortBy = sort.split(",").join(" ");
			this.query = this.query.sort(sortBy);
		} else {
			this.query.sort("-createAt");
		}
		return this;
	}
}
module.exports = ApiFeatures;
