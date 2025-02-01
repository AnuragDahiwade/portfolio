import { Scene, GameObjects, Tweens } from 'phaser';
import outlinedScene from './outlinedScene.js';
import game from '../main.js';
import gameLevels from './gameLevels.js';


let ImageTileArray;
let ShadowTileArray;

let ImageSize;
let gridAdjustValueX;
let gridAdjustValueY;

let completeData;
let levelName;
let levelNumber;
let ImageNames;
let GameVisibility;
let ImageVisibility;
let GameDirections;
let GameConnections;
let maxScore;
let maxTime;
let myScore = 0;

let gridCols;
let gridRows;

let gridBtnValue = true;
let gridBtn;

let gameLight;

let imageName;
let changeLevel = false; 


let myTime = 0;
let startTimer = 0;
let timeText 
let gameTimer
let stopTimer = true;
let stopMinutes = 0;
let stopSeconds = 0;
let seconds = 0;
let gameTimerBG;

let invalidClicks = 0;


export class Game extends Scene {
    constructor() {
        super('Game');
    }

    init(data){
        completeData = data;
        levelName = data.levelName;
        levelNumber = data.levelNumber;
        GameVisibility = data.gameVisibility;
        ImageNames = data.ImageNames;
        GameDirections = data.GameDirections;
        GameConnections = data.GameConnections;
        gridCols = data.gridColsValue;
        gridRows = data.gridRowsValue;
        ImageSize = data.imageSize;
        gridAdjustValueX = data.gridAdjustValueX;
        gridAdjustValueY = data.gridAdjustValueY;
        maxScore = data.maxScore;
        maxTime = data.maxTime;
    }

    create() {

        changeLevel = false;

        // Get the width and height of the game
        let gameWidth = this.cameras.main.width;
        let gameHeight = this.cameras.main.height;

        const allowedDirectionsArray = getAllAllowedDirections(GameVisibility);
        // console.log(GameVisibility);
        GameDirections = allowedDirectionsArray;

        // this.add.image(game.config.width / 2, game.config.height / 2, 'titlePageBG').setScale(1.2);

        ImageTileArray = [];
        ShadowTileArray = [];
        invalidClicks = 0;
        myScore = 0;

        gameTimerBG = this.add.image(gameWidth - 100, 70, "gameTimerBG").setScale(0.6);

        //initialise timer values
        myTime = 0;
        startTimer = 1;
        stopTimer = false;
        
        timeText = this.add.text(gameWidth - 110, 50, "_", {fontFamily: "Suez One",
        fontWeight: 400,fontSize: '35px', fill: '#494949' });     
        gameTimer = this.time.addEvent({ delay: 1000, callback: onEvent, callbackScope: this, loop: true });


        let l = 0;
        for (let i = 0; i < GameVisibility.length; i++) {
            for (let j = 0; j < GameVisibility[i].length; j++) {
                if (GameVisibility[i][j] === 1) {
                    // imageShadow
                    let tileShadow = new createImageTile(
                        this,
                        j * ImageSize + gridAdjustValueX + 7,
                        i * ImageSize + gridAdjustValueY + 8,
                        // ImageNames[l],
                        "imageShadow",
                        GameDirections[i][j],
                        ImageNames[l],
                        GameVisibility[i][j],
                        GameConnections[l],
                        i,
                        j,
                        ImageSize
                    );
                    tileShadow.setAlpha(0.5);
                    this.add.existing(tileShadow);
                    ShadowTileArray.push(tileShadow);

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

                    let blankTileImage = new createImageTile(
                        this,
                        j * ImageSize + gridAdjustValueX,
                        i * ImageSize + gridAdjustValueY,
                        // ImageNames[l],
                        "border_after_destroyed_img",
                        [],
                        [],
                        [],
                        [],
                        i,
                        j,
                        ImageSize
                    );
                   
                    this.add.existing(blankTileImage);
                    
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

        });

        this.input.on('dragstart', (pointer, gameObject) => {
            gameObject.setAlpha(0.8);
            if (gameLight) {
                gameLight.destroy();
                gameLight = null;
            }
            gameLight = this.add.rectangle(-50, -50, ImageSize, ImageSize, 0xffffff, 0.45);
        });
        
        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            // Calculate the delta distance
            let deltaX = dragX - gameObject.originalX;
            let deltaY = dragY - gameObject.originalY;
        
            let direction = getDirection(deltaX, deltaY);
        
            try {
                // Update the light rectangle's size and position based on the drag direction
                if (direction === 'left' || direction === 'right') {
                    gameLight.width = 1000;
                    gameLight.height = ImageSize;
                    gameLight.x = gameObject.originalX + (direction === 'left' ? -1000 : 0);
                    gameLight.y = gameObject.originalY;
                } else if (direction === 'up' || direction === 'down') {
                    gameLight.width = ImageSize;
                    gameLight.height = 1000;
                    gameLight.x = gameObject.originalX;
                    gameLight.y = gameObject.originalY + (direction === 'up' ? -1000: 0);
                }
            } catch (error) {
                console.log(error);
            }
        });
        
