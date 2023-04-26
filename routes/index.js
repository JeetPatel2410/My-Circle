var express = require('express');
var router = express.Router();
var md5 = require('md5');
const user = require('../models/users/save');
const post = require("../models/post/save")
const passport = require("passport");
/* GET home page. */
router.get('/', async function (req, res, next) {
  let limit = 2;
  let page = req.query.page ? req.query.page : 1;
  let skip = (limit * (page - 1));
  const landingData = await post.aggregate([{ $match: { isArchiev: false } }, {
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
      "data._id": 1,
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
    $sort: {
      createdOn: -1
    }
  }])
  let totalPost = await post.countDocuments({ isArchiev: false });
  let pageCount = Math.round(totalPost / limit);
  let pageArrylanding = [];
  for (let i = 1; i <= pageCount; i++) {
    pageArrylanding.push(i);
  }
  res.render('dashboard', { title: 'landing', landingData: landingData, layout: "landing", pageArrylanding: pageArrylanding });
});

router.get('/registration', function (req, res, next) {

  res.render('registration', { title: 'Express', layout: 'login' });
});

router.get('/email', async function (req, res, next) {
  const isExists = await user.countDocuments({ email: req.query.email })
  console.log(isExists);
  const value = isExists ? false : true
  res.send(value)
})




router.post('/save', async function (req, res, next) {
  try {
    console.log("hererererer");
    const { firstname, lastname, email, gender, password, confirmpassword } = req.body
    const userData = {
      firstname: firstname,
      lastname: lastname,
      email: email,
      gender: gender,
      image: "./images/images.jpeg",
      password: md5(password),
      confirmpassword: md5(confirmpassword)
    }
    await user.create(userData)
    res.status(201).json({
      status: 201,
      message: "user Created succsefully"
    });
    // res.send('respond with a resource');  
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: 400,
      message: "user not succsefully"
    });
  }

});

router.post('/login', async function (req, res, next) {
  try {
    passport.authenticate("local", function (err, user, info) {
      console.log("4444===Authhhhhh done");
      if (err) {
        console.log(err);
        return next(err)
      }
      if (!user) {
        console.log("not userrrrrrrr");
        req.flash("error", "please enter valid login details")
        return res.redirect("/login")
      }
      req.login(user, async function (err) {
        if (err) {
          return next(err);
        }
        //  console.log(req.user);
        res.redirect("/timeline")
        // res.render("addcatagory", {
        //     title: "Add-Catgory",
        //     data:data
        // })
      });
    })(req, res, next);
  } catch (error) {
    console.log(error);
  }

});


router.get('/login', function (req, res, next) {
  if (!req.isAuthenticated()) {
    return res.render("login", {
      layout: 'login',
      title: "Login-page",
    })
  }
});

router.get("/logout", function (req, res, next) {                   //User Logout
  console.log("hererererererererer");
  req.logout();
  req.session = null;
  console.log(req.logout());
  res.status(201).json({
    status: 201,
    message: "user logout succsefully"
  });
});

module.exports = router;
