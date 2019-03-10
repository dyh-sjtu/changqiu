const express = require('express');
const router = express.Router();
const Auth = require('../middleware/auth');
const ProductCategory = require('../../models/productCategory');
const Product = require('../../models/product');

// 产品列表
router.get('/admin/productList', Auth.requiredLogin, Auth.requiredAdmin, (req, res) => {
	try {
		let localUser = res.locals.user;
		Product.find({}).populate('category', 'name')
			.exec((err, products) => {
				res.render('productList', {
					title: '产品列表',
					localUser: localUser,
					products: products
				})
			});
	} catch (err) {
		console.log('err', err)
	}
});

// 进入产品添加页面
router.get('/admin/product/add', Auth.requiredLogin, Auth.requiredAdmin, (req, res) => {
	try {
		let localUser = res.locals.user;
		ProductCategory.fetch((err, productCategorys) => {
			res.render("productAdd", {
				title: '产品列表',
				localUser: localUser,
				product: '',
				productCategorys: productCategorys
			})
		});
	} catch (err) {
		console.log('err', err);
	}
});

router.get('/admin/product/update/:id', Auth.requiredLogin, Auth.requiredAdmin, (req, res) => {
	try {
		let productId = req.params.id;
		let localUser = res.locals.user;
		if (productId) {
			Product.findById(productId, (err, product) => {
				ProductCategory.fetch((err, productCategorys) => {
					res.render('productAdd', {
						title: '产品列表',
						localUser: localUser,
						product: product,
						productCategorys: productCategorys
					})
				});
			})
		}
	} catch (err) {
		console.log('err', err);
	}
});

// 产品信息保存
router.post('/admin/product/save', Auth.requiredLogin, Auth.requiredAdmin, (req, res) => {
	try {
		let productObj = req.body;
		if (productObj.productId) {
			Product.findById(productObj.productId, (err, product) => {
				let _productObj = Object.assign(product, productObj);
				_productObj.save((err, _product) => {
					if (err) console.log(err);
					
					// 将修改产品类型之前产品所在的类型下的产品删除掉
					ProductCategory.findOne({products: product._id}, (err, productCategory) => {
						let index = productCategory.products.indexOf(product._id);
						productCategory.products.splice(index, 1);
						productCategory.save((err, productCategory) => {
							if (err) console.log(err);
							// 删除先前所在类型记录之后再将当前产品存入相应产品类型中
							ProductCategory.findById(product.category, (err, productCategory) => {
								productCategory.products.push(product._id);
								productCategory.save((err, productCategory) => {
									if (err) console.log(err);
									return res.json({
										success: 1
									})
								})
							});
						})
					});
				})
			})
		} else {
			let _productObj = new Product(productObj);
			if (_productObj.category) {
				_productObj.save((err, product) => {
					if (err) console.log(err);
					ProductCategory.findById(product.category, (err, productCategory) => {
						if (err) console.log(err);
						productCategory.products.push(product._id);
						productCategory.save((err, productCategory) => {
							if (err) console.log(err);
							return res.json({
								success: 1
							})
						})
					});
				})
			} else {
				return res.json({
					success: 0,
					msg: "请选择产品类型, 否则无法保存!"
				})
			}
		}
	} catch (err) {
		console.log('err', err);
	}
});

// 客户案例删除
router.delete('/admin/productList/del', Auth.requiredLogin, Auth.requiredAdmin, (req, res) => {
	try {
		let productId = req.query.productId;
		if (productId) {
			
			// 产品删除后，其类型下的该产品也一并删除
			ProductCategory.findOne({products: productId}, (err, productCategory) => {
				if (err) console.log(err);
				let index = productCategory.products.indexOf(productId);
				productCategory.products.splice(index, 1);
				productCategory.save((err, productCategory) => {
					if (err) console.log(err);
				})
			});
			
			Product.remove({_id: productId}, (err, product) => {
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

module.exports = router;