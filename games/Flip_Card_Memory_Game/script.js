const moves = document.getElementById("moves");
const timeValue = document.getElementById("time");
const mach = document.getElementById("matches");
const startButton = document.getElementById("start");
const restartButton = document.getElementById("restart");
const gameContainer = document.querySelector(".game-container");
const result = document.getElementById("result");
const mainContainer = document.querySelector(".Memory-game-main-container");
const startButtonContainer = document.getElementById("startButton");

var gameMode = "beginner";
let cards;
let interval;
let firstCard = false;
let secondCard = false;
let firstClicked = true;
let firstTimeClicked = false;

let stars = 3;
let maches = 0;
let isStart = true;

const items = [
  { name: "bee", image: "./imgs/bee.png" },
  { name: "crocodile", image: "./imgs/crocodile.png" },
  { name: "macaw", image: "./imgs/macaw.png" },
  { name: "gorilla", image: "./imgs/gorilla.png" },
  { name: "tiger", image: "./imgs/tiger.png" },
  { name: "monkey", image: "./imgs/monkey.png" },
  { name: "chameleon", image: "./imgs/chameleon.png" },
  { name: "piranha", image: "./imgs/piranha.png" },
  { name: "anaconda", image: "./imgs/anaconda.png" },
  { name: "sloth", image: "./imgs/sloth.png" },
  { name: "cockatoo", image: "./imgs/cockatoo.png" },
  { name: "toucan", image: "./imgs/toucan.png" },
  { name: "snail", image: "./imgs/snail.png" },
  { name: "octopus", image: "./imgs/octopus.png" },
  { name: "owl", image: "./imgs/owl.png" },
  { name: "sea-turtle", image: "./imgs/sea-turtle.png" },
  { name: "crab", image: "./imgs/crab.png" },
  { name: "cow", image: "./imgs/cow.png" },
  { name: "fox", image: "./imgs/fox.png" },
  { name: "panda", image: "./imgs/panda.png" },
  { name: "deer", image: "./imgs/deer.png" },
  { name: "bat", image: "./imgs/bat.png" },
  { name: "strawberry", image: "./imgs/strawberry.png" },
  { name: "grapes", image: "./imgs/grapes.png" },
  { name: "grapefruit", image: "./imgs/grapefruit.png" },
  { name: "mango", image: "./imgs/mango.png" },
  { name: "watermelon", image: "./imgs/watermelon.png" },
  { name: "bananas", image: "./imgs/bananas.png" },
  { name: "coconut", image: "./imgs/coconut.png" },
  { name: "sea-urchin", image: "./imgs/sea-urchin.png" },
  { name: "forest", image: "./imgs/forest.png" },
  { name: "tree", image: "./imgs/tree.png" },
  { name: "christmas-tree", image: "./imgs/christmas-tree.png" },
  { name: "palm-tree", image: "./imgs/palm-tree.png" },
  
];

let seconds = 0;
let minutes = 0;
let movesCount = 0;
let winCount = 0;

const timeGenerator = () => {
  seconds += 1;
  if (seconds >= 60) {
    minutes += 1;
    seconds = 0;
  }
  let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
  let minutesValue = minutes < 10 ? `0${minutes}` : minutes;
  timeValue.innerHTML = `<span>Time: </span>${minutesValue}:${secondsValue}`;
};

const movesCounter = () => {
  movesCount += 1;
  moves.innerHTML = movesCount < 10 ? `<span>Moves: 0${movesCount}</span>` : `<span>Moves: ${movesCount}</span>`;

};

const generateRandom = (size = 4) => {
  let tempArray = [...items];
  let cardValues = [];
  size = (size * size) / 2;
  for (let i = 0; i < size; i++) {
    const randomIndex = Math.floor(Math.random() * tempArray.length);
    cardValues.push(tempArray[randomIndex]);
    tempArray.splice(randomIndex, 1);
  }
  return cardValues;
};

