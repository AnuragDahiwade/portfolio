
import { Scene } from 'phaser';
import game from '../main.js';


export class TitlePage extends Scene
{
    constructor ()
    {
        super('TitlePage');
    }

    create ()
    {

    
        this.gameTitle = this.add.image(this.game.config.width / 2, this.game.config.height / 2 - 100, 'titlePageGameName').setScale(0.34);

        let startGamebtn = this.add.image(this.game.config.width / 2, this.game.config.height / 2 + 150, 'titlePageStartGame').setScale(0.5);
        startGamebtn.setInteractive().setAlpha(1);
        
        startGamebtn.on('pointerdown', () => {
            this.scene.get('GameTemplate').changeScene('TitlePage', 'gameLevels');
           
        }, this);

    }
}


export default TitlePage;