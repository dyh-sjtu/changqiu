const express = require('express');
const router = express.Router();
const Auth = require('../middleware/auth');
const Project = require('../../models/project');

// 工程案例
router.get('/admin/projectList', Auth.requiredLogin, Auth.requiredAdmin, (req, res) => {
	try {
		let localUser = res.locals.user;
		Project.find({}).exec((err, projects) => {
			res.render('projectList', {
				title: '工程案例',
				localUser: localUser,
				projects: projects
			})
		});
	} catch (err) {
		console.log('err', err)
	}
});

// 工程案例添加页面
router.get('/admin/project/add', Auth.requiredLogin, Auth.requiredAdmin, (req, res) => {
	try {
		let localUser = res.locals.user;
		res.render("projectAdd", {
			title: '工程案例',
			localUser: localUser,
			project: '',
		});
	} catch (err) {
		console.log('err', err);
	}
});

router.get('/admin/project/update/:id', Auth.requiredLogin, Auth.requiredAdmin, (req, res) => {
	try {
		let projectId = req.params.id;
		let localUser = res.locals.user;
		if (projectId) {
			Project.findById(projectId, (err, project) => {
				res.render('projectAdd', {
					title: '工程案例',
					localUser: localUser,
					project: project,
				})
			})
		}
	} catch (err) {
		console.log('err', err);
	}
});

// 工程案例信息保存
router.post('/admin/project/save', Auth.requiredLogin, Auth.requiredAdmin, (req, res) => {
	try {
		let projectObj = req.body;
		if (projectObj.projectId) {
			Project.findById(projectObj.projectId, (err, project) => {
				let _projectObj = Object.assign(project, projectObj);
				_projectObj.save((err, project) => {
					if (err) console.log(err);
					return res.json({
						success: 1
					})
				})
			})
		} else {
			let _projectObj = new Project(projectObj);
			_projectObj.save((err, project) => {
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

// 删除工程案例
router.delete('/admin/projectList/del', Auth.requiredLogin, Auth.requiredAdmin, (req, res) => {
	try {
		let projectId = req.query.projectId;
		if (projectId) {
			Project.remove({_id: projectId}, (err, project) => {
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