const matrixGenerator = (cardValues, size = 4) => {
  gameContainer.innerHTML = "";
  cardValues = [...cardValues, ...cardValues];
  cardValues.sort(() => Math.random() - 0.5);
  for (let i = 0; i < size * size; i++) {
    gameContainer.innerHTML += `
       <div class="card-container" data-card-value="${cardValues[i].name}">
          <div class="card-before">?</div>
          <div class="card-after">
            <img src="${cardValues[i].image}" class="image"/>
          </div>
       </div>
       `;
  }
  gameContainer.style.gridTemplateColumns = `repeat(${size},1fr)`;

  let firstCardValue;
  let secondCardValue;

  cards = document.querySelectorAll(".card-container");
  cards.forEach((card) => {
    card.addEventListener("click", async () => {
      console.log(card);

      // Start counter
       if(firstClicked) {
        startCounter();
        firstClicked = false;
        
      }
      

      if(card.classList.contains("flipped")) return;


      //If selected card is not matched yet then only run (i.e already matched card when clicked would be ignored)
      if (!card.classList.contains("matched")) {
        //flip the cliked card
        card.classList.add("flipped");
        //if it is the firstcard (!firstCard since firstCard is initially false)
        if (!firstCard) {
          //so current card will become firstCard
          firstCard = card;
          //current cards value becomes firstCardValue
          firstCardValue = card.getAttribute("data-card-value");
          // console.log(firstCardValue);
        } else {
          //increment moves since user selected second card
          movesCounter();
          // console.log(movesCount);

          //secondCard and value
          secondCard = card;
          let secondCardValue = card.getAttribute("data-card-value");
          if (firstCardValue == secondCardValue) {
            //if both cards match add matched class so these cards would beignored next time
            firstCard.classList.add("matched");
            secondCard.classList.add("matched");

            
            firstCard.classList.toggle('active');
            secondCard.classList.toggle('active');
            

            maches += 1;
            // console.log(maches);
            mach.innerHTML = `<span>Maches: ${maches}</span>`;

            //set firstCard to false since next card would be first now
            firstCard = false;
            //winCount increment as user found a correct match
            winCount += 1;
            
            console.log(movesCount, "  ", winCount);
            if (winCount == Math.floor(cardValues.length / 2)) {
            // if(winCount == 2){
         
              clearInterval(interval);
              startButton.classList.remove("hide");
              mainContainer.classList.add("hide");
              startButtonContainer.classList.remove("reduce-startButton-area");

              win(movesCount, minutes, seconds);
              
            }
            
          } else {
            //if the cards dont match
            //flip the cards back to normal
            let [tempFirst, tempSecond] = [firstCard, secondCard];
            firstCard = false;
            secondCard = false;
            let delay = setTimeout(() => {
              tempFirst.classList.remove("flipped");
              tempSecond.classList.remove("flipped");
            }, 600);
          }
        }
      }
    });
  });
};



function openPopup() {

  document.getElementById('popup').classList.remove('hidePopUp')
  document.getElementById('overlay').classList.remove('hidePopUp')
}

// Function to close the popup
function closePopup() {
  document.getElementById('popup').classList.add('hidePopUp')
  document.getElementById('overlay').classList.add('hidePopUp')
}

function calculateScore(moves, timeInSeconds) {
  const maxScore = 5000;
  const timePenaltyPerSecond = 10;
  const movesPenaltyPerMove = 100;

  // Calculate time penalty
  const timePenalty = Math.max(0, timeInSeconds - 30) * timePenaltyPerSecond;

  // Calculate moves penalty
  const movesPenalty = Math.max(0, moves - 24) * movesPenaltyPerMove;

  // Calculate final score
  const finalScore = Math.max(0, maxScore - timePenalty - movesPenalty);

  return finalScore;
}

function win( moves, minutes, seconds) {
  firstClicked = true;

  let res1 = document.getElementById("res-1");
  let res2 = document.getElementById("res-2"); 
  let res3 = document.getElementById("res-3");

  let timevalue = minutes * 60 + seconds;
  score = Math.round(calculateScore(moves * 2, timevalue));


  res1.innerHTML = `You won !!!<br>SCORE: ${score}`;// Display the score
  res2.innerHTML = `Moves: ${moves}<br>`; 
  res3.innerHTML = `Time taken: ${timevalue} seconds`
  openPopup();
  stopGame();
}

function loose(){
const res1 = document.getElementById('res-1');
  const res2 = document.getElementById('res-2');

  res1.innerHTML = `You Loose with 0 stars`;
  res2.innerHTML = `and Moves: ${movesCount}`

  openPopup();
  stopGame();
}



function startCounter() {
  clearInterval(interval);
  interval = setInterval(timeGenerator, 1000);
}

let restart = document.querySelector(".restart");
restart.addEventListener("click", restartGame, false);

function restartGame() {
  makeWindowFullScreen();


  if(gameMode == "beginner") {
    memoryCardBeginnerGame();
  }else if(gameMode == "intermediate"){
    memoryCardIntermediateGame();
  }else if(gameMode == "expert"){
    memoryCardExpertGame();
  }

}

//Start game
startButton.addEventListener("click", () => {

  startMemoryGame();

  initializer();
});


function stopGame() {
  resetData();
}

function startMemoryGame() {
  startButton.classList.add("hide");
  restartButton.classList.remove("hide")

  mainContainer.classList.remove("hide");
  mainContainer.classList.remove("reset-size-main-container");
  startButtonContainer.classList.add("reduce-startButton-area");

  makeWindowFullScreen();
  movesCount = 0;
  seconds = 0;
  minutes = 0;
  maches = 0;
  clearInterval(interval);
  startCounter();

  moves.innerHTML = `<span>Moves:</span> ${movesCount}`;
  timeValue.innerHTML = `<span>Time:00:00</span>`;
  mach.innerHTML = `<span>Maches:0</span>`;
}


