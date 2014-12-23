var express = require('express');
var mongoose = require('mongoose');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var stylus = require('stylus');
var nib = require('nib');

var DIR_CLIENT = path.join(__dirname, 'client');
var DIR_STATIC = path.join(__dirname, 'static');

var app = express();
mongoose.connect('mongodb://localhost/werewolf', function(err, res) {
    console.log(err ? 'MONGODB ERROR: ' + err : 'MONGODB SUCCESS');
});

app.set('views', path.join(DIR_CLIENT, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(stylus.middleware({
    // For some reason, stylus middleware needs trailing slashes
    src: path.join(DIR_CLIENT, 'styl/'),
    dest: path.join(DIR_STATIC, 'css/'),
    compile: function(str, path) {
        return stylus(str)
            .set('filename', path)
            .set('compress', true)
            .use(nib())
            .import('nib');
    }
}));
app.use(express.static(DIR_STATIC));

// Routes
app.use('/', require('./client/routes.js'));
app.use('/api', require('./server/routes.js'));

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// dev settings
if (app.get('env') === 'development') {
    app.locals.pretty = true;

    // will print stacktrace
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
