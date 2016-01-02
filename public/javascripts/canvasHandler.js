/**
 * Created by alexey on 02.01.16.
 */
document.addEventListener("DOMContentLoaded", function (event) {
    var canvas = document.getElementById("field");
    var context = canvas.getContext('2d');
    context.rect(0, 0, canvas.width, canvas.height);

// add linear gradient
    var grd = context.createLinearGradient(0, 0, 0, canvas.height);
// light blue
    grd.addColorStop(0, '#ffcc99');//'#ffbf80'||#ff9966
// dark blue
    grd.addColorStop(1, '#ffe5cc');//'#ffe5cc'||#ffddcc
    context.fillStyle = grd;
    context.fill();
    // draw vertical lines
    var Ystep = 60;
    for (var a = 0; a < 14; a++) {
        drawLine(context, canvas.width, a + Ystep, 0);
        Ystep += 60;
    }
    // draw vertical lines
    var Xstep = 60;
    for (var b = 0; b < 14; b++) {
        drawLine(context, canvas.width, 0, b + Xstep);
        Xstep += 60;
    }
});
function drawLine(context, line_length, x, y) {
    context.beginPath();
    context.moveTo(x, y);
    if(x)context.lineTo(x,line_length);
    if(y)context.lineTo(line_length,y);
    context.stroke();
}