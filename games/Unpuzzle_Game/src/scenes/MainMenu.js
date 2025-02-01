import { Scene } from 'phaser';
import game from '../main.js';


export class MainMenu extends Scene
{
    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        // this.add.image(game.config.width / 2, game.config.height / 2, 'background');
        this.add.image(game.config.width / 2, game.config.height / 2, 'logo');

        this.add.text(game.config.width / 2, game.config.height / 1.5, 'Main Menu', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        this.input.once('pointerdown', () => {

            this.scene.start('Game');

        });


    }
}


export default MainMenu;