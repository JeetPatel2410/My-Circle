var express = require('express');
var router = express.Router();
const post = require("../models/post/save")
const user = require('../models/users/save');
const likepost = require('../models/post/like');
const mongoose = require("mongoose");

// TimeLine
// router.get('/', async function (req, res, next) {

//     let limit = 3;
//     let page = req.query.page ? req.query.page : 1;
//     let skip = (limit * (page - 1));
//     const id = new mongoose.Types.ObjectId(req.user._id);
//     const postData = await post.aggregate([{
//         $match: { isArchiev: false }
//     }, {
//         $sort: {
//             createdOn: -1
//         }
//     }, {
//         $skip: skip
//     }, {
//         $limit: limit
//     }, {
//         $lookup: {
//             from: "postsavebies",
//             localField: "_id",
//             foreignField: "postId",
//             let: { savedby: id },
//             pipeline: [{
//                 $match: {
//                     $expr: {
//                         $eq: ["$saveBy", "$$savedby"],
//                     }
//                 }
//             }],
//             as: "savedatatatat"
//         }
//     }, {
//         $lookup: {
//             from: "users",
//             let: { id: "$postBy" },
//             pipeline: [{
//                 $match: {
//                     $expr: {
//                         $eq: ["$_id", "$$id"]
//                     }
//                 }
//             }],
//             as: "data"
//         }
//     },
//     {
//         $unwind: "$data"
//     },
//     {
//         $project: {
//             "_id": 1,
//             "data._id": 1,
//             "data.image": 1,
//             "title": 1,
//             "description": 1,
//             "data.firstname": 1,
//             "data.lastname": 1,
//             "imageId": 1,
//             "createdOn": 1,
//             "postBy": 1,
//             "savedatatatat": 1
//         }
//     }])

//     let totalPost = await post.countDocuments({ isArchiev: false });
//     var pageCount = (Math.round(totalPost / limit));
//     if (totalPost % 3 != 0) {
//         pageCount = (Math.round(totalPost / limit)) + 1;
//     }
//     // let pageCount = Math.floor(totalPost / limit);
//     let pageArry = [];
//     for (let i = 1; i <= pageCount; i++) {
//         pageArry.push(i);
//     }
//     res.render('dashboard', { title: 'dashboard', postData: postData, logInUser: req.user, pageArry: pageArry });
// })

router.get('/', async function (req, res, next) {
    console.log("in timelineeeee");
    let limit = 3;
    let page = req.query.page ? req.query.page : 1;
    let skip = (limit * (page - 1));
    const id = new mongoose.Types.ObjectId(req.user._id);
    const postData = await post.aggregate([{
        $match: { isArchiev: false }
    }, {
        $sort: {
            createdOn: -1
        }
    }, {
        $skip: skip
    }, {
        $limit: limit
    }, {
        $lookup: {
            from: "like",
            localField: "_id",
            foreignField: "postId",
            let: { likedBy: id },
            pipeline: [{
                $match: {
                    $expr: {
                        $eq: ["$likeBy", "$$likedBy"],
                    }
                }
            }],
            as: "like"
        }
    }, {
        $lookup: {
            from: "postsavebies",
            localField: "_id",
            foreignField: "postId",
            let: { savedby: id },
            pipeline: [{
                $match: {
                    $expr: {
                        $eq: ["$saveBy", "$$savedby"],
                    }
                }
            }],
            as: "savedatatatat"
        }
    }, {
        $lookup: {
            from: "users",
            let: { id: "$postBy" },
            pipeline: [{
                $match: {
                    $expr: {
                        $eq: ["$_id", "$$id"]
                    }
                }
            }],
            as: "data"
        }
    },
    {
        $unwind: "$data"
    },{
        $lookup: {
            from: "like",
            localField: "_id",
            foreignField: "postId",
            pipeline: [{
                $lookup: {
                    from: "users",
                    localField: "likeBy",
                    foreignField: "_id",
                    as: "details"
                }
            },{
                $unwind: "$details"
            },{
                $group: {
                    _id: null,
                    likedBy: {
                        $push: {
                            $concat: ['$details.firstname', " " ,'$details.lastname']
                        }
                    }
                }
            }],
            as: "likedata"
        }
    },{
        $unwind: {
            path: "$likedata",           
            preserveNullAndEmptyArrays: true
        }
    },
    {
        $project: {
            "_id": 1,
            "data._id": 1,
            "data.image": 1,
            "title": 1,
            "description": 1,
            "data.firstname": 1,
            "data.lastname": 1,
            "imageId": 1,
            "createdOn": 1,
            "postBy": 1,
            "savedatatatat": 1,
            "like":1,
            "likedata": 1,
            "likedBy": "$likedata.likedBy",
            "likedByCount": {
                $size: {
                    $ifNull: ["$likedata.likedBy", []]
                }
            }
        }
    }])
    // console.log("lkfsdnflksd");

    const likePostId = new mongoose.Types.ObjectId(req.query.likeId);

    const likedPostList = await likepost.aggregate([{
        $lookup: {
            from: "users",
            let: { id: "$likeBy" },
            pipeline: [{
                $match: {
                    $expr: {
                        $eq: ["$_id", "$$id"]
                    }
                }

            },
            { $project: { "_id": 0, "firstname": 1, "lastname": 1 } }
            ],
            as: "likedata"
        }
    }, { $unwind: "$likedata" }, { $group: { _id: "$postId", count: { $sum: 1 }, likelist: { $push: "$likedata.firstname" } } }, { $match: { _id: likePostId } }])
    // console.log(likedPostList[0]);

    let totalPost = await post.countDocuments({ isArchiev: false });
    var pageCount = (Math.floor(totalPost / limit));
    if (totalPost % 3 != 0) {
        // console.log("here total post 33333333");
        pageCount = (Math.floor(totalPost / limit)) + 1;
    }
    // let pageCount = Math.floor(totalPost / limit);
    let pageArry = [];
    for (let i = 1; i <= pageCount; i++) {
        pageArry.push(i);
    }
    res.render('dashboard', { title: 'dashboard', postData: postData, logInUser: req.user, pageArry: pageArry, likedPostList: likedPostList[0] });
})
// Post Filter,Search,Searching
// router.get('/posts', async function (req, res, next) {

