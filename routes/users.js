var express = require('express');
var router = express.Router();
const multer = require('multer')
const path = require("path")
const user = require('../models/users/save');
const likenotification = require('../models/post/likenotification');


const { log } = require('console');
var maxSize = 1 * 1000 * 1000;
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/')
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    if (ext === ".txt" || ext === ".png" || ext === ".jpeg" || ext == ".jpg") {
      const uniqueSuffix = (req.user._id) + path.extname(file.originalname)
      cb(null, uniqueSuffix)
    } else {
      console.log(121212121);
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  }
})

// var upload = multer({ storage: storage, limits: { fileSize: maxSize } })
const uploadMulter = multer({ storage: storage, limits: { fileSize: maxSize } }).single('avatar')
// User Profile Updated
router.put('/', /*upload.single('avatar'), */async function (req, res, next) {
  try {

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
        console.log(req.file, "req.userrrr");

        const { fname, lname } = req.body
        if (!req.file) {
          var obj = {
            firstname: fname,
            lastname: lname,
            image: req.user.image
          }
          req.user.firstname = fname;
          req.user.lastname = lname;
        } else {
          var obj = {
            firstname: fname,
            lastname: lname,
            image: req.file.path
          }
          let text = req.file.path;
          let result = text.replace("public", ".");
          req.user.firstname = fname;
          req.user.lastname = lname;
          req.user.image = result;
        }
        await user.updateOne({ _id: req.user._id }, obj);


        res.status(201).json({
          status: 201,
          message: "user Updated succsefully"
        });
      }
    })

  } catch (error) {
    res.status(403).json({
      status: 403,
      message: error.message
    });
  }
});

router.get('/', async function (req, res, next) {

  try {
    const userInfo = await user.aggregate([
      {
        $lookup:
        {
          from: "posts",
          let: { id: "$_id" },
          pipeline: [{ $match: { "isArchiev": false } }, {
            $match: {
              $expr: {
                $eq: ["$postBy", "$$id"]
              }
            }
          }],
          as: "TotalPost"
        }

      },
      {
        $lookup:
        {
          from: "postsavebies",
          let: { id: "$_id" },
          pipeline: [{
            $match: {
              $expr: {
                $eq: ["$saveBy", "$$id"]
              }
            }
          }],
          as: "savedPost"
        }

      }, {
        $project: {
          savedPost: { $size: "$savedPost" },
          ToatalPost: { $size: "$TotalPost" },
          "firstname": 1,
          "lastname": 1,
          "image": 1,
          "createdOn": 1
        }
      }])
    // console.log(userInfo);
    res.render('dashboard', { title: 'All-Users', userInfo: userInfo, layout: "blank", logInUser: req.user });
  } catch (error) {
    console.log(error);
  }
});

// Sort User
router.get('/sort/:type', async function (req, res, next) {
  try {
    const sortObj = {
      $sort: {
        createdOn: 1
      }
    }
    if (req.params.type == "assending") {
      sortObj.$sort.createdOn = -1
    }
    console.log(sortObj);
    const userInfo = await user.aggregate([
      {
        $lookup:
        {
          from: "posts",
          let: { id: "$_id" },
          pipeline: [{ $match: { "isArchiev": false } }, {
            $match: {
              $expr: {
                $eq: ["$postBy", "$$id"]
              }
            }
          }],
          as: "TotalPost"
        }

      },
      {
        $lookup:
        {
          from: "postsavebies",
          let: { id: "$_id" },
          pipeline: [{
            $match: {
              $expr: {
                $eq: ["$saveBy", "$$id"]
              }
            }
          }],
          as: "savedPost"
        }

      }, {
        $project: {
          savedPost: { $size: "$savedPost" },
          ToatalPost: { $size: "$TotalPost" },
          "firstname": 1,
          "lastname": 1,
          "image": 1,
          "createdOn": 1
        }
      }, sortObj])
    res.render('dashboard', { title: 'All-Users', userInfo: userInfo, layout: "blank", logInUser: req.user });
  } catch (error) {
    console.log(error);
  }
});

// Search User
router.get('/search', async function (req, res, next) {
  try {
    console.log(req.query.search);
    let conditionObj = {}
    if (req.query.search) {
      conditionObj.$or = [
        {
          "firstname": {
            $regex: req.query.search, $options: "i"
          }
        },
        {
          "lastname": {
            $regex: req.query.search, $options: "i"
          }
        }
      ]
    }
    console.log(conditionObj);

    const userInfo = await user.aggregate([
      {
        $lookup:
        {
          from: "posts",
          let: { id: "$_id" },
          pipeline: [{ $match: { "isArchiev": false } }, {
            $match: {
              $expr: {
                $eq: ["$postBy", "$$id"]
              }
            }
          }],
          as: "TotalPost"
        }

      },
      {
        $lookup:
        {
          from: "postsavebies",
          let: { id: "$_id" },
          pipeline: [{
            $match: {
              $expr: {
                $eq: ["$saveBy", "$$id"]
              }
            }
          }],
          as: "savedPost"
        }

      }, { $match: conditionObj }, {
        $project: {
          savedPost: { $size: "$savedPost" },
          ToatalPost: { $size: "$TotalPost" },
          "firstname": 1,
          "lastname": 1,
          "image": 1,
          "createdOn": 1
        }
      }])
    res.render('dashboard', { title: 'All-Users', userInfo: userInfo, layout: "blank", logInUser: req.user });
  } catch (error) {
    console.log(error);
  }
});

router.get("/notification", async function (req, res) {
  console.log("in notificationnnnnnn");
  await likenotification.findByIdAndUpdate(req.query.notifcation, { isseen: true })

  const notifcationData = await likenotification.findById(req.query.notifcation);
  console.log(notifcationData);
  io.to(notifcationData.postBy.toString()).emit("postdislike", `your post Dislike`);

  res.status(201).json({
    status: 201,
    message: "Notification Removed"
  });
})

// router.get("/chat", async function (req, res) {
  
// })


module.exports = router;
