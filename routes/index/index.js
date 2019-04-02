const express = require('express');
const router = express.Router();
const News = require('../../models/news');
const upload = require('../middleware/upload');
const Slider = require('../../models/slider');
const Project = require('../../models/project');
const Product = require('../../models/product');
const ProductCategory = require('../../models/productCategory');
const Company = require('../../models/company');


// 所有静态页面
router.get('/', upload.saveViewData, (req, res) => {
	News.find({}).sort({'meta.updateAt': -1}).limit(3).exec((err, news) => {
		Slider.fetch((err, sliders) => {
			ProductCategory.find({}).limit(4)
				.exec((err, productCategorys) => {
					Product.find({category: productCategorys.length > 0 && productCategorys[0]._id}).exec((err, products) => {
						Project.find({}).limit(6)
							.exec((err, projects) => {
								Company.fetch((err, companys) => {
									res.render("index", {
										news: news,
										sliders: sliders,
										projects: projects,
										products: products,
										productCategorys: productCategorys,
										company: companys[0]
									})
								})
							})
					})
				})
		})
	})
});

router.get('/index', upload.saveViewData, (req, res) => {
	News.find({}).sort({'meta.updateAt': -1}).limit(3).exec((err, news) => {
		Slider.fetch((err, sliders) => {
			ProductCategory.find({}).limit(4)
				.exec((err, productCategorys) => {
					Product.find({category: productCategorys.length > 0 && productCategorys[0]._id}).exec((err, products) => {
						Project.find({}).limit(6)
							.exec((err, projects) => {
								Company.fetch((err, companys) => {
									res.render("index", {
										news: news,
										sliders: sliders,
										projects: projects,
										products: products,
										productCategorys: productCategorys,
										company: companys[0]
									})
								})
							})
					})
				})
		})
	})
});

router.get('/about', upload.saveViewData, (req, res) => {
	try {
		Company.fetch((err, companys) => {
			let honorStr = companys && companys.length > 0 && companys[0].honor || '';
			let honors = [];
			if (honorStr.length > 0) {
				honorStr.split("&&").forEach(function (item, index) {
					let honorObj = {};
					honorObj.name = item.split('=')[0];
					honorObj.imgUrl = item.split('=')[1];
					honors.push(honorObj);
				})
			}
			res.render("about", {
				company: companys[0],
				honors: honors
			})
		})
	} catch (err) {
		console.log('err', err);
	}
});

router.get('/contact', upload.saveViewData, (req, res) => {
	try {
		Company.fetch((err, companys) => {
			res.render("contact", {
				company: companys[0]
			})
		})
	} catch (err) {
		console.log('err', err);
	}
});


router.get('/product', upload.saveViewData, (req, res) => {
	try {
		ProductCategory.find({})
			.exec((err, productCategorys) => {
				Product.find({category: productCategorys.length > 0 && productCategorys[0]._id})
					.exec((err, products) => {
						res.render("product", {
							products: products,
							productCategorys: productCategorys
						})
					})
			})
	} catch
		(err) {
		console.log('err', err);
	}
});

router.get('/product/category/:id', upload.saveViewData, (req, res) => {
	try {
		let productCategoryId = req.params.id;
		if (productCategoryId) {
			ProductCategory.findOne({_id: productCategoryId})
				.populate('products', 'name imgUrl')
				.exec((err, productCategory) => {
					res.render("productCategoryDetail", {
						productCategory: productCategory
					})
				})
		}
	} catch
		(err) {
		console.log('err', err);
	}
});


router.get('/product/detail', upload.saveViewData, (req, res) => {
	try {
		let productId = req.query.productId;
		if (productId) {
			Product.findOne({_id: productId}).populate('category', 'name').exec((err, product) => {
				Product.find({category: product.category}).limit(8).exec((err, relateProducts) => {
					let noRepeatRelateProducts = relateProducts.filter(function (_product, index) {
						return _product._id.toString() !== productId.toString();
					});
					res.render('productDetail', {
						product: product,
						relateProducts: noRepeatRelateProducts
					})
				})
			})
		}
	} catch (err) {
		console.log('err', err);
	}
});

