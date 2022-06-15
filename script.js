const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const game = urlParams.get("game") || Math.floor(Math.random() * 1000000);
const gameString = game.toString();
let round = parseInt(urlParams.get("roll")) || 1;
let diceRoll,
  prevDiceRoll = [];
let resultArray = [];

// Credit to https://stackoverflow.com/a/424445 for this method
function RNG(seed) {
  // LCG using GCC's constants
  this.m = 0x80000000; // 2**31;
  this.a = 1103515245;
  this.c = 12345;

  this.state = seed ? seed : Math.floor(Math.random() * (this.m - 1));
}
RNG.prototype.nextInt = function () {
  this.state = (this.a * this.state + this.c) % this.m;
  return this.state;
};
RNG.prototype.nextFloat = function () {
  // returns in range [0,1]
  return this.nextInt() / (this.m - 1);
};
RNG.prototype.nextRange = function (start, end) {
  // returns in range [start, end): including start, excluding end
  // can't modulu nextInt because of weak randomness in lower bits
  var rangeSize = end - start;
  var randomUnder1 = this.nextInt() / this.m;
  return start + Math.floor(randomUnder1 * rangeSize);
};
RNG.prototype.choice = function (array) {
  return array[this.nextRange(0, array.length)];
};

var rng = new RNG(isNaN(game) ? 10 : parseInt(game));

var digits = ["1", "2", "3", "4", "5", "6"];
for (var i = 0; i < round * 2; i++) {
  resultArray[i] = rng.choice(digits);
}

diceRoll = resultArray.splice(-2);
if (resultArray.length > 0) {
  prevDiceRoll = resultArray.splice(-2);
}

const dice = [
  `<div class="dice first-face">
        <span class="dot">
        </span>
      </div>`,
  `<div class="dice second-face">
        <span class="dot">
        </span>
        <span class="dot">
        </span>
      </div>`,
  `<div class="dice third-face">
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </div>`,
  `<div class="fourth-face dice">
      <div class="column">
        <span class="dot"></span>
        <span class="dot"></span>
      </div>
      <div class="column">
        <span class="dot"></span>
        <span class="dot"></span>
      </div>
    </div>`,
  `<div class="fifth-face dice">
      <div class="column">
        <span class="dot"></span>
        <span class="dot"></span>
      </div>
      
      <div class="column">
        <span class="dot"></span>
      </div>
      
      <div class="column">
        <span class="dot"></span>
        <span class="dot"></span>
      </div>

    </div>`,
  `<div class="sixth-face dice">
      <div class="column">
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </div>
      <div class="column">
        <span class="dot"></span>
        <span class="dot"></span>
            <span class="dot"></span>
      </div>
    </div>`,
];

document.addEventListener("DOMContentLoaded", () => {
  //the event occurred
  document.getElementById(
    "gameNumber"
  ).innerHTML = `Game-id: ${gameString.substring(0, 3)}-${gameString.substring(
    3
  )}`;
  document.getElementById("roundNumber").innerHTML = `Roll #${round}`;
  let dice1 = document.getElementById("dice1");
  dice1.innerHTML = dice[diceRoll[0] - 1];

  let dice2 = document.getElementById("dice2");
  dice2.innerHTML = dice[diceRoll[1] - 1];

  setTimeout(() => {
    dice1.childNodes[0].classList.add("thrown");
    dice2.childNodes[0].classList.add("thrown");
  }, 50);

  if (round <= 1) {
    document.getElementById("previousRoll").remove();
  }

  if (round > 1) {
    document.getElementById("prevDice1").innerHTML = dice[prevDiceRoll[0] - 1];
    document.getElementById("prevDice2").innerHTML = dice[prevDiceRoll[1] - 1];
  }
});

function validate(evt) {
  var theEvent = evt || window.event;
  let key;

  // Handle paste
  if (theEvent.type === "paste") {
    key = clipboardData.getData("text/plain");
  } else {
    // Handle key press
    key = theEvent.keyCode || theEvent.which;
    key = String.fromCharCode(key);
  }
  var regex = /\d|\./;
  if (!regex.test(key)) {
    theEvent.returnValue = false;
    if (theEvent.preventDefault) theEvent.preventDefault();
  }
}

function generateLink(isNewGame) {
  return `${document.location.origin}${document.location.pathname}?game=${
    isNewGame || gameString
  }`;
}

function shareGame(event) {
  event.preventDefault();
  navigator.clipboard.writeText(generateLink());
  document.getElementById("sharedMessage").className = "success";
  document.getElementById("sharedMessage").innerHTML =
    "URL copied to clipboard.";
}

function newGame() {
  let newGameNumber = document.getElementById("customGameNumber").value;
  newGameNumber =
    newGameNumber.length > 0
      ? newGameNumber
      : Math.floor(Math.random() * 1000000);

  window.location.replace(generateLink(String(newGameNumber).padStart(6, "0")));
}

function nextRoll() {
  rollDice(round + 1);
}

function previousRoll() {
  rollDice(round - 1);
}

function rollDice(modifier) {
  window.location.replace(`${generateLink()}&roll=${modifier}`);
}
