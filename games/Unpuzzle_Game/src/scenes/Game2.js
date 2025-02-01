import { Scene, GameObjects, Tweens } from 'phaser';
import outlinedScene from './outlinedScene.js';
import game from '../main.js';
import gameLevels from './gameLevels.js';


let ImageTileArray;

let ImageSize;
let gridAdjustValueX;
let gridAdjustValueY;

let completeData;
let levelName;
let ImageNames;
let GameVisibility;
let ImageVisibility;
let GameDirections;
let GameConnections;

let gridCols;
let gridRows;

let gridBtnValue = true;
let gridBtn;

let imageName;

export class Game extends Scene {
    constructor() {
        super('Game');
    }

    init(data){
        completeData = data;
        levelName = data.levelName;
        GameVisibility = data.gameVisibility;
        ImageNames = data.ImageNames;
        GameDirections = data.GameDirections;
        GameConnections = data.GameConnections;
        gridCols = data.gridColsValue;
        gridRows = data.gridRowsValue;
        ImageSize = data.imageSize;
        gridAdjustValueX = data.gridAdjustValueX;
        gridAdjustValueY = data.gridAdjustValueY;

    }

    create() {

        // Get the width and height of the game
        let gameWidth = this.cameras.main.width;
        let gameHeight = this.cameras.main.height;

        const allowedDirectionsArray = getAllAllowedDirections(GameVisibility);
        // console.log(GameVisibility);
        GameDirections = allowedDirectionsArray;

        // this.add.image(game.config.width / 2, game.config.height / 2, 'titlePageBG').setScale(1.2);

        ImageTileArray = [];
        let l = 0;
        for (let i = 0; i < GameVisibility.length; i++) {
            for (let j = 0; j < GameVisibility[i].length; j++) {
                if (GameVisibility[i][j] === 1) {
                    let tile = new createImageTile(
                        this,
                        j * ImageSize + gridAdjustValueX,
                        i * ImageSize + gridAdjustValueY,
                        // ImageNames[l],
                        "all_empty",
                        GameDirections[i][j],
                        ImageNames[l],
                        GameVisibility[i][j],
                        GameConnections[l],
                        i,
                        j,
                        ImageSize
                    );
                    l += 1;
                    ImageTileArray.push(tile);
                }
            }
        }

        
        // Assuming ImageTileArray and GameVisibility are already defined
        ImageTileArray.forEach(tile => {
            this.add.existing(tile);
            this.input.setDraggable(tile);

            // Store original position for each tile
            tile.originalX = tile.x;
            tile.originalY = tile.y;
            // tile.i = /* set the appropriate i index */;
            // tile.j = /* set the appropriate j index */;
        });

        this.input.on('dragstart', (pointer, gameObject) => {
            gameObject.setAlpha(0.8);
        
            console.log(" ", ImageSize);
            // Create a light rectangle and store it in the gameObject
            gameObject.light = this.add.rectangle(-50, -50, ImageSize, ImageSize, 0xffffff, 0.45);
        });
        
        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            // Calculate the delta distance
            let deltaX = dragX - gameObject.originalX;
            let deltaY = dragY - gameObject.originalY;
        
            let direction = getDirection(deltaX, deltaY);
        
            // Update the light rectangle's size and position based on the drag direction
            if (direction === 'left' || direction === 'right') {
                gameObject.light.width = 1000;
                gameObject.light.height = ImageSize;
                gameObject.light.x = gameObject.originalX + (direction === 'left' ? -1000 : 0);
                gameObject.light.y = gameObject.originalY;
            } else if (direction === 'up' || direction === 'down') {
                gameObject.light.width = ImageSize;
                gameObject.light.height = 1000;
                gameObject.light.x = gameObject.originalX;
                gameObject.light.y = gameObject.originalY + (direction === 'up' ? -1000: 0);
            }
        });
        
        this.input.on('dragend', (pointer, gameObject) => {
            gameObject.setAlpha(1);
        
            // Destroy the light rectangle
            if (gameObject.light) {
                gameObject.light.destroy();
                gameObject.light = null;
            }
        
            let deltaX = pointer.x - gameObject.originalX;
            let deltaY = pointer.y - gameObject.originalY;
        
            if (Math.abs(deltaX) > 50 || Math.abs(deltaY) > 50) {
                let direction = getDirection(deltaX, deltaY);
                if (canMove(gameObject, direction)) {
                    let offscreenX = gameObject.originalX;
                    let offscreenY = gameObject.originalY;
        
                    if (direction === 'left') {
                        offscreenX -= this.cameras.main.width;
                    } else if (direction === 'right') {
                        offscreenX += this.cameras.main.width;
                    } else if (direction === 'up') {
                        offscreenY -= this.cameras.main.height;
                    } else if (direction === 'down') {
                        offscreenY += this.cameras.main.height;
                    }
        
                    this.tweens.add({
                        targets: gameObject,
                        x: offscreenX,
                        y: offscreenY,
                        rotation: Math.PI * 3,
                        duration: 700,
                        onComplete: () => {
                            // Remove the tile from ImageTileArray and update GameVisibility
                            ImageTileArray = ImageTileArray.filter(tile => tile !== gameObject);
                            let p = gameObject.i;
                            let q = gameObject.j;
                            GameVisibility[p][q] = null;
        
                            // Destroy the tile
                            gameObject.destroy();
                        }
                    });
                } else {
                    // If tile can't move, revert to original position
                    gameObject.x = gameObject.originalX;
                    gameObject.y = gameObject.originalY;
                }
            } else {
                // If drag is not far enough, revert to original position
                gameObject.x = gameObject.originalX;
                gameObject.y = gameObject.originalY;
            }
        });


        this.createGridBtn();

    }

    update() {
        const allowedDirectionsArray = getAllAllowedDirections(GameVisibility);
        GameDirections = allowedDirectionsArray;

        ImageVisibility = processConnections(GameVisibility);
        // console.log(ImageVisibility);

        let l = 0;
        for (let i = 0; i < GameVisibility.length; i++) {
            for (let j = 0; j < GameVisibility[i].length; j++) {
                if (GameVisibility[i][j] === 1) {
                    ImageTileArray[l].direction = GameDirections[i][j];
                    // const connections = getConnections(GameVisibility, i, j);
                    const connections = ImageVisibility[i][j];

                    const imageName = getImageName(connections);
                    ImageTileArray[l].setTexture(imageName);

                    l += 1;
                }
            }
        }

        if (ImageTileArray.length <= 0) {
            // this.scene.start("GameOver");
            this.scene.get('gameLevels').nextLevel(levelName);
        }
        // this.scene.get('GameTemplate').changeScene('Game', 'GameOver');

    }


    createGridBtn() {
        gridBtn = this.add.image(100, 50, "grid").setDisplaySize(70, 70).setAlpha(1.2);
        gridBtn.setInteractive();
        gridBtn.on('pointerdown', this.displayOutLinedScene, this);
    }

    displayOutLinedScene() {
        if(this.gridBtn){
            this.gridBtn.destroy();
            this.gridBtn = null;
        }
        // Launch the overlay scene
        this.scene.launch('outlinedScene');

        // Disable interactivity in the main scene
        this.input.enabled = false;

        // Scale down the main scene
        this.cameras.main.setZoom(0.83);
        
        gridBtn.setAlpha(0);
    }

    restoreGameScene() {
        this.createGridBtn();

        // Enable interactivity in the main scene
        this.input.enabled = true;

        // Restore the main scene's scale
        this.cameras.main.setZoom(1.0);
    }

}