router.get('/project', upload.saveViewData, (req, res) => {
	try {
		let pageIndex = parseInt(Object.keys(req.query).length > 0 && req.query.pageIndex) || 0;
		let pageSize = 16;
		Project.find({}).sort({'meta.createAt': -1}).limit(pageSize).skip(pageIndex * pageSize).exec((err, projects) => {
			Project.count().exec((err, projectsNum) => {
				res.render("project", {
					projects: projects,
					pageSize: pageSize,
					pageIndex: pageIndex,
					totalPage: Math.ceil(projectsNum/pageSize)
				})
			})
		})
	}catch (err) {
		console.log('err', err)
	}
});


router.get('/product/category/:id', upload.saveViewData, (req, res) => {
	try {
		let productCategoryId = req.params.id;
		if (productCategoryId) {
			Product.find({category: productCategoryId})
				.exec((err, products) => {
					res.render('productDetail', {
						products: products
					})
				})
		}
	} catch (err) {
		if (err) console.log('err', err);
	}
})


router.get('/news', upload.saveViewData, (req, res) => {
	try {
		let pageIndex = parseInt(Object.keys(req.query).length > 0 && req.query.pageIndex) || 0;
		let pageSize = 5;
		News.find({}).sort({'meta.createAt': -1}).limit(pageSize).skip(pageIndex * pageSize).exec((err, news) => {
			News.count().exec((err, newsNum) => {
				res.render("news", {
					news: news,
					pageSize: pageSize,
					pageIndex: pageIndex,
					totalPage: Math.ceil(newsNum/pageSize)
				})
			})
		})
	} catch (err) {
		console.log('err', err)
	}
});

router.get('/newsDetail', upload.saveViewData, (req, res) => {
	try {
		let newsId = req.query.newsId;
		let status = req.query.status;
		if (status == 'pre') {
			News.find({'_id': {'$gt': newsId}}).sort({'_id': 1}).limit(1).exec((err, currentItem) => {
				let newsItem = currentItem[0];
				News.find({'_id': {'$gt': newsItem._id}}).sort({'_id': 1}).limit(1).exec((err, preItem) => {
					News.find({'_id': {'$lt': newsItem._id}}).sort({'_id': -1}).limit(1).exec((err, nextItem) => {
						res.render('newsItem', {
							newsItem: newsItem,
							ifNextExist: nextItem.length > 0,
							ifPreExist: preItem.length > 0
						})
					})
				})
			})
		} else if (status == 'next') {
			News.find({'_id': {'$lt': newsId}}).sort({'_id': -1}).limit(1).exec((err, currentItem) => {
				let newsItem = currentItem[0];
				News.find({'_id': {'$gt': newsItem._id}}).sort({'_id': 1}).limit(1).exec((err, preItem) => {
					News.find({'_id': {'$lt': newsItem._id}}).sort({'_id': -1}).limit(1).exec((err, nextItem) => {
						res.render('newsItem', {
							newsItem: newsItem,
							ifNextExist: nextItem.length > 0,
							ifPreExist: preItem.length > 0
						})
					})
				})
			})
		} else {
			News.findById(newsId, (err, newsItem) => {
				News.find({'_id': {'$gt': newsId}}).sort({'_id': 1}).limit(1).exec((err, preItem) => {
					News.find({'_id': {'$lt': newsId}}).sort({'_id': -1}).limit(1).exec((err, nextItem) => {
						res.render('newsItem', {
							newsItem: newsItem,
							ifNextExist: nextItem.length > 0,
							ifPreExist: preItem.length > 0
						})
					})
				})
			})
		}
	} catch
		(err) {
		console.log('err', err)
	}
})
;


router.get('/service', upload.saveViewData, (req, res) => {
	try {
		res.render('service', {})
	} catch (err) {
		console.log('err', err)
	}
});


module.exports = router;