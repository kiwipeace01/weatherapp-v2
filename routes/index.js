var express = require('express');
var router = express.Router();
const {ensureAuthenticated } = require('../config/auth');

router.get('/',function(req,res) {
	res.render('welcome');
});

router.get('/dashboard',ensureAuthenticated, function(req,res) {
	res.render('dashboard',{name: req.user.name});
});

module.exports = router;

/*
router.get('/dashboard',ensureAuthenticated, function(req,res) {
	res.render('weather');
});

module.exports = router;

*/