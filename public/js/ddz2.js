window.addEventListener('orientationchange', function () {
    console.log(`状态改变`);
    const width = document.documentElement.clientWidth;
    const height = document.documentElement.clientHeight;
    const contentDOM = document.getElementById('out');
    if (width < height) { // 竖屏
        // contentDOM.style.width = height + 'px';
        // contentDOM.style.height = '94vw';
        // contentDOM.style.transform = 'rotate(90deg)';
        contentDOM.style.top = (height - width) / 2 + 10 + 'px';
        contentDOM.style.left = 0 - (height - width) / 2 + 'px';
        // contentDOM.style.position = 'absolute';
    }
})
function init2(){
    const width = document.documentElement.clientWidth;
    const height = document.documentElement.clientHeight;
    const contentDOM = document.getElementById('out');
    if (width < height) { // 竖屏
        contentDOM.style.top = (height - width) / 2 + 10 + 'px';
        contentDOM.style.left = 0 - (height - width) / 2 + 'px';
    }
}
init2()