var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
  res.render('index',{pCount:app.observer.countOfPlayers()});
});
app.get('/checkName', function (req, res) {

    var is = app.observer.isExistPlayer(req.query.name);
    res.status(200).jsonp({isExist: is})

});
app.post('/players-room', function (req, res) {
    var newPlayerName = req.body.playerName;
    app.io.on('connection', function (socket) {
        console.log("CONNECT");
        var Game = require('./bin/gameEngine');
        game = new Game();
        socket.on("step", function (data) {
            var answ = game.registerStep(data.X,data.Y);
            socket.emit("cpu_step",answ);
        });
        socket.on('disconnect', function () {
            console.log('Got disconnect!');
            console.log(socket.rooms.length);
        });
    });
    app.observer.registerPlayer(newPlayerName, function (e, s) {
        if (e) {
            res.status(500).send('Something broke!');
        }
        else {
            res.render('playersRoom', {playerName: newPlayerName});
        }
    });
});
// expect /play?type=cp&pname=Vasya
app.get('/play', function (req, res) {
    res.location('/foo/bar');
    res.render('gamefield', {playerName: req.query.pname});
});
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
