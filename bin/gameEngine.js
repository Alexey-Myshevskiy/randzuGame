module.exports = function () {

    var X = [];
    var Y = [];
    var Xlength;
    var Ylength;
    //^|
    var IsNorthDirect = function () {

    };

    // |
    var IsSouthDirect = function () {

    };

    // |
    var IsWestDirect = function () {

    };

    // |
    var IsEastDirect = function () {

    };

    // |
    var IsSouthWestDirect = function () {

    };

    var IsNorthEastDirect = function () {

    };
    var IsNorthWestDirect = function () {

    };
    var pusher = function (x, y) {
        Xlength = X.push(x);
        Ylength = Y.push(y);
    };
    return {
        registerStep: function (x, y) {
            pusher(x, y);
            var data = {};
            data.X = X[Xlength-1]+50;// TODO: add logic to response
            data.Y = Y[Ylength-1]+100;
            return data;
        }
    };
};