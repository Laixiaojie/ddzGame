document.documentElement.style.overflow = 'hidden';
var startX,
    startY,
    biuX,
    biuY,
    ele = document.getElementsByClassName('airCraft')[0],
    winScreenHieght = window.screen.height,
    WinnerHeight = Math.floor(winScreenHieght * 0.4);

my$('#airWar').addEventListener('touchstart', function (even) {
    startX = even.touches[0].clientX;
    startY = even.touches[0].clientY - WinnerHeight;

    ele.style.left = startX + 'px';
    ele.style.top = startY + 'px';
    var timeId = fireBiu(350);
    this.addEventListener('touchend', function(even){
        clearInterval(timeId);
    })
})

my$('#airWar').addEventListener('touchmove', function (even) {
    biuX = even.touches[0].clientX
    biuY = even.touches[0].clientY - WinnerHeight

    ele.style.left = biuX + 'px';
    ele.style.top = biuY + 'px';
})



function biu(top, left) {
    var biu = document.createElement('div')
    biu.style.cssText = "position:absolute;top:" + top + "px;left:" + left + "px;width:8px;height:15px;";
    biu.className += 'biu';
    my$('#airWar').appendChild(biu)
    biu.style.background = "url('./imgs/b.png') no-repeat"
    var tempMoveTop = biu.offsetTop;

    var timgId = setInterval(function () {
        tempMoveTop = tempMoveTop - 10;
        biu.style.top = tempMoveTop + 'px'
        if (tempMoveTop < 0) {
            my$('#airWar').removeChild(biu);
            clearInterval(timgId);
        }
    }, 50)
}

function fireBiu(times){
    var timeId = setInterval(function(){
        biu(biuY, biuX);
    }, times)
    return timeId;
}

