var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fs = require('fs');

var indexRouter = require('./routes/Telegram');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

app.get('/download/:value', (req, res) =>{
  var key = req.params.value;
  var path = `./hitomi/${key}`;
  if(fs.existsSync(path)){
    res.download(path, key);
  }else{
    res.status(403).send('Bad Request');
  }
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  var getdate = new Date();
  var date = getdate.getFullYear() + '-' + ('0' + (getdate.getMonth() + 1)).slice(-2) + '-' + ('0' + getdate.getDate()).slice(-2)
  var time = `${('0' + getdate.getHours()).slice(-2)}:${('0' + getdate.getMinutes()).slice(-2)}:${('0' + getdate.getSeconds()).slice(-2)}`;
  console.error('[err/' + date  + '/' + time +']: ' + err.message);
  var file_name = "./logs/error_log_" + date + ".log"
  fs.appendFile(file_name, `[${time}]: ${err.stack}\n`, (err) => {if(err) throw err;});
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
