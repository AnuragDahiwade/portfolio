import Game from './Game.js';
import gameLevels from './gameLevels.js';
import game from '../main.js';

let gameWidth;
let gameHeight;
let popupContainer;
let newPopUp = false;

let bgImage;
let bgImageShadow;
let gameName;
let levelName;
let nextBtn;
let restartBtn;
let scoreLabel;
let scoreText;
let levelNumberText;

let maxScore;
let myScore;
let levelNumber;

class scorePopUp extends Phaser.Scene {
    constructor() {
        super({ key: 'scorePopUp' });
    }

    init(data) {
        levelNumber = data.gameLevelNumber;
        maxScore = data.maxScore;
        myScore = data.myScore;
        newPopUp = data.newPopUp;
    }

    create() {
        gameWidth = this.cameras.main.width;
        gameHeight = this.cameras.main.height;

        popupContainer = this.add.container(gameWidth / 2, gameHeight / 2);
        popupContainer.setScale(0.2);
        popupContainer.setAlpha(0);

        // bgImageShadow = this.add.image(10, 10, 'ScorePopUp_bgImgShadow').setScale(1).setAlpha(0.5);
        bgImage = this.add.image(0, 0, 'ScorePopUp_bgImg').setScale(1.3);
        // levelName = this.add.image(-20, -210, 'ScorePopUp_level').setScale(0.43);
        // gameName = this.add.image(0, -120, 'ScorePopUp_gameName').setScale(0.6);
        // scoreLabel = this.add.image(0, 20, 'ScorePopUp_scoreLebal').setScale(0.7);
        restartBtn = this.add.image(-100, 180, 'ScorePopUp_restartBtn').setScale(1.3).setInteractive().setAlpha(1);
        nextBtn = this.add.image(90, 180, 'ScorePopUp_nextBtn').setScale(1.3).setInteractive().setAlpha(1);

        
        levelNumberText = this.add.text(45, -243, levelNumber, { fontFamily: "Luckiest Guy", fontWeight: 400, fontSize: '45px', fill: '#FFFFFF' });

        if(maxScore < 100){
            scoreText = this.add.text(-90, 18, `${myScore}/${maxScore}`, { fontFamily: "Luckiest Guy", fontWeight: 400, fontSize: '70px', fill: '#FDC102' });
        }else{
            scoreText = this.add.text(-130, 18, `${myScore}/${maxScore}`, { fontFamily: "Luckiest Guy", fontWeight: 400, fontSize: '70px', fill: '#FDC102' });
        }

        popupContainer.add([ bgImage, restartBtn, nextBtn, levelNumberText, scoreText]);

        if (newPopUp) {
            this.tweens.add({
                targets: popupContainer,
                scaleX: 1,
                scaleY: 1,
                alpha: 1,
                ease: 'Back.easeOut',
                duration: 1000,
                onComplete: () => {
                    newPopUp = false;
                }
            });
        }

        restartBtn.on('pointerup', this.restartGame, this);
        nextBtn.on('pointerup', this.nextLevel, this);
    }

    restartGame() {
        this.scene.get('Game').restartScene();
        this.scene.stop('scorePopUp');
    }

    nextLevel() {
        this.scene.get('Game').nextLevelScene();
        this.scene.stop('scorePopUp');
    }

    goToLevelsPage() {
        this.scene.get('Game').destroyThisGameScene();
        this.scene.get('GameTemplate').changeScene('scorePopUp', 'gameLevels');
        this.scene.stop('scorePopUp');
    }
}

export default scorePopUp;
