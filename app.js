let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let mongoose = require('mongoose');
let bodyParser = require('body-parser');
let session = require('express-session' );
let logger = require('morgan');
let config = require('./config/database');

//Connection to our Mongodb
mongoose.connect(config.database);
const db = mongoose.connection;

//If Connection Successful
db.once('open',function () {
  console.log('Connected to MongoDB...');
});

//If Connection Fails
db.on('error',function (err) {
  console.log(err);
});

let app = express();

app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

// Body Parser middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

let indexRouter = require('./routes/index');
let usersRouter = require('./routes/user');
let authRouter = require('./routes/auth');



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/auth', authRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
