import { Scene } from 'phaser';
import game from '../main.js';

import TitlePage from './TitlePage.js';
import gameLevels from './gameLevels.js';

let gameColors = ["0X20f0e4", "0x3df020", "0x20f05a", "0x20bef0", "0x2073f0", "0x2041f0", "0xad20f0", "0xf020e8"];
const startButton = document.getElementById('start-button');

export class GameTemplate extends Scene {
  constructor() {
    super('GameTemplate');
  }

  create() {
    this.cameras.main.setBackgroundColor(0xA020F0);
    let exitButtonX = 27;

    let exitButton = this.add.image(exitButtonX, this.game.config.height - 130, 'exitButton').setScale(0.52);
    exitButton.setInteractive();
    exitButton.setDepth(1);

    this.input.setDraggable(exitButton);

    exitButton.on('drag', (pointer, dragX, dragY) => {
      exitButton.x = exitButtonX; // Keeps the button attached to the left side
      exitButton.y = Phaser.Math.Clamp(dragY, 35, this.game.config.height - 35);
    });

    exitButton.on('pointerup', () => {
      this.game.destroy(true);
      startButton.style.display = 'block';
      this.exitFullScreen();
    });

    this.loadScene('gameLevels');
  }

  // Method to load a new scene and keep the template scene on top
  loadScene(sceneKey) {
    this.cameras.main.fadeOut(170, 0, 0, 0, (camera, progress) => {
      if (progress === 1) {
        // Fade in effect
        this.cameras.main.fadeIn(400, 0, 0, 0);
        this.scene.launch(sceneKey);
      }
    });
  }

  loadScene(sceneKey, newSceneData) {
    this.cameras.main.fadeOut(170, 0, 0, 0, (camera, progress) => {
      if (progress === 1) {
        // Fade in effect
        this.cameras.main.fadeIn(400, 0, 0, 0);
        this.scene.launch(sceneKey, newSceneData);
      }
    });
    
    if(sceneKey == "Game"){
      let randomColor = gameColors[Math.floor(Math.random() * gameColors.length)];
      this.cameras.main.setBackgroundColor(randomColor);
    }else{
      this.cameras.main.setBackgroundColor(0xA020F0);
    }
    
  }

  // Method to change scenes while keeping the template scene on top
  changeScene(currentSceneKey, newSceneKey) {
    if (this.scene.isActive(currentSceneKey)) {
      this.scene.stop(currentSceneKey);
      this.loadScene(newSceneKey);
    }
    // Fade in effect
    this.cameras.main.fadeIn(100, 0, 0, 0);
  }

  changeScene(currentSceneKey, newSceneKey, newSceneData) {
    if (this.scene.isActive(currentSceneKey)) {
      this.scene.stop(currentSceneKey);
      this.loadScene(newSceneKey, newSceneData);
    }
  }

  playnextSceneSound() {
    // Play the sound
    let sound = this.sound.add('next_scene');
    sound.play({ volume: 0.43 });

    // Stop the sound after 1 second
    this.time.delayedCall(300, () => {
      sound.stop();
    });
  }

  exitFullScreen() {
    if (document.fullscreenElement) {
        document.exitFullscreen().catch(err => {
            console.error(`Error attempting to exit full-screen mode: ${err.message} (${err.name})`);
        });
    }
}
}

export default GameTemplate;