        this.input.on('dragend', (pointer, gameObject) => {
            gameObject.setAlpha(1);
        
            let deltaX = pointer.x - gameObject.originalX;
            let deltaY = pointer.y - gameObject.originalY;
        
            if (Math.abs(deltaX) > 50 || Math.abs(deltaY) > 50) {
                let direction = getDirection(deltaX, deltaY);
                if (canMove(gameObject, direction)) {

                    if (gameLight) {
                        gameLight.fillColor = 0x3CFF5D;
                    }
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
                        onStart: () => {
                            this.playDestroySound();

                            ImageTileArray = ImageTileArray.filter(tile => tile !== gameObject);
                            let p = gameObject.i;
                            let q = gameObject.j;

                            let shadowImg = ShadowTileArray.filter(shadowtile => gameObject.i === shadowtile.i && gameObject.j === shadowtile.j);
                            if(shadowImg.length > 0){
                                shadowImg.forEach(element => {
                                    element.destroy();
                                });
                            }

                            // Remove the tile from ImageTileArray and update GameVisibility
                            GameVisibility[p][q] = null;
                        },
                        onComplete: () => {
                            gameObject.destroy();

                            if(ImageTileArray.length <= 0) {
                                this.displayScorePopUp();

                                // stopTimer = true;
                                // changeLevel = true;
                            }
                        }
                    });
                } else {
                    invalidClicks += 1;

                    this.playWrondMoveSound();
                    this.shakeImage(gameObject);

                    if (gameLight) {
                        gameLight.fillColor = 0xFF3C3C;
                    }
                    // If tile can't move, revert to original position
                    gameObject.x = gameObject.originalX;
                    gameObject.y = gameObject.originalY;
                }
            } else {
                // If drag is not far enough, revert to original position
                gameObject.x = gameObject.originalX;
                gameObject.y = gameObject.originalY;
            }

            // Destroy the light rectangle
            