// *****************************************************************************************************************************
// *****************************************************************************************************************************

function getImageName(connections) {
    const directionsToImage = {
        'up': 'one_up',
        'down': 'one_down',
        'left': 'one_left',
        'right': 'one_right',
        'up_down': 'two_up_down',
        'left_right': 'two_left_right',
        'up_right': 'two_up_right',
        'up_left': 'two_left_up',
        'down_right': 'two_right_down',
        'down_left': 'two_left_down',
        'up_down_right': 'three_left_rem',
        'up_down_left': 'three_right_rem',
        'up_left_right': 'three_down_rem',
        'down_left_right': 'three_up_rem',
        'up_down_left_right': 'all_four'
       
    };

    const imageName = directionsToImage[connections.join('_')];
    return imageName ? imageName : 'all_empty'; // Set default image if no mapping found
}

function getConnections(matrix, row, col) {
    const directions = ['up', 'down', 'left', 'right'];
    const connectedDirections = [];
    for (const dir of directions) {
        const newRow = row + (dir === 'up' ? -1 : dir === 'down' ? 1 : 0);
        const newCol = col + (dir === 'left' ? -1 : dir === 'right' ? 1 : 0);
        if (isValidPosition(matrix, newRow, newCol) && matrix[newRow][newCol] === 1) {
            connectedDirections.push(dir);
        }
    }
    return connectedDirections;
}

