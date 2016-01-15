function Game() {
    boardSize = 15;
    userSq = 1;
    machSq = -1;
    this.myTurn = false;
    this.flag = 0;
    winningMove = 9999999;
    openFour = 8888888;
    twoThrees = 7777777;
    this.data = {};
    this.f = new Array();
    this.s = new Array();
    this.q = new Array();
    for (i = 0; i < 20; i++) {
        this.f[i] = new Array();
        this.s[i] = new Array();
        this.q[i] = new Array();
        for (j = 0; j < 20; j++) {
            this.f[i][j] = 0;
            this.s[i][j] = 0;
            this.q[i][j] = 0;
        }
    }

    this.iteract = function (X, Y) {
        if (this.myTurn) return;
        this.f[X][Y] = userSq;
        this.myTurn = true;
        this.iLastUserMove = X;
        this.jLastUserMove = Y;

        if (this.winningPos(X, Y, userSq) == winningMove) {
            // We have Winner
            this.data.winner = 'usr';
            this.data.messge = 'вы выиграли';
            this.data.coords = {X: X * 50, Y: Y * 50};
        }
        else {
            return this.Iimove(this.iLastUserMove, this.jLastUserMove);
        }
    };

    this.Iimove = function (coorX, coorY) {
        this.flag++;
        var maxS = this.evaluatePos(this.s, userSq);
        var maxQ = this.evaluatePos(this.q, machSq);
        if (maxQ >= maxS) {
            maxS = -1;
            for (i = 0; i < boardSize; i++) {
                for (j = 0; j < boardSize; j++) {
                    if (this.q[i][j] == maxQ && this.s[i][j] > maxS) {
                        maxS = this.s[i][j];
                        var iMach = i;
                        var jMach = j;
                    }
                }
            }
        }
        else {
            maxQ = -1;
            for (i = 0; i < boardSize; i++) {
                for (j = 0; j < boardSize; j++) {
                    if (this.s[i][j] == maxS && this.q[i][j] > maxQ) {
                        maxQ = this.q[i][j];
                        var iMach = i;
                        var jMach = j;
                    }
                }
            }
        }
        this.f[iMach][jMach] = machSq;
        this.data.X = iMach * 50;
        this.data.Y = jMach * 50;
        this.data.f = this.flag;
        if (this.winningPos(iMach, jMach, machSq) == winningMove) {
            this.data.winner = 'cpu';
            this.data.messge = 'вы проиграли';
            this.data.coords = {X: iMach * 50, Y: jMach * 50};
        }
        else {
            this.myTurn = false;
        }
        return this.data;
    };

    this.goStep = function (X,Y,enemySET) {
        this.f[X][Y] = userSq;
        winner = (this.winningPos(X, Y,userSq)== winningMove);
        if(winner){
            console.log(f);
            return 'winner';
        }
/*        else if(Object.keys(enemySET).length>0){
            his.f[enemySET.X][enemySET.Y] = machSq;
            winner = (this.winningPos(enemySET.X, enemySET.Y,machSq)== winningMove);
            return winner ? 'youLoose':'continue';
        }*/
        else{
            return 'continue';
        }
    };
    this.hasNeighbors = function (i, j) {
        if (j > 0 && this.f[i][j - 1] != 0) return 1;
        if (j + 1 < boardSize && this.f[i][j + 1] != 0) return 1;
        if (i > 0) {
            if (this.f[i - 1][j] != 0) return 1;
            if (j > 0 && this.f[i - 1][j - 1] != 0) return 1;
            if (j + 1 < boardSize && this.f[i - 1][j + 1] != 0) return 1;
        }
        if (i + 1 < boardSize) {
            if (this.f[i + 1][j] != 0) return 1;
            if (j > 0 && this.f[i + 1][j - 1] != 0) return 1;
            if (j + 1 < boardSize && this.f[i + 1][j + 1] != 0) return 1;
        }
        return 0;
    };
    this.w = new Array(0, 20, 17, 15.4, 14, 10);
    this.nPos = new Array();
    this.dirA = new Array();

    this.winningPos = function (i, j, mySq) {
        test3 = 0;

        var L = 1;
        var m = 1;
        while (j + m < boardSize && this.f[i][j + m] == mySq) {
            L++;
            m++
        }
        var m1 = m;
        var m = 1;
        while (j - m >= 0 && this.f[i][j - m] == mySq) {
            L++;
            m++
        }
        var m2 = m;
        if (L > 4) {
            return winningMove;
        }
        this.side1 = (j + m1 < boardSize && this.f[i][j + m1] == 0);
        this.side2 = (j - m2 >= 0 && this.f[i][j - m2] == 0);

        if (L == 4 && (this.side1 || this.side2)) test3++;
        if (this.side1 && this.side2) {
            if (L == 4) return openFour;
            if (L == 3) test3++;
        }
        var L = 1;
        var m = 1;
        while (i + m < boardSize && this.f[i + m][j] == mySq) {
            L++;
            m++
        }
        var m1 = m;
        var m = 1;
        while (i - m >= 0 && this.f[i - m][j] == mySq) {
            L++;
            m++
        }
        var m2 = m;
        if (L > 4) {
            return winningMove;
        }
        this.side1 = (i + m1 < boardSize && this.f[i + m1][j] == 0);
        this.side2 = (i - m2 >= 0 && this.f[i - m2][j] == 0);
        if (L == 4 && (this.side1 || this.side2)) test3++;
        if (this.side1 && this.side2) {
            if (L == 4) return openFour;
            if (L == 3) test3++;
        }
        if (test3 == 2) return twoThrees;

        L = 1;
        m = 1;
        while (i + m < boardSize && j + m < boardSize && this.f[i + m][j + m] == mySq) {
            L++;
            m++
        }
        m1 = m;
        m = 1;
        while (i - m >= 0 && j - m >= 0 && this.f[i - m][j - m] == mySq) {
            L++;
            m++
        }
        m2 = m;
        if (L > 4) {
            return winningMove;
        }
        side1 = (i + m1 < boardSize && j + m1 < boardSize && this.f[i + m1][j + m1] == 0);
        side2 = (i - m2 >= 0 && j - m2 >= 0 && this.f[i - m2][j - m2] == 0);
        if (L == 4 && (side1 || side2)) test3++;
        if (side1 && side2) {
            if (L == 4) return openFour;
            if (L == 3) test3++;
        }
        if (test3 == 2) return twoThrees;

        L = 1;
        m = 1;
        while (i + m < boardSize && j - m >= 0 && this.f[i + m][j - m] == mySq) {
            L++;
            m++
        }
        m1 = m;
        m = 1;
        while (i - m >= 0 && j + m < boardSize && this.f[i - m][j + m] == mySq) {
            L++;
            m++
        }
        m2 = m;
        if (L > 4) {
            return winningMove;
        }
        side1 = (i + m1 < boardSize && j - m1 >= 0 && this.f[i + m1][j - m1] == 0);
        side2 = (i - m2 >= 0 && j + m2 < boardSize && this.f[i - m2][j + m2] == 0);
        if (L == 4 && (side1 || side2)) test3++;
        if (side1 && side2) {
            if (L == 4) return openFour;
            if (L == 3) test3++;
        }
        if (test3 == 2) return twoThrees;
        return -1;
    };
    this.evaluatePos = function (a, mySq) {
        var maxA = -1;
        for (i = 0; i < boardSize; i++) {
            for (j = 0; j < boardSize; j++) {

                if (this.f[i][j] != 0) {
                    a[i][j] = -1;
                    continue;
                }
                if (this.hasNeighbors(i, j) == 0) {
                    a[i][j] = -1;
                    continue;
                }
                var wp = this.winningPos(i, j, mySq);
                if (wp == winningMove) {
                    a[i][j] = winningMove;
                    return winningMove;
                }
                if (wp >= twoThrees) {
                    a[i][j] = wp;
                    if (maxA < wp) maxA = wp;
                    continue;
                }

                var minM = i - 4;
                if (minM < 0) minM = 0;
                var minN = j - 4;
                if (minN < 0) minN = 0;
                var maxM = i + 5;
                if (maxM > boardSize) maxM = boardSize;
                var maxN = j + 5;
                if (maxN > boardSize) maxN = boardSize;

                this.nPos[1] = 1;
                var A1 = 0;
                var m = 1;
                while (j + m < maxN && this.f[i][j + m] != -mySq) {
                    this.nPos[1]++;
                    A1 += this.w[m] * this.f[i][j + m];
                    m++
                }
                if (j + m >= boardSize || this.f[i][j + m] == -mySq) A1 -= (this.f[i][j + m - 1] == mySq) ? (this.w[5] * mySq) : 0;
                m = 1;
                while (j - m >= minN && this.f[i][j - m] != -mySq) {
                    this.nPos[1]++;
                    A1 += this.w[m] * this.f[i][j - m];
                    m++
                }
                if (j - m < 0 || this.f[i][j - m] == -mySq) A1 -= (this.f[i][j - m + 1] == mySq) ? (this.w[5] * mySq) : 0;

                this.nPos[2] = 1;
                var A2 = 0;
                m = 1;
                while (i + m < maxM && this.f[i + m][j] != -mySq) {
                    this.nPos[2]++;
                    A2 += this.w[m] * this.f[i + m][j];
                    m++
                }
                if (i + m >= boardSize || this.f[i + m][j] == -mySq) A2 -= (this.f[i + m - 1][j] == mySq) ? (this.w[5] * mySq) : 0;
                m = 1;
                while (i - m >= minM && this.f[i - m][j] != -mySq) {
                    this.nPos[2]++;
                    A2 += this.w[m] * this.f[i - m][j];
                    m++
                }
                if (i - m < 0 || this.f[i - m][j] == -mySq) A2 -= (this.f[i - m + 1][j] == mySq) ? (this.w[5] * mySq) : 0;

                this.nPos[3] = 1;
                var A3 = 0;
                m = 1;
                while (i + m < maxM && j + m < maxN && this.f[i + m][j + m] != -mySq) {
                    this.nPos[3]++;
                    A3 += this.w[m] * this.f[i + m][j + m];
                    m++
                }
                if (i + m >= boardSize || j + m >= boardSize || this.f[i + m][j + m] == -mySq) A3 -= (this.f[i + m - 1][j + m - 1] == mySq) ? (this.w[5] * mySq) : 0;
                m = 1;
                while (i - m >= minM && j - m >= minN && this.f[i - m][j - m] != -mySq) {
                    this.nPos[3]++;
                    A3 += this.w[m] * this.f[i - m][j - m];
                    m++
                }
                if (i - m < 0 || j - m < 0 || this.f[i - m][j - m] == -mySq) A3 -= (this.f[i - m + 1][j - m + 1] == mySq) ? (this.w[5] * mySq) : 0;

                this.nPos[4] = 1;
                var A4 = 0;
                m = 1;
                while (i + m < maxM && j - m >= minN && this.f[i + m][j - m] != -mySq) {
                    this.nPos[4]++;
                    A4 += this.w[m] * this.f[i + m][j - m];
                    m++;
                }
                if (i + m >= boardSize || j - m < 0 || this.f[i + m][j - m] == -mySq) A4 -= (this.f[i + m - 1][j - m + 1] == mySq) ? (this.w[5] * mySq) : 0;
                m = 1;
                while (i - m >= minM && j + m < maxN && this.f[i - m][j + m] != -mySq) {
                    this.nPos[4]++;
                    A4 += this.w[m] * this.f[i - m][j + m];
                    m++;
                }
                if (i - m < 0 || j + m >= boardSize || this.f[i - m][j + m] == -mySq) A4 -= (this.f[i - m + 1][j + m - 1] == mySq) ? (this.w[5] * mySq) : 0;

                this.dirA[1] = (this.nPos[1] > 4) ? A1 * A1 : 0;
                this.dirA[2] = (this.nPos[2] > 4) ? A2 * A2 : 0;
                this.dirA[3] = (this.nPos[3] > 4) ? A3 * A3 : 0;
                this.dirA[4] = (this.nPos[4] > 4) ? A4 * A4 : 0;

                A1 = 0;
                A2 = 0;
                for (k = 1; k < 5; k++) {
                    if (this.dirA[k] >= A1) {
                        A2 = A1;
                        A1 = this.dirA[k]
                    }
                }
                thisA = A1 + A2;

                a[i][j] = thisA;
                if (thisA > maxA) {
                    maxA = thisA;
                }
            }
        }
        return maxA;
    };
    return this;
};
module.exports = Game;