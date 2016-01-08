/**
 * Created by alexey on 05.01.16.
 */

var TOTLIN, ATFAC, PLAYER, OPPON, IGROK, PROGR, WINLINE, GAMEEND;
var IGT, X, Y, LX, LY, OTMENA = false;
var BOARD, VALUE, LINP, WEIGHT = new Array(0, 0, 4, 20, 100, 500, 0);
function sgn(T) {
    if (T < 0) T = -1; else if (T > 0) T = 1; else T = 0;
    return T;
}
/*function INICIAL() {
    var I, J, tr;
    var f = '<table id="f">';
    BOARD = new Array();
    VALUE = new Array();
    LINP = new Array();
    for (I = 0; I <= 20; I++) {
        if (I > 0 && I < 20) tr = '<tr>';
        BOARD[I] = new Array();
        VALUE[I] = new Array();
        LINP[I] = new Array();
        for (J = 0; J <= 20; J++) {
            if (I * J > 0 && I < 20 && J < 20) tr += '<td id="c-' + I + '-' + J + '" onclick="ANAKEY(this);">&nbsp;</td>';
            VALUE[I][J] = new Array();
            LINP[I][J] = new Array();
            for (C = 1; C < 3; C++) {
                LINP[I][J][C] = new Array();
            }
        }
        if (I > 0 && I < 20) {
            tr += '</tr>';
            f += tr;
        }
    }
    f += '</table>';
    document.write(f);
    PROGR = 0;
    IGROK = 0;
}*/
function ANAKEY(a) {
    X = a.id.replace(/c-/, '').replace(/-.*/, '');// получить координаты хода
    Y = a.id.replace(/c-/, '').replace(/.*-/, '');// получить координаты хода
    if (BOARD[X][Y] == 0) {
        BOARD[X][Y] = 1;
        MOVEXOD();
        if (GAMEEND) {
            IGROK += 1;
           //'Поздравляем! Вы выиграли!');
        } else {
            PRGMAK();
        }
    }
}
function NEWGAME() {
    var I, J, C, D;
    if (OTMENA) {
       // alert('Игра не закончена!');
        return false;
    }
    for (I = 1; I <= 19; I++) for (J = 1; J <= 19; J++) {
     //   geid('c-' + I + '-' + J).innerHTML = '&nbsp;';
      //  geid('c-' + I + '-' + J).className = '';
        BOARD[I][J] = 0;
        for (C = 1; C < 3; C++) {
            VALUE[I][J][C] = 0;
            for (D = 0; D < 4; D++) LINP[I][J][C][D] = 0;
        }
    }
  //  geid('txt').innerHTML = 'Ваш ход';
  //  geid('prg').innerHTML = PROGR;
  //  geid('igr').innerHTML = IGROK;
    PLAYER = 1;
    OTMENA = true;
    TOTLIN = (19 * (19 - 4) + (19 - 4) * (19 - 4)) * 4;
    LX = 1;
    LY = 1;
    X = 10;
    Y = X;
    ATFAC = parseInt(IGROK / 2);
    if (ATFAC > 15) ATFAC = 15;
    for (I = 1; I < 20; I++) for (J = 1; J < 20; J++) {
        IGT = BOARD[I][J];
        DRAMOV(I, J);
    }
}
function DRAMOV(XX, YY) {
    var idt;
    LX = XX;
    LY = YY;
    idt = 'c-' + XX + '-' + YY;
    if (IGT == 1) {
      //  geid(idt).innerHTML = 'x';
    } else if (IGT == 2) {
      //  geid(idt).className = 'red';
     //   geid(idt).innerHTML = 'o';
    }
}
function MOVEXOD() {
    var T, K, L, X1, Y1, X11, Y11, DX, DY, NUM, LIO, LIP, TTT, idt;
    WINLINE = 0;
    OPPON = 3 - PLAYER;
    GAMEEND = false;
    idt = 'c-' + LX + '-' + LY;
   // geid(idt).className = '';
    for (T = 0; T < 4; T++) for (K = 0; K < 5; K++) {
        X1 = parseInt(X) + sgn(T - 2) * K;
        Y1 = Y - sgn(T) * K;
        switch (T) {
            case 0:
                TTT = X1 > 0 && X1 < 16;
                break;
            case 1:
                TTT = (X1 > 0 && X1 < 16) && (Y1 > 0 & Y1 < 16);
                break;
            case 2:
                TTT = Y1 > 0 && Y1 < 16;
                break;
            case 3:
                TTT = (X1 > 4 && X1 < 20) && (Y1 > 0 && Y1 < 16);
                break;
            default:
                ;
        }
        if (TTT) {
            NUM = LINP[X1][Y1][PLAYER][T];
            NUM = NUM + 1;
            if (NUM == 1) TOTLIN--; else if (NUM == 5) GAMEEND = true;
            LINP[X1][Y1][PLAYER][T] = NUM;
            if (GAMEEND && (WINLINE == 0)) WINLINE = T + 1;
            LIP = LINP[X1][Y1][PLAYER][T];
            LIO = LINP[X1][Y1][OPPON][T];
            for (L = 0; L < 5; L++) {
                X11 = X1 - sgn(T - 2) * L;
                Y11 = parseInt(Y1) + sgn(T) * L;
                if (LIO == 0) VALUE[X11][Y11][PLAYER] = VALUE[X11][Y11][PLAYER] + WEIGHT[LIP + 1] - WEIGHT[LIP];
                else if (LIP == 1) VALUE[X11][Y11][OPPON] = VALUE[X11][Y11][OPPON] - WEIGHT[LIO + 1];
            }
        }
    }
    BOARD[X][Y] = PLAYER;
    IGT = PLAYER;
    if (GAMEEND) {
        switch (WINLINE) {
            case 1:
                DX = 1;
                DY = 0;
                break;
            case 2:
                DX = 1;
                DY = 1;
                break;
            case 3:
                DX = 0;
                DY = 1;
                break;
            case 4:
                DX = -1;
                DY = 1;
                break;
            default:
                ;
        }
        do {
            X = (X - 0 + DX);
            Y = (Y - 0 + DY);
        } while (BOARD[X][Y] == PLAYER);
        X -= DX;
        Y -= DY;
        for (I = 1; I < 6; I++) {
            idt = 'c-' + X + '-' + Y;
         //   geid(idt).className = 'green';
            DRAMOV(X, Y);// render x or o ----------------------------
            X = X - DX;
            Y = Y - DY;
        }
    } else {
        DRAMOV(X, Y);
        PLAYER = OPPON;
    }
}
function PRGMAK() {
    var I, J, MAX, VALZ;
    if (TOTLIN <= 0) {
        GAMEEND = true;
       //'Tie game!');
    } else {
        OPPON = 3 - PLAYER;
        MAX = -32767;
        X = 10;
        Y = 10;
        if (BOARD[X][Y] == 0) MAX = 4;
        for (I = 1; I < 20; I++) for (J = 1; J < 20; J++) {
            if (BOARD[I][J] == 0) {
                VALZ = parseInt(VALUE[I][J][PLAYER] * (16 + ATFAC) / 16) + VALUE[I][J][OPPON] + parseInt(Math.random() * 4);
                if (VALZ > MAX) {
                    X = I;
                    Y = J;
                    MAX = VALZ;
                }
            }
        }
        MOVEXOD();
        if (GAMEEND) {
            PROGR++;
            //'Компьютер победил!';
        }
    }
}

/*function geid(i) {
    return document.getElementById(i);
}*/
