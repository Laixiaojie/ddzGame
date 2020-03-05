window.addEventListener('orientationchange', function () {
    const width = document.documentElement.clientWidth;
    const height = document.documentElement.clientHeight;
    const contentDOM = document.getElementById('out');
    if (width < height) { // 竖屏
        contentDOM.style.width = height + 'px';
        contentDOM.style.height = width + 'px';
        contentDOM.style.top = (height - width) / 2 + 'px';
        contentDOM.style.left = 0 - (height - width) / 2 + 'px';
        contentDOM.style.transform = 'rotate(90deg)';
    }
})