import Game from './Game.js';
import gameLevels from './gameLevels.js';


let currentTexture = 'lightBtn';
let lightOrDark;
let currentSoundState = "sound";
let SoundOrNoSound;
let backBtn;

let levelNumber;

class outlinedScene extends Phaser.Scene {
    constructor() {
        super({ key: 'outlinedScene' });
    }

    preload() {
        
    }

    init(data){
        levelNumber = data.levelNumber;
    }

    create() {
        // Get the width and height of the game
        let gameWidth = this.cameras.main.width;
        let gameHeight = this.cameras.main.height;

        // Create a graphics object for drawing
        let graphics = this.add.graphics();
        // Define the height of the strips
        let stripHeight = 100;
        // Set the fill color and alpha for the strips
        graphics.fillStyle(0x2E2E2E, 0.83);
        // Draw the top strip
        graphics.fillRect(0, 0, gameWidth, stripHeight);
        // Draw the bottom strip
        graphics.fillRect(0, gameHeight - stripHeight, gameWidth, stripHeight);



        backBtn = this.add.image(100, 50, 'back').setDisplaySize(65, 65).setInteractive().setAlpha(1.2);
        backBtn.on('pointerdown', this.setGridValFalseAndDestroyOutline, this);


        let gridLevelBtn = this.add.image( 100, gameHeight - 50, 'gridLevels').setDisplaySize(60, 60);
        gridLevelBtn.setInteractive();
        
        gridLevelBtn.on('pointerdown', ()=>{
            this.scene.stop("Game"); 
            this.scene.get('GameTemplate').changeScene('outlinedScene','gameLevels');

        }, this);

        let levelText = this.add.text(gameWidth / 2 - 64 , gameHeight - 70, "Level " + levelNumber , {
            fontFamily: 'Luckiest Guy', fontSize: "40px", color: '#ffffff',
            align: 'center', fill: "#ffffff"
        });


        let nextGameLevel = this.add.image(gameWidth - 100, gameHeight - 50, 'forword').setDisplaySize(60, 60).setInteractive().setAlpha(1);
        nextGameLevel.on('pointerdown', ()=>{
            this.scene.get('Game').nextLevelScene();
            this.scene.stop();

        }, this);

    }


    setGridValFalseAndDestroyOutline() {
        // Restore Game Scene
        this.scene.get('Game').restoreGameScene();
        this.scene.stop("outlinedScene");
    }

    update() {
        
    }
}

export default outlinedScene;