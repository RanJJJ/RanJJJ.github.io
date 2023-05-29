const fullscreenButton = document.getElementById('fullscreen-button');
const gameContainer = document.getElementById('game-container');

fullscreenButton.innerText = ''; // Установить пустую строку в качестве текста кнопки

fullscreenButton.addEventListener('click', toggleFullscreen);

function toggleFullscreen() {
    if (document.fullscreenElement) {
        // Если игра уже находится в полноэкранном режиме, выходим из него
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) { // Firefox
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) { // Chrome, Safari and Opera
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { // IE/Edge
            document.msExitFullscreen();
        }
    } else {
        // Если игра не в полноэкранном режиме, разворачиваем на весь экран
        if (gameContainer.requestFullscreen) {
            gameContainer.requestFullscreen();
        } else if (gameContainer.mozRequestFullScreen) { // Firefox
            gameContainer.mozRequestFullScreen();
        } else if (gameContainer.webkitRequestFullscreen) { // Chrome, Safari and Opera
            gameContainer.webkitRequestFullscreen();
        } else if (gameContainer.msRequestFullscreen) { // IE/Edge
            gameContainer.msRequestFullscreen();
        }
    }
}

// Обработчик события, когда игра разворачивается на весь экран или выходит из полноэкранного режима
document.addEventListener('fullscreenchange', handleFullscreenChange);
document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
document.addEventListener('mozfullscreenchange', handleFullscreenChange);
document.addEventListener('MSFullscreenChange', handleFullscreenChange);


function handleFullscreenChange() {
    if (document.fullscreenElement) {
        // Игра находится в полноэкранном режиме
        fullscreenButton.textContent = 'Выйти из полноэкранного режима';
    } else {

        // Игра не в полноэкранном режиме
        fullscreenButton.textContent = 'Развернуть на весь экран';

    }
    fullscreenButton.innerText = ''; // Установить пустую строку в качестве текста кнопки
}
