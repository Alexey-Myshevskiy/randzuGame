var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();
app.io = require('socket.io')();
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
app.io.on('connection', function (socket) {
    var listOfGames = {};
    var Game = require('./bin/gameEngine');
    var gameType;
    socket.on('playWithOthers', function (data) {
        if (app.observer.countOfWaitingRooms() == 0) {
            app.observer.addWaitingRoom({
                id: socket.id,
                name: data.playerName + "_room",
                type: 'waitingRoom',
                roomName: data.playerName
            });
            app.io.emit("waitForPlayers", {});
        }
        else {
            app.io.emit("goPlay", {});
        }
    });

    socket.on("readyToplay", function (data) {
        // Если игрок играл и его игра не завершена
        gameType = data.gameType;
        if (app.observer.isExistPlayer(data.playerName)) {

            Player = app.observer.getPlayerByName(data.playerName);
            PlayersGme = Player.game;
            if (PlayersGme) {
                listOfGames[socket.id] = PlayersGme;
            }
            else {
                listOfGames[socket.id] = new Game();
            }
        }
        else {// Если игрок зашел впервые
            app.observer.registerPlayer({playerName: data.playerName}, function (e, s) {
                if (e) {
                    res.status(500).send('Something broke!');
                }
                else {
                    //socket.emit("addedPlayer", {playerName: newPlayerName});
                    var game = new Game();
                    app.observer.addGameToUser(data.playerName, game);
                    listOfGames[socket.id] = game;
                    //newPlayerName="";
                }
            });
        }
        if (gameType == 'cp') {
            socket.on("step", function (id, data) {
                var answ = listOfGames[id].iteract(data.X, data.Y);
                if (answ.winner) app.io.to(id).emit("victory", answ);
                else app.io.to(id).emit("cpu_step", answ);
            });
        } else {// ######################################
            var room;
            room = app.observer.getFreeRoom();
            var clients = app.io.sockets.adapter.rooms[room];
            //to get the number of clients
            var numClients = (typeof clients !== 'undefined') ? Object.keys(clients).length : 0;
            if (numClients == 2) {
                app.observer.removeFreeRoom(room.name, function (err, del) {
                    if (err) console.log(err);
                });
            }
            else {
                socket.join(room.name);
                app.io.to(room.name).emit('intial_step', room.roomName);
            }
            socket.on("step", function (id, myCoordinates, competitor) {
                var room = Object.keys(app.io.sockets.adapter.sids[id])[1];
                if (arguments.length == 2) {
                    socket.broadcast.to(room).emit('competitor_step', myCoordinates);
                }
                else {
                    answer=listOfGames[id].goStep(myCoordinates.X,myCoordinates.Y);
                    if(answer=='winner'){
                        console.log('winner');
                        socket.broadcast.to(room).emit('competitor_step', myCoordinates);
                    }
                    if(answer=='continue'){
                        socket.broadcast.to(room).emit('competitor_step', myCoordinates);
                    }
                }
            });
            socket.on("answ", function (player) {
                app.io.to(room.name).emit('intial_step',player);
            });
        }
    });// /readyToplay


    socket.on('disconnect', function () {
        //TODO: maybe need to add handler of this situation
    });
    socket.on('addedPlayer', function () {
        //TODO: need something do with this
    });
});
app.get('/checkName', function (req, res) {
    var is = app.observer.isExistPlayer(req.query.name);
    res.status(200).jsonp({isExist: is})
});
app.post('/players-room', function (req, res) {
    var newPlayerName = req.body.playerName;
    app.observer.registerPlayer({playerName: newPlayerName}, function (err, success) {
        if (err) {
            res.status(500).send('Something broke!');
        }
        else {
            var countOfRooms = app.observer.countOfWaitingRooms();
            res.render('playersRoom', {playerName: newPlayerName, waitingRooms: countOfRooms});
        }
    });
});
app.get('/players-room/:name', function (req, res) {
    var countOfRooms = app.observer.countOfWaitingRooms();
    res.render('playersRoom', {playerName: req.params.name, waitingRooms: countOfRooms});
});
// expect /play?type=cp&pname=Vasya
app.post('/play', function (req, res) {
    var gameType = req.body.gametype;
    var playerName = req.body.pname;
    /*    app.io.on('connection', function (socket) {


     });*/
    res.status(200).render('gamefield', {playerName: playerName, gameType: gameType});
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
