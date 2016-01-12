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
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
    res.render('index', {pCount: app.observer.countOfPlayers()});
});
app.get('/checkName', function (req, res) {
    var is = app.observer.isExistPlayer(req.query.name);
    res.status(200).jsonp({isExist: is})
});
app.post('/players-room', function (req, res) {
    var newPlayerName = req.body.playerName;
    res.render('playersRoom', {playerName: newPlayerName});
});
app.get('/players-room/:name', function (req, res) {
    res.render('playersRoom', {playerName: req.params.name});
});
// expect /play?type=cp&pname=Vasya
app.post('/play', function (req, res) {
    var gameType = req.body.gametype;
    var playerName = req.body.pname;
    var Game = require('./bin/gameEngine');
    var listOfGames={};
    app.io.on('connection', function (socket) {

        socket.on("readyToplay", function (player) {
            // Если игрок играл и его игра не завершена
            if (app.observer.isExistPlayer(player)) {

                Player = app.observer.getPlayerByName(player);
                PlayersGme = Player.game;
                if (PlayersGme) {
                    listOfGames[socket.id] = PlayersGme;
                }
                else {
                    listOfGames[Player.id] = new Game();
                }
            }
            else {// Если игрок зашел впервые
                app.observer.registerPlayer({playerName: player}, function (e, s) {
                    if (e) {
                        res.status(500).send('Something broke!');
                    }
                    else {
                        //socket.emit("addedPlayer", {playerName: newPlayerName});
                        var game = new Game();
                        app.observer.addGameToUser(player, game);
                        listOfGames[socket.id] = game;
                        //newPlayerName="";
                    }
                });
            }
        });


        socket.on("step", function (id,data) {
            var answ = listOfGames[id].iteract(data.X, data.Y);
            if (answ.winner) app.io.to(id).emit("victory", answ);
            else app.io.to(id).emit("cpu_step", answ);
        });
        socket.on('disconnect', function () {
           //TODO: maybe need to add handler of this situation
        });
        socket.on('addedPlayer', function () {
        //TODO: need something do with this
        });
    });
    if (gameType == 'cp')res.render('gamefield', {playerName: playerName});
    if (gameType == 'pl') {
        res.render('gamefield', {playerName: playerName, seekToGame: true});
    }
    else res.sendStatus(400);
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
