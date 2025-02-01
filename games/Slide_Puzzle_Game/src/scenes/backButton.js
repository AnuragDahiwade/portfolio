export default class BackButton {
    constructor(scene, x, y, texture, targetURL) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.texture = texture;
        this.targetURL = targetURL;
        
        this.createButton();
    }

    createButton() {
        const button = this.scene.add.sprite(this.x, this.y, this.texture).setInteractive();
        button.on('pointerdown', () => {
            window.location.href = 'index.html';
        });
    }
}
