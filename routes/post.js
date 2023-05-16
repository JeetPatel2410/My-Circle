var express = require('express');
var router = express.Router();
const multer = require('multer')
const path = require("path")
const post = require("../models/post/save")
const savePost = require("../models/post/savepost")
const mongoose = require("mongoose");
const savepost = require('../models/post/savepost');
const comment = require('../models/post/comment');
const likepost = require('../models/post/like');
const save = require('../models/users/save');
const likenotification = require('../models/post/likenotification');

// Storage
const maxSize = 1 * 1000 * 1000;
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // console.log("000000000000000000000000");
        cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        if (ext === ".txt" || ext === ".png" || ext === ".jpeg" || ext === ".jpg") {
            const uniqueSuffix = (req.user._id) + '-' + Date.now() + path.extname(file.originalname)
            cb(null, uniqueSuffix)
        } else {
            // cb(null, '');    
            // res.status(404).json({
            //     status: 404,
            //     message: "'Only .png, .jpg and .jpeg format allowed!'   "
            // });
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
})

var upload = multer({ storage: storage, limits: { fileSize: maxSize } })
const uploadMulter = multer({ storage: storage, limits: { fileSize: maxSize } }).single('postavatar')
// Create Post
router.post('/', async function (req, res, next) {

    uploadMulter(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading.
            return res.status(403).json({
                status: 403,
                message: err.message
            });
        } else if (err) {
            // An unknown error occurred when uploading.
            return res.status(403).json({
                status: 403,
                message: err.message
            });
        } else {
            const id = new mongoose.Types.ObjectId(req.user._id)
            const { title, description } = req.body
            const userPostData = {
                postBy: id,
                title: title,
                description: description,
                imageId: req.file.filename
            }
            await post.create(userPostData)
            res.status(201).json({
                status: 201,
                message: "Post Created succsefully"
            });
        }
    })


});

// Give data to modal
router.get("/edit", async function (req, res, next) {
    // console.log(req.params);
    // console.log(req.file);

    const editPost = await post.findById(req.query.id).lean();
    // console.log(editPost);
    // res.render("partials/post/edit", { editPost: editPost })
    res.status(201).json({
        status: 201,
        data: editPost,
        message: "post Unsave"
    });
})

// Comment render
router.get("/", async function (req, res, next) {
    const id = req.query.id;
    const data = await comment.aggregate([
        {
            $match: {
                postId: new mongoose.Types.ObjectId(id)
            }
        },
        {
            $sort: { createdOn: -1 }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'commentBy',
                foreignField: '_id',
                pipeline: [{
                    $project: {
                        firstname: 1,
                        lastname: 1,
                        image: 1
                    }
                }],
                as: 'commentUser'
            }
        },
        {
            $unwind: "$commentUser"
        },
        {
            $project: {
                comment: 1,
                createdOn: 1,
                commentUser: '$commentUser'
            }
        }
    ])
    res.render('partials/post/commentList', { data: data, layout: 'blank' })
    // const data = await comment.find({postId : id})
})

// Edit,Archiev,Save
router.put('/:id/:postId', upload.single('editavatar'), async function (req, res, next) {
    // archiev post
    if (req.params.postId.slice(24, 25)) {
        console.log("insideeeeeeee");
        const newId = req.params.id.substring(0, req.params.id.length);
        console.log(newId, "----------------------");
        const id = new mongoose.Types.ObjectId(newId);
        await post.findByIdAndUpdate(id, { isArchiev: true })
        return res.status(201).json({
            status: 201,
            message: "archievevevev"
        });
    }

    // Edit post
    if (req.body.title) {
        const id = new mongoose.Types.ObjectId(req.body.hiddenval);
        var editPostImagePath = await post.findById(id)
        console.log(editPostImagePath, "editPostImagePatheditPostImagePatheditPostImagePath");
        // console.log(id);
        if (!req.file) {
            await post.updateOne({ _id: id }, {
                $set:
                {
                    title: req.body.title,
                    description: req.body.description,
                    imageId: editPostImagePath.imageId
                }
            })
            return res.status(201).json({
                status: 201,
                message: "post Updated Succesfully"
            });
        }
        await post.updateOne({ _id: id }, {
            $set:
            {
                title: req.body.title,
                description: req.body.description,
                imageId: req.file.filename
            }
        })
        return res.status(201).json({
            status: 201,
            message: "post Updated Succesfully"
        });
    }




    // // // save post
    const logInUserId = new mongoose.Types.ObjectId(req.user._id);
    const postByUserId = new mongoose.Types.ObjectId(req.params.id);
    const postId = new mongoose.Types.ObjectId(req.params.postId);
    if (req.user._id === req.params.id) {
        return res.status(203).json({
            status: 203,
            message: "you Can't save this post "
        });
    }

    const isExists = await savePost.aggregate([{ $match: { $and: [{ postBy: postByUserId }, { saveBy: logInUserId }, { postId: postId }] } }])
    if (isExists[0]) {
        res.status(201).json({
            status: 201,
            message: "post Unsave"
        });
        return await savePost.deleteOne({ postId: postId })
    }

    await savePost.create({
        postBy: postByUserId,
        saveBy: logInUserId,
        postId: postId
    })
    res.status(201).json({
        status: 201,
        message: "POST SAVE!!! "
    });

});

