module.exports = function () {

    var X = [], Y = [], directions = [];
    var Xlength, Ylength, lastXindex, lastYindex;

    // North direction object
    directions[0] = new Object();
    directions[0].isPossibleThisDirect = function () {
        return (lastYindex == 1) ? false : true;
    };
    directions[0].getThisWay = function () {
        var data = {};
        Y[lastYindex + 1] = Y[lastYindex] - 50;
        data.X = X[lastXindex];
        data.Y = Y[lastYindex + 1];
        console.log("North Direction: [" + data.X + ":" + data.Y + "]");
        return data;
    };

    // South direction object
    directions[1] = new Object();
    directions[1].isPossibleThisDirect = function () {
        return (lastYindex == 14) ? false : true;
    };
    directions[1].getThisWay = function () {
        var data = {};
        Y[lastYindex - 1] = Y[lastYindex] + 50;
        data.X = X[lastXindex];
        data.Y = Y[lastYindex - 1];
        console.log("South Direction: [" + data.X + ":" + data.Y + "]");
        return data;
    };

    // west direction object
    directions[2] = new Object();
    directions[2].isPossibleThisDirect = function () {
        return (lastXindex==1) ? false : true;
    };
    directions[2].getThisWay = function () {
        var data = {};
        X[lastXindex - 1] = X[lastXindex] - 50;
        data.X = X[lastXindex - 1];
        data.Y = Y[lastYindex];
        console.log("West Direction: [" + data.X + ":" + data.Y + "]");
        return data;
    };

    // East direction object
    directions[3] = new Object();
    directions[3].isPossibleThisDirect = function () {
        return (X.length == 15) ? false : true;
    };
    directions[3].getThisWay = function () {
        var data = {};
        X[lastXindex+1]=X[lastXindex] + 50;
        data.X = X[lastXindex + 1];
        data.Y = Y[lastYindex];
        console.log("East Direction: [" + data.X + ":" + data.Y + "]");
        return data;
    };

    // NorthWest direction object
    directions[4] = new Object();
    directions[4].isPossibleThisDirect = function () {
        return (lastYindex==1||lastXindex==1) ? false:true;
    };
    directions[4].getThisWay = function () {
        var data = {};
        X[lastXindex - 1] = X[lastXindex] - 50;
        Y[lastYindex - 1] = Y[lastYindex] - 50;
        data.X = X[lastXindex - 1];
        data.Y = Y[lastYindex - 1];
        console.log("NorthWest Direction: [" + data.X + ":" + data.Y + "]");
        return data;
    };

    // NorthEast direction way
    directions[5] = new Object();
    directions[5].isPossibleThisDirect = function () {
        return (lastYindex==1||lastXindex==14)? false:true;
    };
    directions[5].getThisWay = function () {
        var data = {};
        X[lastXindex+1]=X[lastXindex] + 50;
        Y[lastYindex - 1] = Y[lastYindex] - 50;
        data.X = X[lastXindex + 1];
        data.Y = Y[lastYindex - 1];
        console.log("NorthEast Direction: [" + data.X + ":" + data.Y + "]");
        return data;
    };

    // SouthEast direction object
    directions[6] = new Object();
    directions[6].isPossibleThisDirect = function () {
        return (lastYindex>13||lastXindex>13)? false:true;
    };
    directions[6].getThisWay = function () {
        var data = {};
        X[lastXindex+1]=X[lastXindex] + 50;
        Y[lastYindex+1]=Y[lastYindex] + 50;
        data.X = X[lastXindex + 1];
        data.Y = Y[lastYindex + 1];
        console.log("SouthEast Direction: [" + data.X + ":" + data.Y + "]");
        return data;
    };

    // SouthWest direction object
    directions[7] = new Object();
    directions[7].isPossibleThisDirect = function () {
        return (lastYindex>13||lastXindex==1)? false:true;
    };
    directions[7].getThisWay = function () {
        var data = {};
        X[lastXindex - 1] = X[lastXindex] - 50;
        Y[lastYindex + 1]=Y[lastYindex] + 50;
        data.X = X[lastXindex - 1];
        data.Y = Y[lastYindex + 1];
        console.log("SouthWest Direction: [" + data.X + ":" + data.Y + "]");
        return data;
    };
    shuffle = function (array) {
        var currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    };

    var pusher = function (x, y) {
        lastXindex = x / 50;
        lastYindex = y / 50;
        X[lastXindex] = x;
        Y[lastYindex] = y;
    };
    var logic = function () {
        var arr = shuffle(directions);
        var flag = false;
        for (iter in arr) {
            flag = arr[iter].isPossibleThisDirect();
            if (flag) {
                return arr[iter].getThisWay();
            }
        }
    };

    return {
        registerStep: function (x, y) {
            pusher(x, y);
            var data = {};
            /*            data.X = X[Xlength - 1] + 50;// TODO: add logic to response
             data.Y = Y[Ylength - 1] + 100;*/
            return logic();
        }
    };
};