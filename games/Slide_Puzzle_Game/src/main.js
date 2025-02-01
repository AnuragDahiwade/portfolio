

  var tiles = [];

  const gameOptions = {
    TileSize: 288,   //288
    tileSpacing: 15,  //20
    boardSize: { rows: 5, cols: 5 },
    tweenSpeed: 50,
    aspectRatio: 16 / 9
  };


  var tileSize = 100;

  let clicks = 0;
  let gameScore = 2345;
  let startGame = false
  let nextLavel = false
  let level = undefined
  let gameOver = false
  let reset = false
  let numbers = []
  let shuffledNumbers = []
  let gridWidth = 0;
  let scaleValue = 0; 
  let gridAdjustValX = 0;
  let gridAdjustValY = 0;

  let gridAdjustValue = 0;
  let gameLevel = 0;
  let padding = 100;

  let backtoboot = false;
  let backtomenu = false;

  let myTime = 0;
  let startTimer = 0;
  let timeText 
  let gameTimer
  let stopTimer = true;
  let stopMinutes;
  let stopSeconds;
  let seconds = 0;


  class bootGame extends Phaser.Scene{
    constructor(){
      super("BootGame");
    }

    preload(){

      var progressBar = this.add.graphics();
            var progressBox = this.add.graphics();
            progressBox.fillStyle(0x222222, 0.8);
            progressBox.fillRect(game.config.width / 2, game.config.height / 2 , 0, 40);
            
            let width = gameOptions.boardSize.cols * padding;
            let height = width * gameOptions.aspectRatio;
            var loadingText = this.make.text({
                x: width / 2 ,
                y: height / 2 - 25 ,
                text: 'Loading...',
                style: {
                    font: '20px monospace',
                    fill: '#ffffff'
                }
            });
            loadingText.setOrigin(0.5, 0.5);
            
            var percentText = this.make.text({
                x: width / 2,
                y: height / 2 + 20,
                text: '0%',
                style: {
                    font: '18px monospace',
                    fill: '#ffffff'
                }
            });
            percentText.setOrigin(0.5, 0.5);
            
            var assetText = this.make.text({
                x: width / 2,
                y: height / 2 + 70,
                text: '',
                style: {
                    font: '18px monospace',
                    fill: '#ffffff'
                }
            });
            assetText.setOrigin(0.5, 0.5);
            
            this.load.on('progress', function (value) {
                percentText.setText(parseInt(value * 100) + '%');
                progressBar.clear();
                progressBar.fillStyle(0xff3a3a, 1);
                progressBar.fillRect(game.config.width / 2 - 150, game.config.height / 2, 300 * value, 40);
            });
            
            this.load.on('fileprogress', function (file) {
                assetText.setText('Loading asset: ' + file.key);
            });
            this.load.on('complete', function () {
                progressBar.destroy();
                progressBox.destroy();
                loadingText.destroy();
                percentText.destroy();
                assetText.destroy();
            });

        for(let i=1; i<=25; i++){
          this.load.image(`${i}`, `src/assets/images/SlidePuzzleGameTileNum${i}.png`)
        }

        for(let i=1; i<=24; i++){
          this.load.image(`green_${i}`, `src/assets/images/SlidePuzzleGameGreenTileNum${i}.png`)
        }


        this.load.image(`999`, `src/assets/images/SlidePuzzleGameBlankTile.png`)

        this.load.image("bg", "src/assets/images/SlidePuzzleGamebackground.png");

        this.load.image("title", "src/assets/images/SlidePuzzleGametitle.png");
        this.load.image("play", "src/assets/images/SlidePuzzleGamePlay_Button.png");
        this.load.image("reset", "src/assets/images/SlidePuzzleGameReset.png");
        this.load.image("back", "src/assets/images/SlidePuzzleGameBack_Button.png");
        this.load.image("cross", "src/assets/images/SlidePuzzleGameCross.png");
        this.load.image("menu", "src/assets/images/SlidePuzzleGameMenu.png");
        this.load.image("level_bg", "src/assets/images/SlidePuzzleGameLevel_bg.png");
        this.load.image("number_holder", "src/assets/images/SlidePuzzleGameNumber_Holder.png");
        this.load.image("timer", "src/assets/images/SlidePuzzleGameTimer.png");
        this.load.image("easy", "src/assets/images/SlidePuzzleGameEasy.png");
        this.load.image("medium", "src/assets/images/SlidePuzzleGameMedium.png");
        this.load.image("hard", "src/assets/images/SlidePuzzleGameHard.png");
        this.load.image("winner", "src/assets/images/SlidePuzzleGamewinner.png");
        this.load.image("score_bg", "src/assets/images/SlidePuzzleGamescore_Background.png");
        this.load.image("score_bgf", "src/assets/images/SlidePuzzleGamescore_bg_frame.png");
        this.load.image("restart", "src/assets/images/SlidePuzzleGamerestart.png");

    }

    create(){

      this.scene.start("TitleGame");
    }
  }

  class titleGame extends Phaser.Scene{
      constructor(){
          super("TitleGame");
      }

      create(){
          backtoboot = false;

          // Add the back button sprite
          
          let background = this.add.image(game.config.width / 2, game.config.height / 2, "bg");
          background.setDisplaySize(game.config.width, game.config.height);

          let title = this.add.sprite(game.config.width / 2, game.config.height / 3, "title").setInteractive().setScale(0.4);
          let play = this.add.sprite(game.config.width / 2, game.config.height / 1.5, "play").setInteractive().setScale(0.6);

          play.on('pointerup', function () {
              play.clearTint();
              startGame = true;
          });


      }

      update(){
          if(startGame === true){
            startGame = false;
              this.scene.start("MenuGame");
          }
      }
  }

  class menuGame extends Phaser.Scene{
      constructor(){
          super("MenuGame");
      }

      create(){
          backtomenu = false;

          let background = this.add.image(game.config.width / 2, game.config.height / 2, "bg");
          background.setDisplaySize(game.config.width, game.config.height);

          let level = this.add.sprite(game.config.width / 2, game.config.height / 2, "level_bg").setInteractive().setScale(0.4);

          let easy = this.add.sprite(250, 360, "easy").setInteractive().setScale(0.5);
          let medium = this.add.sprite(250, 460, "medium").setInteractive().setScale(0.5);
          let hard = this.add.sprite(250, 560, "hard").setInteractive().setScale(0.5);

          let cross = this.add.sprite(420, 280, "cross").setInteractive().setScale(0.5);
          let back = this.add.sprite(game.config.width / 10, game.config.height / 9, "back").setInteractive().setScale(0.5);

          easy.on('pointerup', function () {
              easy.clearTint();
              nextLavel = true;
              gameLevel = 1;
          });

          medium.on('pointerup', function () {
            medium.clearTint();
            nextLavel = true;
            gameLevel = 2;
          });

          hard.on('pointerup', function () {
            hard.clearTint();
            nextLavel = true;
            gameLevel = 3;
          });

          cross.on("pointerdown", function(){
            backtoboot = true;
          });

          back.on("pointerdown", function(){
            backtoboot = true;
          });

      }

      update(){
        if(backtoboot !== false){
          this.scene.start("TitleGame");
        }
          if(nextLavel !== false) {
            nextLavel = false;
            stopTimer = false;
            this.scene.start("PlayGame");
          }
      }
  }


  class playGame extends Phaser.Scene{

    constructor(){
      super("PlayGame");
    }


    create(){ 
        level = false;
        gameOver = false;
        reset = false;
        tiles = [];
        clicks = 0;
        gameScore = 0;

        let tileScale = 0.5;
  
        let background = this.add.image(game.config.width / 2, game.config.height / 2, "bg");
        background.setDisplaySize(game.config.width, game.config.height);

        let number_holder = this.add.sprite(game.config.width / 2, game.config.height / 2, "number_holder").setInteractive().setScale(0.56);
        let timer = this.add.sprite(103, 170, "timer").setInteractive().setScale(0.6);
        let reset_btn = this.add.sprite(400, 120, "reset").setInteractive().setScale(0.6);
        let menu_btn = this.add.sprite(400, 174, "menu").setInteractive().setScale(0.6);
        
        menu_btn.on("pointerdown", function(){
          backtomenu = true;
        });

        reset_btn.on("pointerdown", function(){
          reset = true;
        });

        myTime = 0;
        startTimer = 1;
        timeText = this.add.text(87, 147, "_", {fontFamily: "Suez One",
        fontWeight: 400,fontSize: '35px', fill: '#494949' });     
        gameTimer = this.time.addEvent({ delay: 1000, callback: increamentTime, callbackScope: this, loop: true });

       
        if(gameLevel === 1){
          shuffledNumbers = getSolvableArray(3);
          gridWidth = 3;
          gridAdjustValX = 0.94;
          gridAdjustValY = 2.4;
          tileSize = 130;
          tileScale = 0.7;
        }else if(gameLevel === 2){
          shuffledNumbers = getSolvableArray(4);
          gridWidth = 4;
          gridAdjustValX = 1.17;
          gridAdjustValY = 3.2;
          tileSize = 95;
          tileScale = 0.54;
        }else if(gameLevel === 3) {
          shuffledNumbers = getSolvableArray(5);
          gridWidth = 5;
          gridAdjustValX = 0.78;
          gridAdjustValY = 2.95;
          tileSize = 90;
        }
      
      
        let k = 0;
        let thisScene = this;

        for (var i = 0; i < gridWidth; i++) {
            for (var j = 0; j < gridWidth; j++) {
                var number = shuffledNumbers[k];
                
                if(gameLevel === 1 && shuffledNumbers[k] === 9 || gameLevel === 2 && shuffledNumbers[k] === 16 || gameLevel === 3 && shuffledNumbers[k] === 25){
                  var tile = this.add.image(j * tileSize, i * tileSize, 999).setInteractive();
                }else{
                  var tile = this.add.image(j * tileSize, i * tileSize, number).setInteractive();
                }

                tile.number = number;
                tile.setScale(tileScale);
                tile.pos = { x: j + gridAdjustValX, y: i + gridAdjustValY};
                
                tile.on('pointerdown', function () {
                    clicks += 1;
                    // thisScene.swapAnimations(thisScene, this);
                    swapTiles(thisScene, this);

                });

                tiles.push(tile);
                k += 1;

            }
        }

        rearrangeTiles();

    }


    update(){

      let minutes = Math.floor(myTime / 60);
      let seconds;

      if (myTime > 59) {
          seconds = myTime % 60;
      } else {
          seconds = myTime;
      }

      if (stopTimer === false) {
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

      if(reset !== false) {
        this.scene.start("PlayGame");
      }
      if (gameOver !== false) {
        timeText.setText(minutes + ":" + "" + seconds);

        this.time.delayedCall(500, () => {
          
          if (this.scene.get('SuccessGame')) {
              this.scene.start('SuccessGame'); 
          } else {
              console.error('Next scene is not loaded or does not exist.');
          }
      }, [], this);
      }
      if(backtomenu === true){
        backtomenu = false;
        this.scene.start("MenuGame");
      }
    }
    
}

  function increamentTime() {
    if (startTimer === 1) {
        myTime +=1;
    }
  }


  class successGame extends Phaser.Scene{

      constructor(){
          super("SuccessGame");
      }

      create(){
        let background = this.add.image(game.config.width / 2, game.config.height / 2, "bg");
        background.setDisplaySize(game.config.width, game.config.height);

        let score_bgf = this.add.sprite(game.config.width / 2, game.config.height / 2, "score_bgf").setInteractive().setScale(0.8);
        let score_bg = this.add.sprite(250, 190, "score_bg").setInteractive().setScale(0.6);

        let winner = this.add.sprite(game.config.width / 2, game.config.height / 2, "winner").setInteractive().setScale(0.5);
        let menu_btn = this.add.sprite(game.config.width / 2, game.config.height / 1.3, "menu").setInteractive().setScale(0.6);
        let restart = this.add.sprite(game.config.width / 2, game.config.height / 1.17, "restart").setInteractive().setScale(0.5);
        
        let scoreTitleText = this.add.text(115, 130, "Game Score", {fontFamily: "Suez One",
        fontWeight: 400, fontSize: '50px', fill: '#ededed' });  
        let scoreText = this.add.text(190, 180, Math.round(gameScore), {fontFamily: "Suez One",
        fontWeight: 400, fontSize: '50px', fill: '#ededed' });  

          restart.on('pointerup', function () {
            restart.clearTint();
            reset = true;
          });

          menu_btn.on("pointerdown", function(){
            backtomenu = true;
          });

         
      }

      update(){
          if(reset !== false) {
            stopTimer = false;
              this.scene.start("PlayGame");
          }

          if(backtomenu === true){
            backtomenu = false;
            this.scene.start("MenuGame");
          }

      }
  }


  /*********************************************************************************************************
   Initialise variables when window loads
   **************************************************************************************************************/


  window.onload = function() {

    let width = gameOptions.boardSize.cols * padding;
    let height = width * gameOptions.aspectRatio;

    let gameConfig = {
      width: width,
      height: height,
      backgroundColor: 0x000000, // 0xecf0f1
      scene: [bootGame, titleGame, menuGame, playGame, successGame]
    };

    game = new Phaser.Game(gameConfig);

    window.focus();
    resizeGame();
    window.addEventListener("resize", resizeGame);
  };

  /***************************************************************************************************************
    Resize screen on game load and on user action
  ****************************************************************************************************************/

  function resizeGame() {
    let canvas = document.querySelector("canvas");
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;
    let windowRatio = windowWidth / windowHeight;
    let gameRatio = game.config.width / game.config.height;
    
    if (windowRatio < gameRatio) {
        canvas.style.width = windowWidth + "px";
        canvas.style.height = (windowWidth / gameRatio) + "px";
    }
    else {
        canvas.style.width = (windowHeight * gameRatio) + "px";
        canvas.style.height = windowHeight + "px";
    }
  }

  function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]]; // Swap elements using destructuring assignment
      }
      return array;
  }
    
  function swapTiles(scene, tile) {
      var blankTile
      if(gameLevel === 1){
        blankTile = tiles.find(t => t.number === 9);
      }else if(gameLevel === 2){
        blankTile = tiles.find(t => t.number === 16);
      }else if(gameLevel === 3){
        blankTile = tiles.find(t => t.number === 25);
      }

      if (areAdjacent(arrayToMatrix(getTilesArray()), tile.number, blankTile.number)) {

        const tween2 = scene.tweens.create({
          targets: tile,
          alpha: 1,
          x: blankTile.x,
          y: blankTile.y,
          duration: 300,
          ease: 'Power1',
          yoyo: false,
          repeat: 0,
        });
        tween2.play();
       
         setTimeout(() => {
          try { 
            const tileIndex = tiles.findIndex((t) => t.number === tile.number);
            const blankTileIndex = tiles.findIndex((t) => t.number === blankTile.number);
            [tiles[tileIndex], tiles[blankTileIndex]] = [tiles[blankTileIndex], tiles[tileIndex]]
    
          } catch (error) {
            console.log('error',error);
          }
    
          var tempPos = { x: tile.pos.x, y: tile.pos.y };
          tile.pos = { x: blankTile.pos.x, y: blankTile.pos.y };
          blankTile.pos = tempPos;
    
          rearrangeTiles();
         }, 310);
      }
  }

    
    function checkWin() {
      for (var i = 0; i < tiles.length; i++) {
          if (tiles[i].number !== i + 1) {
              return false;
          }
      }
      return true;
    }
    
    // Function to rearrange tiles based on their positions
    function rearrangeTiles() {
      for (var i = 0; i < tiles.length; i++) {
          var tile = tiles[i];
          
          tile.x = tile.pos.x * tileSize;
          tile.y = tile.pos.y * tileSize;


          if(gameLevel === 1 && tile.number === 9 
            || gameLevel === 2 && tile.number === 16
            || gameLevel === 3 && tile.number === 25){
              // just Skipp
            tile.setTexture(`999`);
          }else if (tile.number ===  i + 1) {
            tile.setTexture(`green_${tile.number}`);
          }else {
            tile.setTexture(`${tile.number}`);
          }
    
      }
      if (checkWin()) {
          gameTimer.remove();
          stopTimer = true;
          gameOver = true;

          gameScore = calculateScore(clicks, myTime, gameLevel);
      }
    }
    
  function getSolvableArray(size){
    const puzzle = generateSolvableSlidingPuzzle(size);
    let arr = []
    let k = 0;
    for (let i = 0; i < puzzle.length; i++) {
      for (let j = 0; j < puzzle[0].length; j++) {
        arr[k] = puzzle[i][j];
        k++;
      }
      
    }
    return arr;
  }

  function generateSolvableSlidingPuzzle(size) {
    let puzzle = Array.from({ length: size * size - 1 }, (_, index) => index + 1);
    puzzle.push(size*size); // Add the blank tile

    for (let i = 0; i < Math.floor(Math.random() * 41) + 300; i++) {
        const blankIndex = puzzle.indexOf(size * size);
        const neighbors = getNeighbors(blankIndex, size);

        const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
        [puzzle[blankIndex], puzzle[randomNeighbor]] = [puzzle[randomNeighbor], puzzle[blankIndex]];
    }

    return chunkArray(puzzle, size);
  }

  function getNeighbors(index, size) {
    const neighbors = [];
    const row = Math.floor(index / size);
    const col = index % size;

    if (row > 0) neighbors.push(index - size); // Up
    if (row < size - 1) neighbors.push(index + size); // Down
    if (col > 0) neighbors.push(index - 1); // Left
    if (col < size - 1) neighbors.push(index + 1); // Right

    return neighbors;
  }

  function chunkArray(arr, size) {
    const res = [];
    for (let i = 0; i < arr.length; i += size) {
        res.push(arr.slice(i, i + size));
    }
    return res;
  }



  function arrayToMatrix(arr) {
    const size = Math.sqrt(arr.length);
    const matrix = [];
    for (let i = 0; i < size; i++) {
      matrix[i] = arr.slice(i * size, (i + 1) * size);
    }
    return matrix;
  }

  function areAdjacent(matrix, elem1, elem2) {
    const elem1Index = matrix.flat().indexOf(elem1);
    const elem2Index = matrix.flat().indexOf(elem2);
    if (elem1Index === -1 || elem2Index === -1) return false;
    const elem1Row = Math.floor(elem1Index / matrix[0].length);
    const elem1Col = elem1Index % matrix[0].length;
    const elem2Row = Math.floor(elem2Index / matrix[0].length);
    const elem2Col = elem2Index % matrix[0].length;
    return (Math.abs(elem1Row - elem2Row) === 1 && elem1Col === elem2Col) ||
           (Math.abs(elem1Col - elem2Col) === 1 && elem1Row === elem2Row);
  }

  function getTilesArray(){
    let arr = [];
    for(let i = 0; i<tiles.length; i++){
      arr[i] = tiles[i].number;
    }
    return arr;
  }


  function calculateScore(clicksTaken, timeTaken, level) {
    let baseScore = 0;
    let timeMultiplier = 1; // Score multiplier based on time taken
    let clickMultiplier = 1; // Score multiplier based on number of clicksTaken

    // Set base scores and multipliers based on level
    switch (level) {
        case 1:
            baseScore = 5000;
            timeMultiplier = 2; // Time multiplier for easy level
            clickMultiplier = 3; // Swap multiplier for easy level
            break;
        case 2:
            baseScore = 10000;
            timeMultiplier = 4; // Time multiplier for medium level
            clickMultiplier = 6; // Swap multiplier for medium level
            break;
        case 3:
            baseScore = 15000;
            timeMultiplier = 8; // Time multiplier for hard level
            clickMultiplier = 9; // Swap multiplier for hard level
            break;
        default:
            console.error('Invalid level specified.');
            return null; // Return null if level is invalid
    }

    // Calculate score based on formula (baseScore - (timeTaken * timeMultiplier) - (clicksTaken * clickMultiplier))
    let score = baseScore - (timeTaken * timeMultiplier) - (clicksTaken * clickMultiplier);

    // Ensure score is non-negative
    return Math.max(score, 0);
  }