                this.time.delayedCall(300, () => {
                    if (gameLight) {
                        gameLight.destroy();
                        gameLight = null;
                    }
                });
            
        });


        this.createGridBtn();

    }

    pauseTimer() {
        gameTimer.paused = true;
    }
    
    resumeTimer() {
        gameTimer.paused = false;
    }

    playDestroySound() {
        // Play the sound
        let sound = this.sound.add('destroySound');
        sound.play({ volume: 0.43 });

        // Stop the sound after 1 second
        this.time.delayedCall(700, () => {
            sound.stop();
        });
    }
    playWrondMoveSound() {
        // Play the sound
        let sound = this.sound.add('wrongMove');
        sound.play({ volume: 0.43 });

        // Stop the sound after 1 second
        this.time.delayedCall(300, () => {
            sound.stop();
        });
    }

    shakeImage(image) {
        var duration = 50; // Duration of the shake effect in milliseconds
        var intensity = 0.05; // Intensity of the shake effect
        
        this.tweens.add({
            targets: image,
            x: image.x + Math.random() * intensity * 100,
            y: image.y + Math.random() * intensity * 100,
            duration: duration / 2,
            ease: 'Power1',
            yoyo: true,
            repeat: 4 // Repeat the shaking effect 4 times
        });
       
    }

    update() {

      let minutes = Math.floor(myTime / 60);
      let seconds;

      if (myTime > 59) {
          seconds = myTime % 60;
      } else {
          seconds = myTime;
      }

      if (stopTimer === false) {
            // console.log(myTime);
          if (seconds < 10) {
              timeText.setText(minutes + ":" + "0" + seconds);
          } else {
              timeText.setText(minutes+ ":" + seconds);
          }
      } else {
          if (stopSeconds < 10) {
              timeText.setText(stopMinutes + ":" + "0" + stopSeconds);
          } else {
              timeText.setText(stopMinutes+ ":" + stopSeconds);
          }
      }
    
        

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

        if (ImageTileArray.length <= 0 && changeLevel == true) {
            // this.scene.start("GameOver");
            this.scene.get('gameLevels').nextLevel(levelName);
        }


    }

    destroyThisGameScene(){
        this.scene.stop("Game");
    }

    createGridBtn() {
        gridBtn = this.add.image(100, 70, "grid").setDisplaySize(65, 65).setAlpha(1.2);
        gridBtn.setInteractive();
        gridBtn.on('pointerdown', this.displayOutLinedScene, this);
    }

    displayScorePopUp(){
        myScore = calculateScore(maxScore, maxTime, myTime, invalidClicks);
   
        this.pauseTimer();

        // Launch the overlay scene
        this.scene.launch('scorePopUp', {newPopUp: true, gameLevelNumber: levelNumber,gameLevel: levelName,maxScore: maxScore, myScore: myScore});
       
        // Disable interactivity in the main scene
        this.input.enabled = false;
        
    }


    displayOutLinedScene() {
        this.pauseTimer();

        if(this.gridBtn){
            this.gridBtn.destroy();
            this.gridBtn = null;
        }
        // Launch the overlay scene
        this.scene.launch('outlinedScene', {levelNumber: levelNumber});

        // Disable interactivity in the main scene
        this.input.enabled = false;

        // Scale down the main scene
        this.cameras.main.setZoom(0.83);
        
        gridBtn.setAlpha(0);
    }

    restoreGameScene() {
        this.resumeTimer();

        this.createGridBtn();

        // Enable interactivity in the main scene
        this.input.enabled = true;

        // Restore the main scene's scale
        this.cameras.main.setZoom(1.0);
    }

    restoreGameScenedestPopUp() {
        this.resumeTimer();

        // Enable interactivity in the main scene
        this.input.enabled = true;

        // Restore the main scene's scale
        this.cameras.main.setZoom(1.0);
    }

    restartScene() {
        this.scene.get('gameLevels').restartLevel(levelName);
        this.scene.stop("Game");
        
    }

    nextLevelScene(){
        this.scene.get('gameLevels').nextLevel(levelName);
        this.scene.stop("Game");
    }

}

function onEvent() {
    if (startTimer === 1) {
        myTime +=1;
    }
}


function calculateScore(maxScore, maxTime, timeTaken, invalidMoves) {
    // Calculate score reduction for invalid moves
    const invalidMovePenalty = 10 * invalidMoves;

    // Calculate score reduction for exceeding max time
    const timeExceedPenalty = timeTaken > maxTime ? (timeTaken - maxTime) * 5 : 0;

    // Calculate the final score
    let finalScore = maxScore - invalidMovePenalty - timeExceedPenalty;

    // Ensure the score doesn't drop below zero
    finalScore = Math.max(finalScore, 0);

    return finalScore;
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




