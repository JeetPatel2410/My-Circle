var express = require('express');
var router = express.Router();
const savePost = require("../models/post/savepost");
const user = require('../models/users/save');
const post = require("../models/post/save");
const statistics = require("../models/statistics");

const mongoose = require("mongoose");
const savepost = require('../models/post/savepost');
router.get('/', async function (req, res, next) {


  // const report = await user.aggregate([
  //   {
  //     $lookup:
  //     {
  //       from: "posts",
  //       let: { id: "$_id" },
  //       pipeline: [{ $match: { "isArchiev": false } }, {
  //         $match: {
  //           $expr: {
  //             $eq: ["$postBy", "$$id"]
  //           }
  //         }
  //       }],
  //       as: "TotalPost"
  //     }

  //   },
  //   {
  //     $lookup:
  //     {
  //       from: "postsavebies",
  //       let: { id: "$_id" },
  //       pipeline: [{
  //         $match: {
  //           $expr: {
  //             $eq: ["$saveBy", "$$id"]
  //           }
  //         }
  //       }],
  //       as: "savedPost"
  //     }

  //   }, {
  //     $project: {
  //       savedPost: { $size: "$savedPost" },
  //       ToatalPost: { $size: "$TotalPost" },
  //       "firstname": 1,
  //       "lastname": 1,
  //       "image": 1,
  //       "createdOn": 1
  //     }
  //   }])
  // console.log(report);

  // const totalPost = await post.countDocuments({})
  // const savedPost = await savePost.countDocuments({})
  // console.log(savedPost);
  // const statisticsObj = {
  //   totalpost: totalPost,
  //   totalsavedpost: savedPost
  // }
  // await statistics.create(statisticsObj)

  // res.render('dashboard', { title: 'All-Users', report: report, layout: "blank", logInUser: req.user });

  res.send("hererere")
});


module.exports = router;