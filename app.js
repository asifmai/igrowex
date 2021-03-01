require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const connectDb = require('./helpers/connectdb');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
const fileUpload = require('express-fileupload');
const cors = require('cors');

// Connect to MongoDB
connectDb();

// Initialize App
const app = express();

// Passport Config
require('./helpers/passport')(passport);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Log Routes
app.use(logger('dev'));

// Accept Json in Request
app.use(express.json({ extended: true, limit: '200mb' }));
app.use(express.urlencoded({ extended: false, limit: '200mb' }));

// Express Session
app.use(
  session({
    secret: 'harisiqbal',
    resave: true,
    saveUninitialized: true,
  })
);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect Flash
app.use(flash());

// Other Middlewares
app.use(express.json({ limit: '200mb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());
app.use(cors());

// Global Variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error'); // Error from Passport
  res.locals.user = req.user;
  next();
});

// Routes Configuration
app.use('/api/v1', require('./routes/api'));
app.use('/', require('./routes/admin'));

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