function isValidPosition(matrix, row, col) {
    return row >= 0 && row < matrix.length && col >= 0 && col < matrix[0].length;
}



function processConnections(grid) {
    // Create a result array initialized to null
    const result = grid.map(row => row.map(cell => null));
    
    const directions = [
        { name: 'up', dx: -1, dy: 0 },
        { name: 'down', dx: 1, dy: 0 },
        { name: 'left', dx: 0, dy: -1 },
        { name: 'right', dx: 0, dy: 1 }
    ];
    
    function isValid(x, y) {
        return x >= 0 && x < grid.length && y >= 0 && y < grid[0].length;
    }

    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            if (grid[i][j] === 1 && result[i][j] === null) {
                let connections = [];
                
                directions.forEach(direction => {
                    const newX = i + direction.dx;
                    const newY = j + direction.dy;
                    if (isValid(newX, newY) && grid[newX][newY] === 1 && result[newX][newY] === null) {
                        connections.push(direction.name);
                    }
                });
                
                // If there are connections, mark the first 1
                if (connections.length > 0) {
                    result[i][j] = connections;
                    // Mark subsequent connected 1s as 'processed'
                    connections.forEach(direction => {
                        const newX = i + direction.dx;
                        const newY = j + direction.dy;
                        if (isValid(newX, newY)) {
                            result[newX][newY] = 'processed';
                        }
                    });
                } else {
                    result[i][j] = [];
                }
            }
        }
    }

    // Convert 'processed' markers back to null for clarity
    for (let i = 0; i < result.length; i++) {
        for (let j = 0; j < result[i].length; j++) {
            if (result[i][j] === 'processed') {
                result[i][j] = null;
            }
        }
    }
    
    return result;
}
// *****************************************************************************************************************************
// *****************************************************************************************************************************
// *****************************************************************************************************************************

function canDrag(imageArray, pos_i, pos_j) {
    const rows = imageArray.length;
    const cols = imageArray[0].length;

    // Helper function to check if a position is within bounds
    function isWithinBounds(i, j) {
        return i >= 0 && i < rows && j >= 0 && j < cols;
    }

    // Check if there's a 1 in any position in the given row to the left of pos_j
    function hasImageToLeft(i, j) {
        for (let col = j - 1; col >= 0; col--) {
            if (imageArray[i][col] === 1) {
                return true;
            }
        }
        return false;
    }

    // Check if there's a 1 in any position in the given row to the right of pos_j
    function hasImageToRight(i, j) {
        for (let col = j + 1; col < cols; col++) {
            if (imageArray[i][col] === 1) {
                return true;
            }
        }
        return false;
    }

    // Check if there's a 1 in any position in the given column above pos_i
    function hasImageUp(i, j) {
        for (let row = i - 1; row >= 0; row--) {
            if (imageArray[row][j] === 1) {
                return true;
            }
        }
        return false;
    }

    // Check if there's a 1 in any position in the given column below pos_i
    function hasImageDown(i, j) {
        for (let row = i + 1; row < rows; row++) {
            if (imageArray[row][j] === 1) {
                return true;
            }
        }
        return false;
    }

    // Check if there's an adjacent 1 in the immediate surrounding positions
    const hasAdjacentImage = {
        left: isWithinBounds(pos_i, pos_j - 1) && imageArray[pos_i][pos_j - 1] === 1,
        right: isWithinBounds(pos_i, pos_j + 1) && imageArray[pos_i][pos_j + 1] === 1,
        up: isWithinBounds(pos_i - 1, pos_j) && imageArray[pos_i - 1][pos_j] === 1,
        down: isWithinBounds(pos_i + 1, pos_j) && imageArray[pos_i + 1][pos_j] === 1
    };

    // Determine allowed drag directions
    const allowedDirections = {
        up: hasImageUp(pos_i, pos_j),
        down: hasImageDown(pos_i, pos_j),
        left: hasImageToLeft(pos_i, pos_j),
        right: hasImageToRight(pos_i, pos_j)
    };

    // Update allowed directions based on the adjacent image condition
    if (hasAdjacentImage.left) {
        allowedDirections.left = true;
        allowedDirections.up = true;
        allowedDirections.down = true;
    }
    if (hasAdjacentImage.right) {
        allowedDirections.right = true;
        allowedDirections.up = true;
        allowedDirections.down = true;
    }
    if (hasAdjacentImage.up) {
        allowedDirections.up = true;
        allowedDirections.left = true;
        allowedDirections.right = true;
    }
    if (hasAdjacentImage.down) {
        allowedDirections.down = true;
        allowedDirections.left = true;
        allowedDirections.right = true;
    }

    return allowedDirections;
}

