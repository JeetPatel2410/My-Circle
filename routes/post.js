var express = require('express');
var router = express.Router();
const multer = require('multer')
const path = require("path")
const post = require("../models/post/save")
const savePost = require("../models/post/savepost")
const mongoose = require("mongoose");
const savepost = require('../models/post/savepost');
const save = require('../models/users/save');
const { log } = require('console');

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

// Create Post
router.post('/', upload.single('postavatar'), async function (req, res, next) {
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
});

// Unsave Post
router.get("/:id", async function (req, res, next) {
    const editPost = await post.findById(req.params.id).lean();
    res.status(201).json({
        status: 201,
        data: editPost,
        message: "post Unsave"
    });
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
        // console.log(id);
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
        return res.status(201).json({
            status: 201,
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

        const saveData = await savepost.aggregate([{ $match: { saveBy: id } },{
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
        var pageCount = (Math.round(totalPost / limit));
        if (totalPost % 3 != 0) {
             pageCount = (Math.round(totalPost / limit)) + 1;
        }
        let pageArrySave = [];
        for (let i = 1; i <= pageCount; i++) {
            pageArrySave.push(i);
        }
        console.log(pageArrySave,"pagesavearray");
        res.render('dashboard', { title: 'dashboard', saveData: saveData, layout: "blank", logInUser: req.user, pageArrySave: pageArrySave });
    } catch (error) {
        console.log(error);
    }
});


module.exports = router;