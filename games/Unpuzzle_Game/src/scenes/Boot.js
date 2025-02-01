import { Scene } from "phaser";
import game from "../main.js";

export class Boot extends Scene {
  constructor() {
    super("Boot");
  }

  preload() {
    this.cameras.main.setBackgroundColor(0xa020f0);

    this.load.image("unpuzzle_game_logo", "assets/unpuzzle_game_logo.png");
  }

  create() {
    this.scene.start("Preloader");
    // this.scene.get('GameTemplate').changeScene('Boot', 'Preloader');
  }
}

export default Boot;
