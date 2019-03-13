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
								res.render("index", {
									news: news,
									sliders: sliders,
									projects: projects,
									products: products,
									productCategorys: productCategorys
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
								res.render("index", {
									news: news,
									sliders: sliders,
									projects: projects,
									products: products,
									productCategorys: productCategorys
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
				honorStr.split("&&").forEach(function(item, index) {
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


router.get('/productList', upload.saveViewData, (req, res) => {
	try {
		Product.find({}).exec((err, products) => {
			res.render("product", {
				products: products
			})
		})
	} catch (err) {
		console.log('err', err);
	}
});


router.get('/product/detail/:id', upload.saveViewData, (req, res) => {
	try {
		let productId = req.params.id;
		if (productId) {
			Product.findById(productId, (err, product) => {
				res.render('productDetail', {
					product: product
				})
			})
		}
	} catch (err) {
		console.log('err', err);
	}
})

router.get('/projectList', upload.saveViewData, (req, res) => {
	ProjectCategory.find({}).exec((err, projectCategorys) => {
		// 需要将客户案例类型分类成三种，1-战略合作 2-BIM咨询公司 3-研究中心合作单位
		res.render("project", {
			projectCategorys: projectCategorys
		})
	})
})


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
		News.fetch((err, news) => {
			res.render('news', {
				news: news
			})
		})
	} catch (err) {
		console.log('err', err)
	}
});

router.get('/news/:id', upload.saveViewData, (req, res) => {
	try {
		let newsId = req.params.id;
		News.findById(newsId, (err, newsItem) => {
			res.render('newsItem', {
				newsItem: newsItem
			})
		})
	} catch (err) {
		console.log('err', err)
	}
});

module.exports = router;