/// MAKE WINDOW FULL SCREEN
let isFullscreen = false;
function makeWindowFullScreen() {
  const elem = document.documentElement;

  document.querySelector('.start').addEventListener('click', () => {
    if(!isFullscreen) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) { /* Safari */
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) { /* IE11 */
        elem.msRequestFullscreen();
      }
      isFullscreen = true;
    }
    
  });


    document.querySelector('.restart').addEventListener('click', () => {
      if(!isFullscreen){
        if (elem.requestFullscreen) {
          elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) { /* Safari */
          elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { /* IE11 */
          elem.msRequestFullscreen();
        }
        isFullscreen = true;
      }
      
    });
    
}



//Initialize values and func calls
const initializer = () => {
  
  result.innerText = "";
  winCount = 0;
  let cardValues = generateRandom();
  matrixGenerator(cardValues);
};

function resetData() {
  winCount = 0;
  movesCount = 0;
  seconds = 0;
  minutes = 0;
  maches = 0;
  firstClicked = true;

  moves.innerHTML = `<span>Moves: </span>${movesCount}`;
  timeValue.innerHTML = `<span>Time: 00:00</span>`;
  mach.innerHTML = `<span>Maches: 0</span>`;
  clearInterval(interval);
}


function memoryCardBeginnerGame(size = 4) {

gameSetUpBeginner(100, 95, 400, 90, 300, 20, 20);


  gameMode = "beginner";
  stopGame();
  result.innerText = "";
  winCount = 0;
  let cardValues = generateRandom(size);
  matrixGenerator(cardValues, size);
}

function memoryCardIntermediateGame(size = 6) {
  gameMode = "intermediate";
  stopGame();
  result.innerText = "";
  winCount = 0;
  let cardValues = generateRandom(size);
  matrixGenerator(cardValues, size);
}

function memoryCardExpertGame(size = 8) {
  gameMode = "expert";
  stopGame();
  result.innerText = "";
  winCount = 0;
  let cardValues = generateRandom(size);
  matrixGenerator(cardValues, 8);
}

initializer();





function gameSetUpBeginner(containerWidth, wrapperWidth, wrapperHeight, gameContainerWidth, gameContainerHeight, cardBefore, cardAfter) {
  const wrapperContainer = document.querySelector(".memory-game-wrapper");
  const GameContainer = document.querySelector(".game-container");
  const CardBefore = document.querySelector(".card-before");
  const CardAfter = document.querySelector(".card-after");

  wrapperContainer.style.setProperty("--memoryGame-wrapper-size-width", wrapperWidth+"%");
  wrapperContainer.style.setProperty("--memoryGame-wrapper-size-height", wrapperHeight+"px");

  GameContainer.style.setProperty("--memoryGame-gameContainer-size-width", gameContainerWidth+"%");
  GameContainer.style.setProperty("--memoryGame-gameContainer-size-height", gameContainerWidth+"%");

  CardBefore.style.setProperty("--memoryGame-cardBefore-size-width", cardBefore+"%");
  CardBefore.style.setProperty("--memoryGame-cardBefore-size-height", cardBefore+"%");

  CardAfter.style.setProperty("--memoryGame--cardAfter-size-width", cardAfter+"%");
  CardAfter.style.setProperty("--memoryGame--cardAfter-size-height", cardAfter+"%");
}

function gameSetUpIntermediateGame() {
  const wrapperContainer = document.querySelector(".memory-game-wrapper");
  const GameContainer = document.querySelector(".game-container");
  const CardBefore = document.querySelector(".card-before");
  const CardAfter = document.querySelector(".card-after");


  // mainContainer.style.setProperty("--memoryGame-mainContainer-size-width", containerWidth+"px");
  wrapperContainer.style.setProperty("--memoryGame-wrapper-size-width", wrapperWidth+"px");
  cardBefore.style.setProperty("--memoryGame-cardBefore-size-width", cardBefore+"px");
  cardBefore.style.setProperty("--memoryGame-cardBefore-size-height", cardBefore+"px");

  cardAfter.style.setProperty("--memoryGame--cardAfter-size-width", cardAfter+"px");
  cardAfter.style.setProperty("--memoryGame--cardAfter-size-height", cardAfter+"px");
}

function gameSetUpExpert() {
  const wrapperContainer = document.querySelector(".memory-game-wrapper");
  const GameContainer = document.querySelector(".game-container");
  const CardBefore = document.querySelector(".card-before");
  const CardAfter = document.querySelector(".card-after");


  // mainContainer.style.setProperty("--memoryGame-mainContainer-size-width", containerWidth+"px");
  wrapperContainer.style.setProperty("--memoryGame-wrapper-size-width", wrapperWidth+"px");
  cardBefore.style.setProperty("--memoryGame-cardBefore-size-width", cardBefore+"px");
  cardBefore.style.setProperty("--memoryGame-cardBefore-size-height", cardBefore+"px");

  cardAfter.style.setProperty("--memoryGame--cardAfter-size-width", cardAfter+"px");
  cardAfter.style.setProperty("--memoryGame--cardAfter-size-height", cardAfter+"px");
}