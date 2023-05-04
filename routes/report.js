var express = require('express');
var router = express.Router();
const savePost = require("../models/post/savepost");
const user = require('../models/users/save');
const post = require("../models/post/save");
const statistics = require("../models/statistics");
const mongoose = require("mongoose");
const savepost = require('../models/post/savepost');
const moment = require('moment');

// Report
// router.get('/', async function (req, res, next) {
//   const reportData = await statistics.find({}).lean()
//   res.render('dashboard', { title: 'dashboard', reportData: reportData, layout: "blank", logInUser: req.user });
// });

// report chart 
router.get('/', async function (req, res, next) {
  const reportData = await statistics.aggregate([{ $project: { "totalsavedpost": 1, "_id": 0, "totalpost": 1, "createdOn": 1, "totalLikedPost": 1 } }])
  const arraySaved = []
  const arrayLiked = []
  const arrayDate = []
  const array = []
  for (let value of reportData) {
    array.push(value.totalpost)
    arrayLiked.push(value.totalLikedPost)
    arraySaved.push(value.totalsavedpost)
    arrayDate.push(moment(value.createdOn).format('YYYY_MM_DD_hh_mm'))
  }
  res.render('partials/user/report', { title: 'dashboard', array: array, arraySaved: arraySaved, arrayLiked: arrayLiked, arrayDate: arrayDate, layout: "blank", logInUser: req.user });

});


module.exports = router;