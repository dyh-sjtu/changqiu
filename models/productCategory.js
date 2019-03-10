let mongoose = require('mongoose');
let ObjectId = mongoose.Schema.Types.ObjectId;
let ProductCategorySchema = new mongoose.Schema({
	name: String,
	products: [{
		type: ObjectId,
		ref: 'Product'
	}],
	meta: {
		createAt: {
			type: Date,
			default: Date.now()
		},
		updateAt: {
			type: Date,
			default: Date.now()
		}
	}
});

// 保存
ProductCategorySchema.pre('save', function (next) {
	if (this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now();
	} else {
		this.meta.updateAt = Date.now();
	}
	next();
});


// 静态方法
ProductCategorySchema.statics = {
	fetch: function (cb) {
		return this
			.find({})
			.exec(cb)
	},
	findById: function (id, cb) {
		return this
			.findOne({_id: id})
			.exec(cb)
	}
};

module.exports = mongoose.model("ProductCategory", ProductCategorySchema);
