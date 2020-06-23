const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const logger = require('morgan');

const { isAuthorized } = require('./controllers/login');
const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');
const adminRouter = require('./routes/admin');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'SECRET_KEY',
  httpOnly: true,
  maxAge: 3600000,
  expires: new Date(Date.now() + 3600000),
  saveUninitialized: false,
  resave: false
}))

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/admin', isAuthorized, adminRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
