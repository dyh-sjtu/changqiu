const mongoose = require('mongoose');
const CompanySchema = new mongoose.Schema({
	introduction: String,  // 公司简介
	character: String,  // 公司服务特征
	imgUrl: String,  // 公司封面图片
	address: String, // 公司地址
	email: String,  // 公司邮箱
	tel: String, // 全国统一服务热线
	phoneNumber: String, // 产品咨询热线
	honor: String,  // 企业荣誉，荣誉名称1=图片url1&&荣誉名称2=图片url2...
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

CompanySchema.pre('save', function (next) {
	if (this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now();
	} else {
		this.meta.updateAt = Date.now();
	}
	next();
});

CompanySchema.statics = {
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

module.exports = mongoose.model('Company', CompanySchema);