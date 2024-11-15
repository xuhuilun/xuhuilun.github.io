
document.addEventListener('DOMContentLoaded', function () {
    var musicPlayer = document.getElementById('music - player - container');
    if (musicPlayer) {
        var iframe = musicPlayer.getElementsByTagName('iframe')[0];
        // 模拟用户点击事件来触发播放
        iframe.contentWindow.postMessage('{"name": "play"}', '*');
    }
});



document.addEventListener('DOMContentLoaded', function () {
    const starsContainer = document.createElement('div');
    starsContainer.style.position = 'fixed';
    starsContainer.style.top = '0';
    starsContainer.style.left = '0';
    starsContainer.style.width = '100%';
    starsContainer.style.height = '100%';
    starsContainer.style.pointerEvents = 'none';
    document.body.appendChild(starsContainer);

    function createStar() {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.position = 'absolute';
        star.style.width = '2px';
        star.style.height = '2px';
        star.style.background = 'white';
        star.style.borderRadius = '50%';
        star.style.boxShadow = '0 0 2px #fff';
        star.style.opacity = '0.7';
        starsContainer.appendChild(star);

        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;

        star.style.left = `${x}px`;
        star.style.top = `${y}px`;

        setTimeout(() => {
            star.remove();
        }, 2000);
    }

    document.addEventListener('mousemove', function (e) {
        for (let i = 0; i < 10; i++) {
            createStar();
        }
    });
});