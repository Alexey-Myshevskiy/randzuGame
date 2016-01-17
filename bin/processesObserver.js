/**
 * Created by alexey on 03.01.16.
 */
var mySingleton = (function () {
    var Storage = require("node-cache");
    var PlayersStore = new Storage({stdTTL: 15 * 60, checkperiod: 120});
    // Instance stores a reference to the Singleton
    var instance;

    function init() {
        // Singleton
        // Private methods and variables

        return {
            // Public methods and variables
            registerPlayer: function (obj, callback) {
                PlayersStore.get(obj.playerName, function (err, value) {
                    if (!err) {
                        if (value == undefined) {
                            // if data with provided key is not exist
                            // save period 15 min (900 000 msec)
                            PlayersStore.set(obj.playerName, obj, 10 * 60, callback);
                        } else {
                            callback("Duplicate STOP!", null);
                        }
                    }
                    else {
                        callback(err, null);
                    }
                });
            },// end PlayersStore declaration
            getPlayerByName: function (name) {
                return PlayersStore.get(name);
            },
            countOfPlayers: function () {
                var count = 0;
                var keys = PlayersStore.keys();
                keys.forEach(function (item, index, array) {
                    if (keys[index].indexOf('_room') < 0)  count++;// if entity not a room
                });
                return count;
            },
            isExistPlayer: function (name) {
                value = PlayersStore.get(name);
                return ( value == undefined ) ? false : true;
            },
            addGameToUser: function (usrName, GameObj) {
                var Player = this.getPlayerByName(usrName);
                Player.game = GameObj;
                PlayersStore.set(Player.playerName, Player, 10 * 60);
            },
            addWaitingRoom: function (roomObj) {
                PlayersStore.set(roomObj.name, roomObj, 4 * 60);
            },
            countOfWaitingRooms: function () {
                var content = PlayersStore.keys();
                var count = 0;
                content.forEach(function (item, index, array) {
                    if (content[index].indexOf('_room') > 0)  count++;
                });
                return count;
            },
            getFreeRoom: function () {
                var allKeys = PlayersStore.keys();
                var currentArray = allKeys.filter(function (item, index, array) {
                    return item.indexOf('_room')>0;
                });
                var name = currentArray[Math.floor(Math.random() * currentArray.length)];
                return PlayersStore.get(name);
            },
            removeFreeRoom: function(name,callback) {
                PlayersStore.del(name,callback);
            },
            isPlayerInRoom: function(roomName,playerName){
                // for avoid wrong name of room
                var name = (roomName.indexOf('_room')>0) ? roomName : roomName+"_room";
                var room=PlayersStore.get(name);
                var a= room.players.some(function(item,inde,arr){return (item.playerName==playerName)});
                return a;
            }
        };
    };
    return {
        // Get the Singleton instance if one exists
        // or create one if it doesn't
        getInstance: function () {
            if (!instance) {
                instance = init();
            }
            return instance;
        }
    };
})();

module.exports = mySingleton.getInstance();
