/**
 * Created by alexey on 02.01.16.
 */
setOfField={};
gridY=[];
grid=[];
iter=0;
function getPosition(event) {
    var data={};
    var rect = event.target.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    var coor1= x % 50, coor2 = y % 50;
    if (coor1 <= 5 && coor2 <= 5) {
        data.X=(x-coor1)/50;
        data.Y=(y-coor2)/50;

        drawFishka(event.target,x-coor1,y-coor2,'pl',function(){
            soundEffect.play();
            $('#Iam').append("<br>X="+(data.X+1)+" : "+"Y="+(data.Y+1));
            id=socket.id;
            if(iter==0) socket.emit("step",id,data);
            else socket.emit("step",id,data,setOfField[iter]);
            iter++;
            setOfField[iter]=data.X+":"+data.Y;
        });
    }
};
document.addEventListener("DOMContentLoaded", function (event) {
    var canvas = document.getElementById("field");
    var context = canvas.getContext('2d');
    context.rect(0, 0, canvas.width, canvas.height);

// add linear gradient
    var grd = context.createLinearGradient(0, 0, 0, canvas.height);

    grd.addColorStop(0, '#ffcc99');//'#ffbf80'||#ff9966

    grd.addColorStop(1, '#ffe5cc');//'#ffe5cc'||#ffddcc
    context.fillStyle = grd;
    context.fill();
    // draw grid
    var opts = {
        distance: 50,
        lineWidth: 1,
        gridColor: "#081400",
        caption: false,
        horizontalLines: true,
        verticalLines: true
    };
    new Grid(opts).draw(context);
    canvas.addEventListener("mousedown",getPosition);
});
    function drawFishka(canvas, X, Y, type,callback) {
        if(grid.indexOf(X+","+Y)>=0) return null;
        var context = canvas.getContext('2d');
        var radius = 10;
        context.beginPath();
        context.arc(X, Y, radius, 0, 2 * Math.PI, false);
        context.fillStyle = (type=='pl') ? 'green':'white';
        context.fill();
        context.lineWidth = 5;
        context.strokeStyle = '#003300';
        context.stroke();
        grid.push(X+","+Y);
        callback();
    }