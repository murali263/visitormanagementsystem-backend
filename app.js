var createError = require('http-errors');
var express = require('express');
var path = require('path');
const cors = require('cors')
const bodyParser = require("body-parser")
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config();
require('./dbconnection/mongoose');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var sezsRouter = require('./routes/sezs');
var guardsRouter = require('./routes/guards');
var managerRouter = require('./routes/manager')
var companyRouter = require('./routes/comp');
var visitorRouter = require('./routes/visitors');
var filesRouter = require('./routes/fileupload')
var archiveRouter = require('./routes/Archives')
var SezarchiveRouter = require('./routes/sezArchives');
var forgotpassword = require('./routes/forgot')
var statescitys = require('./routes/statescitys');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
  next();
});
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/sezs', sezsRouter);
app.use('/guard', guardsRouter);
app.use('/manager', managerRouter)
app.use('/company', companyRouter);
app.use('/visitor', visitorRouter);
app.use('/files', filesRouter);
app.use('/archive', archiveRouter);
app.use('/SezArchive', SezarchiveRouter);
app.use('/statescitys', statescitys);
app.use('/forgot', forgotpassword);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

