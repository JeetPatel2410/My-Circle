var express = require('express');
var router = express.Router();
const post = require("../models/post/save")
const user = require('../models/users/save');
const mongoose = require("mongoose");

router.get('/', async function (req, res, next) {

    let limit = 2;
    let page = req.query.page ? req.query.page : 1;
    let skip = (limit * (page - 1));

    // const postData = await post.aggregate([{
    //     $match: { isArchiev: false }
    // }, {
    //     $sort: {
    //         createdOn: -1
    //     }
    // }, {
    //     $skip: skip
    // }, {
    //     $limit: limit
    // }, {
    //     $lookup: {
    //         from: "users",
    //         let: { id: "$postBy" },
    //         pipeline: [{
    //             $match: {
    //                 $expr: {
    //                     $eq: ["$_id", "$$id"]
    //                 }
    //             }
    //         }],
    //         as: "data"
    //     }
    // },
    // {
    //     $unwind: "$data"
    // },
    // {
    //     $project: {
    //         "_id": 1,
    //         "data._id": 1,
    //         "data.image": 1,
    //         "title": 1,
    //         "description": 1,
    //         "data.firstname": 1,
    //         "data.lastname": 1,
    //         "imageId": 1,
    //         "createdOn": 1,
    //         "postBy": 1
    //     }
    // }])
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
            "savedatatatat": 1
        }
    }])


    let totalPost = await post.countDocuments({ isArchiev: false });
    let pageCount = Math.round(totalPost / limit);
    let pageArry = [];
    for (let i = 1; i <= pageCount; i++) {
        pageArry.push(i);
    }


    // console.log(postData,"postdatatatattatatatatatatattat");
    res.render('dashboard', { title: 'dashboard', postData: postData, logInUser: req.user, pageArry: pageArry });
})

router.get('/posts', async function (req, res, next) {
    console.log("==============================================");

    console.log(req.query, "QUERYYYYYYY");
    let limit = 2;
    let page = req.query.page ? req.query.page : 1;
    let skip = (limit * (page - 1));


    // console.log(req.query);
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

    console.log(conditionObj);
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
    // let totalPost = await post.countDocuments({ isArchiev: false });
    let totalPost = countData.length;
    let pageCount = Math.round(totalPost / limit);
    let pageArrys = [];
    for (let i = 1; i <= pageCount; i++) {
        pageArrys.push(i);
    }
    console.log(postData);
    console.log(pageArrys, "pageaaraaaaay");
    res.render('dashboard', { title: 'dashboard', postData: postData,layout:"blank", logInUser: req.user, pageArrys: pageArrys });


})


// router.get('/:filter/:id', async function (req, res, next) {
//     console.log(req.params);

//     if (req.params.filter == "title") {
//         var set = {
//             $sort: {
//                 "title": -1,
//             }
//         }
//     }
//     if (req.params.filter == "datetime") {
//         var set = {
//             $sort: {
//                 "createdOn": -1,
//             }
//         }
//     }


//     if (req.params.id == "mine-post") {
//         var obj = { $match: { "data._id": id } }
//     }
//     else if (req.params.id == "others-post") {
//         var obj = { $match: { "data._id": { $ne: id } } }
//     }
//     else if (req.params.id == "all-post") {
//         var obj = { $match: { "isArchiev": false } }
//         // var set = {
//         //     $sort: {
//         //         "title": 1,
//         //         createdOn: -1
//         //     }
//         // }
//     }
//     else {
//         var obj = {
//             $match: {
//                 $or: [
//                     {
//                         "title": {
//                             $regex: req.params.id, $options: "i"
//                         }
//                     },
//                     {
//                         "description": {
//                             $regex: req.params.id, $options: "i"
//                         }
//                     }
//                 ]
//             }
//         }
//     }


//     const postData = await post.aggregate([{ $match: { isArchiev: false } }, {
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
//             "data._id": 1,
//             "data.image": 1,
//             "title": 1,
//             "description": 1,
//             "data.firstname": 1,
//             "data.lastname": 1,
//             "imageId": 1,
//             "createdOn": 1,
//             "postBy": 1
//         }
//     },
//         obj
//         , set])
//     console.log(postData);
//     res.render('dashboard', { title: 'dashboard', postData: postData, layout: "blank", logInUser: req.user });


// })
module.exports = router;