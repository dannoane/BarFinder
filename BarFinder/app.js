var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var crypto = require('crypto');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var User = require('./lib/model/User').User;

passport.use(new Strategy(
  function(username, password, cb) {
    User.findOne({ 'username': username }, (err, user) => {
      const hash = crypto.createHash('sha256');
      hash.update(password);
      
      if (err)
        return cb(err);
      if (!user)
        return cb(null, false);
      if (user.password != hash.digest('hex'))
        return cb(null, false);

      return cb(null, user);
    });
  })
);

passport.serializeUser(function(user, cb) {
  cb(null, user._id);
});

passport.deserializeUser(function(id, cb) {
  User.findById(id, (err, user) => {
    cb(err, user);
  });
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', index);
app.use('/users', users);

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});

// handle login
app.post('/login',
  passport.authenticate('local', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/');
  }
);

// handle register
app.post('/register', (req, res) => {

  let newUser = User({
    name: req.body.name,
    username: req.body.username,
    password: req.body.password,
    email: req.body.email
  });

  newUser.save((err) => {
    if (err) {
      return res.status(400).send(err.message);
    }

    res.redirect('/login');
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