// Saved Post
// router.post('/save', async function (req, res, next) {
//     try {
//         const saveData = await savepost.aggregate([{
//             $lookup: {
//                 from: "posts",
//                 let: { id: "$postId" },
//                 pipeline: [{
//                     $match: {
//                         $expr: {
//                             $eq: ["$_id", "$$id"]
//                         }
//                     }
//                 }],
//                 as: "dataa"
//             }
//         },
//         {
//             $unwind: "$dataa"
//         },
//         {
//             $lookup: {
//                 from: "users",
//                 let: { id: "$postBy" },
//                 pipeline: [{
//                     $match: {
//                         $expr: {
//                             $eq: ["$_id", "$$id"]
//                         }
//                     }
//                 }],
//                 as: "postdetails"
//             }
//         }, {
//             $unwind: "$postdetails"
//         }])
//         res.render('dashboard', { title: 'dashboard', saveData: saveData, layout: "blank", logInUser: req.user });
//     } catch (error) {
//         console.log(error);
//     }
// });

// paggeination save post

router.post('/save', async function (req, res, next) {
    try {
        let limit = 3;
        let page = req.query.page ? req.query.page : 1;
        let skip = (limit * (page - 1));
        const id = new mongoose.Types.ObjectId(req.user._id);

        const saveData = await savepost.aggregate([{ $match: { saveBy: id } }, {
            $skip: skip
        }, {
            $limit: limit
        }, {
            $lookup: {
                from: "posts",
                let: { id: "$postId" },
                pipeline: [{
                    $match: {
                        $expr: {
                            $and: [
                                {
                                    $eq: ["$_id", "$$id"]
                                },
                                {
                                    $eq: ["$isArchiev", false]
                                }
                            ]
                        }
                    }
                }],
                as: "dataa"
            }
        },
        {
            $unwind: "$dataa"
        },
        {
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
                as: "postdetails"
            }
        }, {
            $unwind: "$postdetails"
        }])


        const countSavePostData = await savepost.aggregate([{ $match: { saveBy: id } }, {
            $lookup: {
                from: "posts",
                let: { id: "$postId" },
                pipeline: [{
                    $match: {
                        $expr: {
                            $eq: ["$_id", "$$id"]
                        }
                    }
                }],
                as: "dataa"
            }
        },
        {
            $unwind: "$dataa"
        },
        {
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
                as: "postdetails"
            }
        }, {
            $unwind: "$postdetails"
        }])


        let totalPost = countSavePostData.length;
        console.log(totalPost);
        var pageCount = (Math.floor(totalPost / limit));
        if (totalPost % 3 != 0) {
            pageCount = (Math.floor(totalPost / limit)) + 1;
        }
        let pageArrySave = [];
        for (let i = 1; i <= pageCount; i++) {
            pageArrySave.push(i);
        }
        console.log(pageArrySave, "pagesavearray");
        res.render('partials/post/saved', { title: 'dashboard', saveData: saveData, layout: "blank", logInUser: req.user, pageArrySave: pageArrySave });
    } catch (error) {
        console.log(error);
    }
});

// LIke Post
router.post('/like', async function (req, res, next) {
    const isExists = await likepost.exists({ likeBy: req.user._id, postId: req.query.postId })
    // const isExists = await likepost.aggregate([{ $match: { likeBy: req.user._id, postId: req.query.postId } }])
    var postBy = await post.findOne({ _id: req.query.postId })
    if (isExists) {
        await likepost.deleteOne({ _id: isExists._id })
        const likeCount = await likepost.countDocuments({ postId: req.query.postId })
        console.log(likeCount, "likeeecountttt");
        const isNotificationExists = await likenotification.exists({ postId: req.query.postId, likeBy: req.user._id })
        if (isNotificationExists) {
            await likenotification.deleteOne({ _id: isNotificationExists._id });
        }
        io.to(postBy.postBy.toString()).emit("postdislike", `your post Dislike`);

        // console.log(isNotificationExists, "isNotificationExistsisNotificationExists");
        return res.status(201).json({
            status: 201,
            likeCount: likeCount,
            message: "post Unliked"
        });
    }
    await likepost.create(
        {
            likeBy: req.user._id,
            postId: req.query.postId
        })

    const likeCount = await likepost.countDocuments({ postId: req.query.postId })
    console.log(likeCount, "likeeecountttt");

    await likenotification.create({
        likeBy: req.user._id,
        likeByName: `${req.user.firstname} ${req.user.lastname}`,
        postBy: postBy.postBy,
        postId: req.query.postId
    })

    io.to(postBy.postBy.toString()).emit("postlike", `your post like by ${req.user.firstname}`);

    res.status(202).json({
        status: 202,
        likeCount: likeCount,
        message: "Post Liked succsefully"
    });
});

// Comment on post
router.post('/comment', async function (req, res, next) {
    try {
        const postId = new mongoose.Types.ObjectId(req.body.hiddenval);
        const commentBy = new mongoose.Types.ObjectId(req.user._id);
        const commentObj = {
            comment: req.body.comment,
            commentBy: commentBy,
            postId: postId
        }
        await comment.create(commentObj);
        const data = await comment.aggregate([
            {
                $match: {
                    postId: new mongoose.Types.ObjectId(req.body.hiddenval)
                }
            },
            {
                $sort: { createdOn: -1 }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'commentBy',
                    foreignField: '_id',
                    pipeline: [{
                        $project: {
                            firstname: 1,
                            lastname: 1,
                            image: 1
                        }
                    }],
                    as: 'commentUser'
                }
            },
            {
                $unwind: "$commentUser"
            },
            {
                $project: {
                    comment: 1,
                    createdOn: 1,
                    commentUser: '$commentUser'
                }
            }
        ])
        res.render('partials/post/commentList', { data: data, layout: 'blank' })
        // res.status(201).json({
        //     status: 201,
        //     message: "Comment"
        // });
    } catch (error) {

    }
});
module.exports = router;