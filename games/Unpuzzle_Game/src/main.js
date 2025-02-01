import Boot from "./scenes/Boot";
import GameTemplate from "./scenes/GameTemplate";
import Game from "./scenes/Game";
import GameOver from "./scenes/GameOver";
import MainMenu from "./scenes/MainMenu";
import Preloader from "./scenes/Preloader";
import outlinedScene from "./scenes/outlinedScene";
import gameLevels from "./scenes/gameLevels";
import TitlePage from "./scenes/TitlePage";
import scorePopUp from "./scenes/scorePopUp";
import _animationExperiment from "./scenes/_animationExperiment";

let fullScreen = document.getElementById("unpuzzle-game-conainer");
var config;
window.onload = function () {
  const gameOptions = {
    TileSize: 100,
    tileSpacing: 15,
    boardSize: { rows: 5, cols: 5 },
    tweenSpeed: 50,
    aspectRatio: 16 / 9,
    padding: 100,
  };

  let width = gameOptions.boardSize.cols * gameOptions.padding;
  let height = width * gameOptions.aspectRatio;

  config = {
    type: Phaser.AUTO,
    width: width,
    height: height,
    parent: "unpuzzle-game-conainer",
    backgroundColor: "#028af8",
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [
      Boot,
      Preloader,
      _animationExperiment,
      GameTemplate,
      TitlePage,
      MainMenu,
      Game,
      scorePopUp,
      GameOver,
      outlinedScene,
      gameLevels,
    ],
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 0 },
      },
    },
  };
};

let game;
const startButton = document.getElementById("startGame");

startButton.addEventListener("click", () => {
  // Hide the start button
  handleFullScreen();

  // Initialize the Phaser game
  game = new Phaser.Game(config);

  // Listen for exiting fullscreen mode
  document.addEventListener("fullscreenchange", () => {
    if (!document.fullscreenElement) {
      game.destroy(true);
      startButton.style.display = "block";
    }
  });
});

function handleFullScreen() {
  startButton.style.display = "none";

  fullScreen.style.filter = "unset";
  fullScreen.style.backgroundImage = "none";
  fullScreen.style.boxShadow = "none";
  fullScreen.classList.remove("game-box-bg-img");

  if (fullScreen.requestFullscreen) {
    fullScreen.requestFullscreen();
  } else if (fullScreen.mozRequestFullScreen) {
    /* Firefox */
    fullScreen.mozRequestFullScreen();
  } else if (fullScreen.webkitRequestFullscreen) {
    /* Chrome, Safari and Opera */
    fullScreen.webkitRequestFullscreen();
  } else if (fullScreen.msRequestFullscreen) {
    /* IE/Edge */
    fullScreen.msRequestFullscreen();
  } else if (isIOS) {
    fullScreen.style.width = "100vw";
    fullScreen.style.height = "100vh";
    fullScreen.style.position = "fixed";
    fullScreen.style.top = "0";
    fullScreen.style.left = "0";
    fullScreen.style.zIndex = "999999999";
    fullScreen.style.background = "aliceblue";
    fullScreen.style.paddingTop = "2rem";
    fullScreen.style.paddingBottom = "2rem";
    fullScreen.style.overflow = "scroll";

    // Apply overflow and set a specific height to enable scrolling
    fullScreen.style.overflow = "scroll"; // or 'scroll' if you always want the scrollbar to be visible
    fullScreen.style.maxHeight = "calc(100vh - 2rem)"; // Adjust the height based on your layout
  }
}

export default game;