//     let limit = 3;
//     let page = req.query.page ? req.query.page : 1;
//     let skip = (limit * (page - 1));
//     const id = new mongoose.Types.ObjectId(req.user._id);


//     let sortObj = {
//         createdOn: -1,
//     }
//     if (req.query.sort == "title") {
//         delete sortObj.createdOn;
//         sortObj.title = 1;
//     }

//     let conditionObj = {
//         "isArchiev": false
//     }
//     if (req.query.filter == "mine-post") {
//         console.log("herere");
//         conditionObj.postBy = id;
//     } else if (req.query.filter == "others-post") {
//         conditionObj.postBy = {
//             $ne: id
//         }
//     }

//     if (req.query.search) {
//         conditionObj.$or = [
//             {
//                 "title": {
//                     $regex: req.query.search, $options: "i"
//                 }
//             },
//             {
//                 "description": {
//                     $regex: req.query.search, $options: "i"
//                 }
//             }
//         ]
//     }

//     const postData = await post.aggregate([{
//         $match: conditionObj
//     }, {
//         $sort: {
//             createdOn: -1
//         }
//     }, {
//         $skip: skip
//     }, {
//         $limit: limit
//     }, {
//         $lookup: {
//             from: "postsavebies",
//             localField: "_id",
//             foreignField: "postId",
//             let: { savedby: id },
//             pipeline: [{
//                 $match: {
//                     $expr: {
//                         $eq: ["$saveBy", "$$savedby"],
//                     }
//                 }
//             }],
//             as: "savedatatatat"
//         }
//     }, {
//         $lookup: {
//             from: "users",
//             let: { id: "$postBy" },
//             pipeline: [{
//                 $match: {
//                     $expr: {
//                         $eq: ["$_id", "$$id"]
//                     }
//                 }
//             }],
//             as: "data"
//         }
//     },
//     {
//         $unwind: "$data"
//     },
//     {
//         $project: {
//             "_id": 1,
//             "isArchiev": 1,
//             "data.image": 1,
//             "title": 1,
//             "description": 1,
//             "data.firstname": 1,
//             "data.lastname": 1,
//             "imageId": 1,
//             "createdOn": 1,
//             "postBy": 1,
//             "savedatatatat": 1
//         }
//     }, {
//         $sort: sortObj
//     }]);

//     const countData = await post.aggregate([{
//         $match: conditionObj
//     }, {
//         $sort: {
//             createdOn: -1
//         }
//     }, {
//         $lookup: {
//             from: "users",
//             let: { id: "$postBy" },
//             pipeline: [{
//                 $match: {
//                     $expr: {
//                         $eq: ["$_id", "$$id"]
//                     }
//                 }
//             }],
//             as: "data"
//         }
//     },
//     {
//         $unwind: "$data"
//     },
//     {
//         $project: {
//             "_id": 1,
//             "isArchiev": 1,
//             "data.image": 1,
//             "title": 1,
//             "description": 1,
//             "data.firstname": 1,
//             "data.lastname": 1,
//             "imageId": 1,
//             "createdOn": 1,
//             "postBy": 1
//         }
//     }, {
//         $sort: sortObj
//     }]);
//     let totalPost = countData.length;
//     var pageCount = Math.round(totalPost / limit);
//     if (totalPost % 3 != 0) {
//         var pageCount = (Math.round(totalPost / limit)) + 1;
//     }
//     let pageArrys = [];
//     for (let i = 1; i <= pageCount; i++) {
//         pageArrys.push(i);
//     }
//     console.log(pageCount, "count");
//     res.render('dashboard', { title: 'dashboard', postData: postData, layout: "blank", logInUser: req.user, pageArrys: pageArrys });

