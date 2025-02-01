import { Scene } from 'phaser';
import game from '../main.js';

import TitlePage from './TitlePage.js';

export class Preloader extends Scene {
    constructor() {
        super('Preloader');
    }

    init() {
        this.cameras.main.setBackgroundColor(0xA020F0);

        this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2 - 100, "unpuzzle_game_logo").setScale(0.5);

        let gameWidth = this.cameras.main.width;
        let gameHeight = this.cameras.main.height;
        let offsetY = gameHeight * 0.1; // Adjust this value to move elements lower

        var progressBar = this.add.graphics();
        var progressBox = this.add.graphics();
        progressBox.fillStyle(0xffffff, 0.3);
        // progressBox.fillRect(gameWidth / 2 - 150, gameHeight / 2 + offsetY, 300, 40);

        progressBox.fillRoundedRect(gameWidth / 2 - 150, gameHeight / 2 + offsetY, 300, 40);

        var loadingText = this.make.text({
            x: gameWidth / 2,
            y: gameHeight / 2 - 25 + offsetY,
            text: 'Loading...',
            style: {
                font: '25px "Suez One"',
                fill: '#111112'
            }
        });
        loadingText.setOrigin(0.5, 0.5);

        var percentText = this.make.text({
            x: gameWidth / 2,
            y: gameHeight / 2 + 20 + offsetY,
            text: '0%',
            style: {
                font: '20px "Suez One"',
                fill: '#111112'
            }
        });
        percentText.setOrigin(0.5, 0.5);

        let progressVal = 40; 
        this.load.on('progress', function (value) {
            percentText.setText(parseInt(value * 100) + '%');
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);

            progressBar.fillRoundedRect(gameWidth / 2 - 150, gameHeight / 2 + offsetY, 300 * value + progressVal - value * progressVal, 40);
            
        });

        this.load.on('complete', function () {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
        });
    }

    preload() {
        this.load.setPath('assets');

        // Game sounds
        this.load.audio('destroySound', 'destoyImg.wav');
        this.load.audio('wrongMove', 'Unpuzzle_wrongMove.wav');
        this.load.audio('next_scene', 'game_scene_reevil.wav');
        this.load.audio('selectLevel', 'select.mp3');

        // Template Page Assets
        this.load.image("cross", 'Unpuzzle_Template_cross.png');
        this.load.image("imageShadow", 'unpuzzle_shadow_for_image.png');
        this.load.image("exitButton", "UnPuzzle_exitButton.png");

        // All GameImages
        this.load.image('all_empty', 'all_empty.png');
        this.load.image('all_four', 'all_four.png');
        this.load.image('one_down', 'one_down.png');
        this.load.image('one_left', 'one_left.png');
        this.load.image('one_right', 'one_right.png');
        this.load.image('one_up', 'one_up.png');
        this.load.image('three_down_rem', 'three_down_rem.png');
        this.load.image('three_left_rem', 'three_left_rem.png');
        this.load.image('three_right_rem', 'three_right_rem.png');
        this.load.image('three_up_rem', 'three_up_rem.png');
        this.load.image('two_left_down', 'two_left_down.png');
        this.load.image('two_left_right', 'two_left_right.png');
        this.load.image('two_left_up', 'two_left_up.png');
        this.load.image('two_right_down', 'two_right_down.png');
        this.load.image('two_up_down', 'two_up_down.png');
        this.load.image('two_up_right', 'two_up_right.png');
        this.load.image("border_after_destroyed_img", 'unpuzzle_border_after_destroyed_img.png');

        // TitlePage Assets
        this.load.image('titlePageBG', 'Unpuzzle_TitlePage_Background.png');
        this.load.image('titlePageGameName', 'Unpuzzle_TitlePage_Background.png');
        this.load.image('titlePageStartGame', 'Unpuzzle_TitlePage_StartGameBtn.png');

        // Level Assets
        this.load.image('gameLevel_greentile', 'Unpuzzle_GameLevels_greentile.png');
        this.load.image('gameLevel_lock', 'Unpuzzle_GameLevels_lock.png');

        // Outlined Scene Assets
        this.load.image("back", 'Unpuzzle_Back.png');
        this.load.image("back2", 'Unpuzzle_Back2.png');
        this.load.image("forword", 'Unpuzzle_Forword.png');
        this.load.image("backword", 'Unpuzzle_Backword.png');
        this.load.image("grid", 'Unpuzzle_Grid2.png');
        this.load.image("gridLevels", 'Unpuzzle_Grid3.png');
        this.load.image("expand", 'Unpuzzle_Expand.png');
        this.load.image("lightBtn", 'Unpuzzle_lightBtn.png');
        this.load.image("darkBtn", 'Unpuzzle_DarkBtn.png');
        this.load.image("sound", 'Unpuzzle_Sound.png');
        this.load.image("nosound", 'Unpuzzle_NoSound.png');

        // Main Game Assets
        this.load.image("gameTimerBG", 'Unpuzzle_GameTimer.png');

        // gameScore pop-up Page Assets
        this.load.image("ScorePopUp_bgImg", 'Unpuzzle_ScorePopUp_bgImg.png');
        this.load.image("ScorePopUp_bgImgShadow", 'Unpuzzle_ScorePopUp_bgImgShadow.png');
        this.load.image("ScorePopUp_gameName", 'Unpuzzle_ScorePopUp_GameName.png');
        this.load.image("ScorePopUp_level", 'Unpuzzle_ScorePopUp_level.png');
        this.load.image("ScorePopUp_nextBtn", 'Unpuzzle_ScorePopUp_nextButton.png');
        this.load.image("ScorePopUp_restartBtn", 'Unpuzzle_ScorePopUp_restartButton.png');
        this.load.image("ScorePopUp_scoreLebal", 'Unpuzzle_ScorePopUp_ScoreLebal.png');

        // Game over Page Assets
        this.load.image('gameOver_nextlevel', 'Unpuzzle_GameOver_nextlevels.png');
        this.load.image('gameOver_YouWin', 'Unpuzzle_GameOver_YouWin.png');

    }

    create() {
        this.scene.start('GameTemplate');
    }
}

export default Preloader;
