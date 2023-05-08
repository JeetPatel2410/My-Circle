var express = require('express');
const otpGenerator = require('otp-generator');
var router = express.Router();
var md5 = require('md5');
const user = require('../models/users/save');
const post = require("../models/post/save")
const otp = require("../models/users/otp")
const passport = require("passport");
var nodemailer = require('nodemailer');
/* GET home page. */

/**
 * If password forgoted
 * Enter email
 */
router.get("/forgot", function (req, res) {
  res.render("partials/user/forgotpwd", { layout: 'login' })
})

// Generate OTP.
router.post("/forgot", async function (req, res) {
  const OTP = otpGenerator.generate(5, {
    upperCaseAlphabets: true,
    specialChars: false,
  });

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'pa3597230@gmail.com',
      pass: 'wqmbouyneavxctxr'
    }
  });

  var mailOptions = {
    from: 'pa3597230@gmail.com',
    to: req.body.email,
    subject: 'OTP',
    html: `<p>Your otp is <h2>${OTP}</h2></p>`
  };

  const isRegisteruser = await user.exists({ email: req.body.email })
  if (!isRegisteruser) {
    return res.status(404).json({
      status: 404,
      message: "No user Found, Please register yourself !"
    })
  }

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error, "error");
    } else {
      console.log('Email sent: ' + info.messageId);
    }
  });

  const isEmailExists = await otp.exists({ email: req.body.email })
  console.log(isEmailExists);
  if (isEmailExists) {
    await otp.deleteOne(isEmailExists);
  }
  await otp.create({
    email: req.body.email,
    otp: OTP
  })
  res.render("partials/user/otp", { layout: 'login', email: req.body.email })
})

// Verify otp
router.post("/otp", async function (req, res, next) {
  const isOtpExists = await otp.exists({ email: req.body.email })
  if (!isOtpExists) {
    return res.status(404).json({
      statu: 400,
      message: "Opps, Otp is expiredI"
    })
  }
  const isMatch = await otp.exists({ email: req.body.email, otp: req.body.otp })
  if (!isMatch) {
    return res.status(404).json({
      statu: 400,
      message: "Opps, Otp Didn't match"
    })
  }
  if (isMatch) {
    res.render("partials/user/newPassword", { layout: "login", email: req.body.email })
  }
})

// Set New password
router.put("/password", async function (req, res) {
  console.log(req.body, "new passwordddddi");
  const update = await user.findOneAndUpdate(
    {
      email: req.body.email
    },
    {
      password: md5(req.body.newPassword),
      confirmpassword: md5(req.body.newPassword)
    }
  )
  res.status(201).json({
    status: 201,
    message: "Password updated succesfully"
  })
})

// Verify user
router.get('/verify', async function (req, res, next) {

  try {
    const isExists = await user.exists({ email: req.query.email })
    const id = isExists._id;
    console.log(id, "IsExists");
    await user.findByIdAndUpdate(id, { isVerify: true })
    res.end();
  } catch (error) {
    console.log(error);
  }
});

// Landing Page
router.get('/', async function (req, res, next) {
  let limit = 3;
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
  var pageCount = (Math.floor(totalPost / limit));
  if (totalPost % 3 != 0) {
    pageCount = (Math.floor(totalPost / limit)) + 1;
  }
  let pageArrylanding = [];
  for (let i = 1; i <= pageCount; i++) {
    pageArrylanding.push(i);
  }
  res.render('dashboard', { title: 'landing', landingData: landingData, layout: "landing", pageArrylanding: pageArrylanding });
});

// Registration
router.get('/registration', function (req, res, next) {
  res.render('registration', { title: 'registration', layout: 'login' });
});

// Remote Email
router.get('/email', async function (req, res, next) {
  const isExists = await user.countDocuments({ email: req.query.email })
  console.log(isExists);
  const value = isExists ? false : true
  res.send(value)
})

// Save User 
router.post('/save', async function (req, res, next) {
  try {
    var VAL = req.body.email;
    var emailregex = new RegExp(/^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/);
    if (!emailregex.test(VAL)) {
      return res.status(403).json({
        status: 403,
        message: "Please Enter Valid Email !"
      });
    }
    console.log("hererererer");

    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'pa3597230@gmail.com',
        pass: 'wqmbouyneavxctxr'
      }
    });

    var mailOptions = {
      from: 'pa3597230@gmail.com',
      to: req.body.email,
      subject: 'Sending Email using Node.js',
      html: `<a href="http://localhost:3000/verify?email=${req.body.email}">Click to verify your account</a>`
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error, "error");
      } else {
        console.log('Email sent: ' + info.messageId);
      }
    });

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

// Login User AUTH
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
      if (user.isVerify == false) {
        req.flash("error", "Your Account is not verified yet !")
        return res.redirect("/login")
      }
      req.login(user, async function (err) {
        if (err) {
          return next(err);
        }

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

// login Auth
router.get('/login', function (req, res, next) {
  if (!req.isAuthenticated()) {
    return res.render("login", {
      layout: 'login',
      title: "Login-page",
    })
  }
});

// Logout
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
