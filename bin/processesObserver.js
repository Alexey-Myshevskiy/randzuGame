/**
 * Created by alexey on 03.01.16.
 */
var mySingleton = (function () {
    var Storage = require("node-cache");
    var PlayersStore = new Storage();
    // Instance stores a reference to the Singleton
    var instance;

    function init() {
        // Singleton
        // Private methods and variables

        return {
            // Public methods and variables
            registerPlayer: function (name, callback) {
                PlayersStore.get(name, function (err, value) {
                    if (!err) {
                        if (value == undefined) {
                            // if data with provided key is not exist
                            // save period 15 min (900 000 msec)
                            PlayersStore.set(name, {playerName: name}, 900000, callback);
                        } else {
                            callback("Duplicate was found!", null);
                        }
                    }
                    else {
                        callback(err, null);
                    }
                });
            },// end PlayersStore declaration
            getPlayers: function(callback){
                PlayersStore.keys(callback);
            },
            countOfPlayers: function(){
                return PlayersStore.keys().length;
            },
            isExistPlayer: function(name){
                value = PlayersStore.get(name);
                return ( value == undefined ) ? false : true;
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
