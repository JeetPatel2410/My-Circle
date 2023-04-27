var createError = require('http-errors');
var flash = require('connect-flash');
var express = require('express');
var path = require('path');
var exphbs = require('express-handlebars');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var session = require('express-session');
var md5 = require('md5');
var logger = require('morgan');
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const user = require('./models/users/save');
const moment = require("moment")
var CronJob = require('cron').CronJob;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var timelineRouter = require('./routes/timeline');
var postRouter = require('./routes/post');
var reportRouter = require('./routes/report');
const savePost = require("./models/post/savepost");
// const user = require('../models/users/save');
const post = require("./models/post/save");
const statistics = require("./models/statistics");

var app = express();

const mongoose = require('mongoose');
require('custom-env').env()
var router = express.Router();
async function main() {
  try {
    // await mongoose.connect(`mongodb://127.0.0.1:27017/social-media`)
    await mongoose.connect(`mongodb://${process.env.user}:${process.env.pass}@127.0.0.1:${process.env.port}/${process.env.dbName}?authSource=admin`)
    console.log("=========Mongoose Connected===========");
  } catch (error) {
    console.log(error);
    throw error
  }
}
main()

const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: '.hbs',
  helpers: {
    section: function (name, options) {
      if (!this._sections) this._sections = {};
      this._sections[name] = options.fn(this);
      return null;
    },
    formatdate: function (date) {
      return moment(date).format("MMMM Do YYYY, h:mm:ss a")
    },
    isMatch: function (logInUser, postUser) {
      if (logInUser == postUser) {
        return `<a class="nav-link dropdown-toggle" href="#navbar-base" data-bs-toggle="dropdown" data-bs-auto-close="outside"
        role="button" aria-expanded="false">

        <span class="nav-link-title">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-three-dots"
            viewBox="0 0 16 16" style="margin-top: -3px;margin-left: 237px;">
            <path
              d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
          </svg>
        </span>
      </a>`;
      }
    },
    isSave: function (val1, comparison, val2) {
      switch (comparison) {
        case "==":
          return val1 == val2 ? true : false
      }
    }
  }
});

app.engine('hbs', hbs.engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// Authhh
app.use(cookieSession({
  secret: "session",
  key: "dshs89sdifhudfih9843h",
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

app.use(session({
  secret: "dshs89sdifhudfih9843h",
  saveUninitialized: true,
  resave: true,
  maxAge: Date.now() + 30 * 86400 * 1000,
  cookie: { secure: true }
}));
app.use(flash())
// // comman midelware
// app.use(async function (req, res, next) {
//   const success = req.flash('success')
//   const error = req.flash('error')
//   if (success.length > 0) {
//     res.locals.flash = {
//       type: "success",
//       message: success
//     }
//   }
//   if (error.length > 0) {
//     res.locals.flash = {
//       type: "error",
//       message: error
//     }
//   }
//   console.log(req.user,"userrrr");
//   if (req.user) {
//     res.locals.fname = req.user.firstname;
//     res.locals.lname = req.user.lastname;
//   }
//   next()
// })


app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy({
  usernameField: "email",
  passwordField: 'password',
  passReqToCallback: true
},
  function (req, username, password, done) {
    console.log("111111=====username");
    user.findOne({
      'email': {
        $regex: '^' + username + '$',
        $options: 'i'
      },
      password: md5(password)
    }, {
      _id: 1,
      firstname: 1,
      lastname: 1,
      image: 1,
      email: 1,
      password: 1,
      email: 1,
    }).then(async function (user) {
      if (!user) {
        return done(null, false, {
          message: "please enter valid login details"
        })
      } else {
        return done(null, user);
      }
    }).catch(function (error) {
      console.log(error);
      return done(null, false, {
        message: "please enter valid login details"
      });
    });

  }
));

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  try {
    // console.log("33333=====deeeserialize");
    done(null, user);
  } catch (error) {
    console.log(error);
  }
})

app.use(async function (req, res, next) {
  const success = req.flash('success')
  const error = req.flash('error')
  if (success.length > 0) {
    res.locals.flash = {
      type: "success",
      message: success
    }
  }
  if (error.length > 0) {
    res.locals.flash = {
      type: "error",
      message: error
    }
  }

  if (req.user) {
    // console.log(req.user);
    // console.log(req);
    let text = req.user.image;
    let result = text.replace("public", ".");
    // console.log(result);
    res.locals.fname = req.user.firstname;
    res.locals.lname = req.user.lastname;
    res.locals.email = req.user.email;
    res.locals.image = result
  }
  next()
})

app.use('/', indexRouter);

app.use(function (req, res, next) {
  console.log(req.isAuthenticated());
  if (req.isAuthenticated()) {
    //req.isAuthenticated() will return true if user is logged in
    next();
  } else {
    res.redirect("/login");
  }
})

app.use('/timeline', timelineRouter)
app.use('/user', usersRouter);
app.use('/post', postRouter);
app.use('/report', reportRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  console.log(err)
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


// Cron 

var job = new CronJob(
  '*/60 */10 * * * *',
  async function () {
    // console.log(moment().subtract(5, 'minutes').toDate());
    const totalPost = await post.countDocuments({
      createdOn: {
        $gte: moment().subtract(10, 'minutes').toDate(),
        $lte: moment().toDate()
      }
    })
    const savedPost = await savePost.countDocuments({
      createdOn: {
        $gte: moment().subtract(10, 'minutes').toDate(),
        $lte: moment().toDate()
      }
    })

    // console.log(savedPost); 
    const statisticsObj = {
      totalpost: totalPost,
      totalsavedpost: savedPost
    }
    await statistics.create(statisticsObj)

  },
  null,
  true,
);
module.exports = app;