// })


router.get('/posts', async function (req, res, next) {

    let limit = 3;
    let page = req.query.page ? req.query.page : 1;
    let skip = (limit * (page - 1));
    const id = new mongoose.Types.ObjectId(req.user._id);


    let sortObj = {
        createdOn: -1,
    }
    if (req.query.sort == "title") {
        delete sortObj.createdOn;
        sortObj.title = 1;
    }

    let conditionObj = {
        "isArchiev": false
    }
    if (req.query.filter == "mine-post") {
        console.log("herere");
        conditionObj.postBy = id;
    } else if (req.query.filter == "others-post") {
        conditionObj.postBy = {
            $ne: id
        }
    }

    if (req.query.search) {
        conditionObj.$or = [
            {
                "title": {
                    $regex: req.query.search, $options: "i"
                }
            },
            {
                "description": {
                    $regex: req.query.search, $options: "i"
                }
            }
        ]
    }

    const postData = await post.aggregate([{
        $match: conditionObj
    }, {
        $sort: {
            createdOn: -1
        }
    }, {
        $skip: skip
    }, {
        $limit: limit
    }, {
        $lookup: {
            from: "like",
            localField: "_id",
            foreignField: "postId",
            let: { likedBy: id },
            pipeline: [{
                $match: {
                    $expr: {
                        $eq: ["$likeBy", "$$likedBy"],
                    }
                }
            }],
            as: "like"
        }
    }, {
        $lookup: {
            from: "postsavebies",
            localField: "_id",
            foreignField: "postId",
            let: { savedby: id },
            pipeline: [{
                $match: {
                    $expr: {
                        $eq: ["$saveBy", "$$savedby"],
                    }
                }
            }],
            as: "savedatatatat"
        }
    }, {
        $lookup: {
            from: "users",
            let: { id: "$postBy" },
            pipeline: [{
                $match: {
                    $expr: {
                        $eq: ["$_id", "$$id"]
                    }
                }
            }],
            as: "data"
        }
    },
    {
        $unwind: "$data"
    },
    {
        $lookup: {
            from: "like",
            localField: "_id",
            foreignField: "postId",
            pipeline: [{
                $lookup: {
                    from: "users",
                    localField: "likeBy",
                    foreignField: "_id",
                    as: "details"
                }
            },{
                $unwind: "$details"
            },{
                $group: {
                    _id: null,
                    likedBy: {
                        $push: {
                            $concat: ['$details.firstname', " " ,'$details.lastname']
                        }
                    }
                }
            }],
            as: "likedata"
        }
    },{
        $unwind: {
            path: "$likedata",
            preserveNullAndEmptyArrays: true
        }
    },
    {
        $project: {
            "_id": 1,
            "isArchiev": 1,
            "data.image": 1,
            "title": 1,
            "description": 1,
            "data.firstname": 1,
            "data.lastname": 1,
            "imageId": 1,
            "createdOn": 1,
            "postBy": 1,
            "savedatatatat": 1,
            "like":1,
            "likedata": 1,
            "likedBy": "$likedata.likedBy",
            "likedByCount": {
                $size: {
                    $ifNull: ["$likedata.likedBy", []]
                }
            }
        }
    }, {
        $sort: sortObj
    }]);

    const countData = await post.aggregate([{
        $match: conditionObj
    }, {
        $sort: {
            createdOn: -1
        }
    }, {
        $lookup: {
            from: "users",
            let: { id: "$postBy" },
            pipeline: [{
                $match: {
                    $expr: {
                        $eq: ["$_id", "$$id"]
                    }
                }
            }],
            as: "data"
        }
    },
    {
        $unwind: "$data"
    },
    {
        $project: {
            "_id": 1,
            "isArchiev": 1,
            "data.image": 1,
            "title": 1,
            "description": 1,
            "data.firstname": 1,
            "data.lastname": 1,
            "imageId": 1,
            "createdOn": 1,
            "postBy": 1
        }
    }, {
        $sort: sortObj
    }]);
    let totalPost = countData.length;
    var pageCount = Math.floor(totalPost / limit);
    if (totalPost % 3 != 0) {
        var pageCount = (Math.floor(totalPost / limit)) + 1;
    }
    let pageArrys = [];
    for (let i = 1; i <= pageCount; i++) {
        pageArrys.push(i);
    }
    // console.log(postData, "postdatat");
    res.render('dashboard', { title: 'dashboard', postData: postData, layout: "blank", logInUser: req.user, pageArrys: pageArrys });

})
module.exports = router;