function getAllAllowedDirections(imageArray) {
    const rows = imageArray.length;
    const cols = imageArray[0].length;
    const directionsArray = [];

    for (let i = 0; i < rows; i++) {
        const rowDirections = [];
        for (let j = 0; j < cols; j++) {
            if (imageArray[i][j] === 1) {
                let getDirValues = canDrag(imageArray, i, j);
                const falseKeysArray = Object.keys(getDirValues).filter(key => !getDirValues[key]);
                rowDirections.push(falseKeysArray);

            } else {
                rowDirections.push(null);
            }
        }
        directionsArray.push(rowDirections);
    }

    return directionsArray;
}
// *****************************************************************************************************************************
// *****************************************************************************************************************************
// *****************************************************************************************************************************

function findConnectedOnes(matrix) {
    const directions = [
        { row: -1, col: 0, dir: 'up' },
        { row: 1, col: 0, dir: 'down' },
        { row: 0, col: -1, dir: 'left' },
        { row: 0, col: 1, dir: 'right' }
    ];

    const rows = matrix.length;
    const cols = matrix[0].length;
    const result = [];

    function isValid(r, c) {
        return r >= 0 && r < rows && c >= 0 && c < cols;
    }

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (matrix[r][c] === 1) {
                const connections = [];
                for (const { row, col, dir } of directions) {
                    const newRow = r + row;
                    const newCol = c + col;
                    if (isValid(newRow, newCol) && matrix[newRow][newCol] === 1) {
                        connections.push(dir);
                    }
                }
                result.push({ position: [r, c], connections });
            }
        }
    }

    return result;
}



// *****************************************************************************************************************************
// *****************************************************************************************************************************




class createImageTile extends GameObjects.Image {
    constructor(scene, x, y, texture, direction, name, visible, neighbours, i, j, ImageSize) {
        super(scene, x, y, texture);

        this.name = name;
        this.direction = direction;
        this.setInteractive();
        this.setDisplaySize(ImageSize, ImageSize);
        this.width = ImageSize;
        this.height = ImageSize;
        this.scene = scene;
        this.setAlpha(1);
        this.originalX = x;
        this.originalY = y;

        this.i = i;
        this.j = j;

        this.visible = visible;
        this.neighbours = neighbours;
    }
}

function getDirection(deltaX, deltaY) {
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        return deltaX > 0 ? 'right' : 'left';
    } else {
        return deltaY > 0 ? 'down' : 'up';
    }
}

function canMove(tile, direction) {
    if (!tile.direction.includes(direction)) {
        return false;
    }

    let newX = tile.originalX + (direction === 'left' ? -ImageSize : direction === 'right' ? ImageSize : 0);
    let newY = tile.originalY + (direction === 'up' ? -ImageSize : direction === 'down' ? ImageSize : 0);

    for (let i = 0; i < ImageTileArray.length; i++) {
        if (ImageTileArray[i] !== tile && ImageTileArray[i].x === newX && ImageTileArray[i].y === newY) {
            return false;
        }
    }

    // Check for up, down, left, and right neighbors only
    let neighborCount = 0;
    ImageTileArray.forEach(otherTile => {
        if (otherTile !== tile) {
            if ((otherTile.x === tile.originalX && Math.abs(otherTile.y - tile.originalY) === ImageSize) ||
                (otherTile.y === tile.originalY && Math.abs(otherTile.x - tile.originalX) === ImageSize)) {
                neighborCount++;
            }
        }
    });

    if (neighborCount > 1) {
        return false;
    }

    return true;
}


export default Game;




