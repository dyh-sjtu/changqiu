const mongoose = require('mongoose');
let ObjectId = mongoose.Schema.Types.ObjectId;
const ProductSchema = new mongoose.Schema({
	name: String,  // 产品名称
	category: {
		type: ObjectId,
		ref: 'ProductCategory'
	},
	smallCategory: String,  // 小类
	desc: String,  // 产品简要描述
	imgUrl: String,  // 产品封面图片地址
	character: String,  // 技术参数， 特征名称1=特征参数&&特征名称2=特征参数2...
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

ProductSchema.pre('save', function (next) {
	if (this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now();
	} else {
		this.meta.updateAt = Date.now();
	}
	next();
});

ProductSchema.statics = {
	fetch: function (cb) {
		return this
			.find({})
			.sort({'meta.updateAt': -1})
			.exec(cb)
	},
	findById: function (id, cb) {
		return this
			.findOne({_id: id})
			.exec(cb)
	}
};

module.exports = mongoose.model('Product', ProductSchema);