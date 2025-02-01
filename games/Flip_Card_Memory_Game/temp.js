

const moves = document.getElementById("moves");
const timeValue = document.getElementById("time");
const mach = document.getElementById("matches");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const gameContainer = document.querySelector(".game-container");
const result = document.getElementById("result");
const mainContainer = document.getElementById("main-container");
const startButtonContainer = document.getElementById("startButton");


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
  // updateMoveCounter();
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

memoryCardBeginnerGame() {
  initializer(4);
}
memoryCardIntermediateGame(){
  initializer(6);
}
memoryCardExpertGame(){
  initializer(8);
}
function openPopup() {
  // document.getElementById('popup').style.display = 'block'; // Show the popup
  // document.getElementById('overlay').style.display = 'block'; // Show the overlay

  document.getElementById('popup').classList.remove('hidePopUp')
  document.getElementById('overlay').classList.remove('hidePopUp')
}

// Function to close the popup
function closePopup() {
  // document.getElementById('popup').style.display = 'none'; // Hide the popup
  // document.getElementById('overlay').style.display = 'none'; // Hide the overlay
  document.getElementById('popup').classList.add('hidePopUp')
  document.getElementById('overlay').classList.add('hidePopUp')
}

// function calculateScore(moves, time, avgMoves=17, avgTime=50, minMoves=8, minTime=15) {
//   const maxScore = 500;
//   const actualMovesPenalty = moves > minMoves ? moves - minMoves : 0;
//   const timeBonus = time > minTime ? (time - minTime) * (maxScore / avgTime) : 0;
//   const score = maxScore - actualMovesPenalty - timeBonus;
//   return Math.max(0, Math.min(score, maxScore));
// }

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

function getStarsIcons(count) {
  let starsIcons = '';
  for (let i = 0; i < count; i++) {
      starsIcons += '★'; // Add a star icon for each count
  }
  return starsIcons;
}

function startCounter() {
  clearInterval(interval);
  interval = setInterval(timeGenerator, 1000);
}


let restart = document.querySelector(".restart");
restart.addEventListener("click", restartGame, false);

function restartGame() {
  makeWindowFullScreen();

  movesCount = 0;
  seconds = 0;
  minutes = 0;
  maches = 0;
  firstClicked = true;
  clearInterval(interval);
  // startCounter();


  moves.innerHTML = `<span>Moves: </span>${movesCount}`;
  mach.innerHTML = `<span>Maches: </span>${maches}`;
  timeValue.innerHTML = `<span>Time: 00:00</span>`;

  initializer();


}

function updateMoveCounter() {
  // movesCount++;
  // movesCount.textContent = "Moves: " + movesCounter;
  if (movesCount === 13) {
      let star = document.querySelector("#star3");
      star.classList.toggle("fa-star");
      star.classList.add("fa-star-o");
      stars--;
  } else if (movesCount === 25) {
      let star = document.querySelector("#star2");
      star.classList.toggle("fa-star");
      star.classList.add("fa-star-o");
      stars--;
  } else if (movesCount === 35) {
      let star = document.querySelector("#star1");
      star.classList.toggle("fa-star");
      star.classList.add("fa-star-o");
      stars--;
  }
}


//Start game
startButton.addEventListener("click", () => {

  startButton.classList.add("hide");
  stopButton.classList.remove("hide")

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

  initializer(4);
});


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



// Stop game
stopButton.addEventListener(
  "click",
  (stopGame = () => {
  //   controls.classList.remove("hide")
    firstClicked = true;
    restartGame();
    
  })
);

function stopGame() {
  resetData();
}

//Initialize values and func calls
const initializer = (size = 4) => {
  
  result.innerText = "";
  winCount = 0;
  let cardValues = generateRandom(size);
  matrixGenerator(cardValues, size);
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

initializer();