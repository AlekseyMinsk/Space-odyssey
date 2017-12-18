 
const STARTGAME = document.getElementById('start');
const LANDING = document.getElementById('landing'); 
let isItFirstEnter = true;
STARTGAME.addEventListener( 'click' , startGame );
let game;

function startGame() {
	LANDING.classList.add('hide');
	if(isItFirstEnter) {
		game = new Phaser.Game(1000, 600, Phaser.AUTO, '');
		game.state.add('Game', Game);
		game.state.start('Game');

		} else {
		game.paused = false;
		canvas.classList.remove('hide');
		startGameTime = game.time.now;
	}
}
