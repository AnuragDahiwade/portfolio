
import { Scene } from 'phaser';
import game from '../main.js';


// let image;
// let graphics;
// let lines = [];
// const maxDistance = 300; // Maximum length of the lines

export class _animationExperiment extends Scene
{
    constructor ()
    {
        super('_animationExperiment');
    }

    create() {
        this.image = this.add.image(game.config.width / 2, game.config.height / 2, 'tile2');
        this.image.setInteractive().setDisplaySize(100, 100);
        this.image.width = 100;
        this.image.height = 100;

        // this.image.on('pointerdown', this.emitLight, this);

        this.input.setDraggable(this.image);

        this.image.on('dragstart', this.onDragStart, this);
        this.image.on('dragend', this.onDragEnd, this);

        this.dragStartX = 0;
        this.dragStartY = 0;

        
        // this.graphics = this.add.graphics();
        // this.lines = [];
        // this.maxDistance = 300; // Maximum length of the lines
        
    }

    onDragStart(pointer, gameObject) {
        this.dragStartX = pointer.x;
        this.dragStartY = pointer.y;
    }

    onDragEnd(pointer, gameObject) {
        const dragEndX = pointer.x;
        const dragEndY = pointer.y;
        const deltaX = dragEndX - this.dragStartX;
        const deltaY = dragEndY - this.dragStartY;

        let direction = null;

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // Horizontal drag
            if (deltaX > 0) {
                direction = { x: 1, y: 0, width: 0, height: this.image.height }; // Right
            } else {
                direction = { x: -1, y: 0, width: 0, height: this.image.height }; // Left
            }
        } else {
            // Vertical drag
            if (deltaY > 0) {
                direction = { x: 0, y: 1, width: this.image.width, height: 0 }; // Down
            } else {
                direction = { x: 0, y: -1, width: this.image.width, height: 0 }; // Up
            }
        }

        if (direction) {
            this.emitLight(direction);
        }
    }

    emitLight(direction) {
        const { x, y, width, height } = this.image;
        const maxDistance = 1000;

        const light = this.add.rectangle(x, y, direction.width || width, direction.height || height, 0xffffff, 1);

        const tweenProps = {
            targets: light,
            alpha: { from: 1, to: 0 },
            duration: 1000,
            onComplete: () => light.destroy()
        };

        if (direction.x === 0) {
            tweenProps.height = maxDistance;
            tweenProps.y = y + (direction.y * maxDistance) / 2;
        } else {
            tweenProps.width = maxDistance;
            tweenProps.x = x + (direction.x * maxDistance) / 2;
        }

        this.tweens.add(tweenProps);
    }
    // emitLight(pointer) {
    //     const { x, y } = pointer;

    //     const directions = [
    //         { x: 0, y: -300 }, // Up
    //         { x: 0, y: 300 },  // Down
    //         { x: -300, y: 0 }, // Left
    //         { x: 300, y: 0 }   // Right
    //     ];
        
    //     directions.forEach(dir => {
    //         let rect;
    //         if (dir.x === 0) {
    //             rect = this.add.rectangle(this.image.x, this.image.y, 100, 0, 0xffffff, 1);
    //         } else {
    //             rect = this.add.rectangle(this.image.x, this.image.y, 0, 100, 0xffffff, 1);
    //         }

    //         this.tweens.add({
    //             targets: rect,
    //             y: { from: this.image.y, to: y + dir.y },
    //             x: { from: this.image.x, to: x + dir.x },
    //             height: dir.x === 0 ? 300 : 100,
    //             width: dir.y === 0 ? 300 : 100,
    //             alpha: { from: 1, to: 0 },
    //             duration: 1000,
    //             onComplete: () => rect.destroy()
    //         });
    //     });
    // }
}



export default _animationExperiment;