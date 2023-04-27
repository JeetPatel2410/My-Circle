var express = require('express');
var router = express.Router();
const savePost = require("../models/post/savepost");
const user = require('../models/users/save');
const post = require("../models/post/save");
const statistics = require("../models/statistics");
const mongoose = require("mongoose");
const savepost = require('../models/post/savepost');

// Report
router.get('/', async function (req, res, next) {
  const reportData = await statistics.find({}).lean()
  res.render('dashboard', { title: 'dashboard', reportData: reportData, layout: "blank", logInUser: req.user });
});


module.exports = router;