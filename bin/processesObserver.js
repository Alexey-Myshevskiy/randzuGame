/**
 * Created by alexey on 03.01.16.
 */
var mySingleton = (function () {
    var Storage = require("node-cache");
    var PlayersStore = new Storage({ stdTTL: 15*60, checkperiod: 120 });
    // Instance stores a reference to the Singleton
    var instance;
    function init() {
        // Singleton
        // Private methods and variables

        return {
            // Public methods and variables
            registerPlayer: function (obj, callback) {
                PlayersStore.get(obj, function (err, value) {
                    if (!err) {
                        if (value == undefined) {
                            // if data with provided key is not exist
                            // save period 15 min (900 000 msec)
                            PlayersStore.set(obj.playerName,obj,10*60, callback);
                        } else {
                            callback("Duplicate was found!", null);
                        }
                    }
                    else {
                        callback(err, null);
                    }
                });
            },// end PlayersStore declaration
            getPlayerByName: function(name){
                return PlayersStore.get(name);
            },
            countOfPlayers: function(){
                return PlayersStore.keys().length;
            },
            isExistPlayer: function(name){
                value = PlayersStore.get(name);
                return ( value == undefined ) ? false : true;
            },
            addGameToUser:function(usrName,GameObj){
                var Player=this.getPlayerByName(usrName);
                Player.game=GameObj;
                PlayersStore.set(Player.playerName,Player,10*60);
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
