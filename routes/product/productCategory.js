const express = require('express');
const router = express.Router();
const Auth = require('../middleware/auth');
const ProductCategory = require('../../models/productCategory');
const Product = require('../../models/product');

// 产品类型列表
router.get('/admin/productCategoryList', Auth.requiredLogin, Auth.requiredAdmin, (req, res) => {
	try {
		let localUser = res.locals.user;
		ProductCategory.fetch((err, productCategorys) => {
			res.render('productCategoryList', {
				title: '产品类型',
				localUser: localUser,
				productCategorys: productCategorys
			})
		});
	} catch (err) {
		console.log('err', err)
	}
});

// 进入产品类型添加页面
router.get('/admin/productCategory/add', Auth.requiredLogin, Auth.requiredAdmin, (req, res) => {
	try {
		let localUser = res.locals.user;
		res.render("productCategoryAdd", {
			title: '产品类型',
			localUser: localUser,
			productCategory: ''
		})
	} catch (err) {
		console.log('err', err);
	}
});

router.get('/admin/productCategory/update/:id', Auth.requiredLogin, Auth.requiredAdmin, (req, res) => {
	try {
		let productCategoryId = req.params.id;
		let localUser = res.locals.user;
		if (productCategoryId) {
			ProductCategory.findById(productCategoryId, (err, productCategory) => {
				res.render('productCategoryAdd', {
					title: '产品类型',
					localUser: localUser,
					productCategory: productCategory
				})
			})
		}
	} catch (err) {
		console.log('err', err);
	}
});

// 产品信息保存
router.post('/admin/productCategory/save', Auth.requiredLogin, Auth.requiredAdmin, (req, res) => {
	try {
		let productCategoryObj = req.body;
		if (productCategoryObj.productCategoryId) {
			ProductCategory.findById(productCategoryObj.productCategoryId, (err, productCategory) => {
				let _productCategoryObj = Object.assign(productCategory, productCategoryObj);
				_productCategoryObj.save((err, productCategory) => {
					if (err) console.log(err);
					return res.json({
						success: 1
					})
				})
			})
		} else {
			let _productCategoryObj = new ProductCategory(productCategoryObj);
			_productCategoryObj.save((err, productCategory) => {
				if (err) console.log(err);
				return res.json({
					success: 1
				})
			})
		}
	} catch (err) {
		console.log('err', err);
	}
});

// 客户案例删除
router.delete('/admin/productCategoryList/del', Auth.requiredLogin, Auth.requiredAdmin, (req, res) => {
	try {
		let productCategoryId = req.query.productCategoryId;
		if (productCategoryId) {
			// 案例类型删除后，该案例类型下的所有案例都将删除
			Product.find({category: productCategoryId}, (err, products) => {
				products.forEach((product, index) => {
					product.remove();
				})
			});
			
			ProductCategory.remove({_id: productCategoryId}, (err, productCategory) => {
				if (err) console.log(err);
				return res.json({
					success: 1
				})
			})
		}
	} catch (err) {
		console.log('err', err);
	}
});

router.get('/index/product/category', (req, res) => {
	try {
		let productCategoryId = req.query.productCategoryId;
		if (productCategoryId) {
			Product.find({category: productCategoryId}).exec((err, products) => {
				return res.json({
					success: 1,
					data: {
						products: products
					}
				})
			});
		}
	} catch (err) {
		console.log('err', err)
	}
});


module.exports = router;