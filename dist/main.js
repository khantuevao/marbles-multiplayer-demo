/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
const Player = (name) => {
  let score = 10;
  let bet;
  let role;
  let ready = false;
  let choice;

  return { name, score, bet, role, ready, choice };
};

let playerOne;
let playerTwo;

let roundCount = 0;

const betForm = document.getElementById('betForm');
const marblesOne = document.getElementById('marblesOne');

const roleOne = document.getElementById('roleOne');
const roleTwo = document.getElementById('roleTwo');

const announcements = document.getElementById("announcements");



const submitName = document.getElementById('submitName');
submitName.addEventListener('click', () => {
  const inputName = document.getElementById('inputName');
  if (inputName.value === "") {
    playerOne = Player("Player One");
  } else {
    playerOne = Player(`${inputName.value}`);
  }
  playerOne.ready = true;

  playerTwo = Player('A.I.')
  playerTwo.ready = true;

  const getName = document.getElementById('getName');
  getName.innerHTML = '';

  const playerTwoDiv = document.getElementById('playerTwo');
  playerTwoDiv.classList.remove('hidden');
  
  const scoreOne = document.getElementById('scoreOne');
  scoreOne.classList.remove('hidden')

  const nameOne = document.getElementById('nameOne');
  nameOne.innerHTML = `${playerOne.name}`;
  const nameTwo = document.getElementById('nameTwo');
  nameTwo.innerHTML = `${playerTwo.name}`;

  if (bothReady()) playRound();
})

function bothReady() {
  if (playerOne.ready && playerTwo.ready) playRound();
}

function playRound() {
  resolveTurn();
  roundCount++;

  playerOne.ready = false;
  playerTwo.ready = false;

  betForm.classList.remove("hidden");

  renderScore();

  if (roundCount === 1) {
    //first round
    renderMarbles();
    decideRoles();
    renderRoles();
    changeAnnouncement();
    placeBets();
  } else if (playerOne.score === 0 || playerTwo.score === 0) {
    //game ends
    reRenderMarbles();
    betForm.classList.add("hidden");
    roleOne.classList.add("none");
    roleTwo.classList.add("none");
    announcements.innerHTML = `<p><strong>${roundWinner}</strong> ${outcome} and won <strong>${wonAmount} marbles.</strong></p>
                                 <h3>Game over</h3>
                                 <p>${roundWinner} is the winner</p>`;
  } else {
    //default
    reRenderMarbles();
    changeRoles();
    renderRoles();
    changeAnnouncement();
    placeBets();
  }
}

function renderRoles() {
  roleOne.innerHTML = `${playerOne.role}`;

  roleTwo.innerHTML = `${playerTwo.role}`;
}

function decideRoles() {
  const result = Math.floor(Math.random() * 2);
  if (result === 0) {
    playerOne.role = "hider";
    playerTwo.role = "guesser";
  } else {
    playerOne.role = "guesser";
    playerTwo.role = "hider";
  }
}

function changeRoles() {
  if (playerOne.score === 1) {
    playerOne.role = "guesser";
    playerTwo.role = "hider";
  } else if (playerTwo.score === 1) {
    playerOne.role = "hider";
    playerTwo.role = "guesser";
  } else if (playerOne.role === "hider") {
    playerOne.role = "guesser";
    playerTwo.role = "hider";
  } else if (playerOne.role === "guesser") {
    playerOne.role = "hider";
    playerTwo.role = "guesser";
  }
}

function renderScore() {
  const scoreNumberOne = document.getElementById('scoreNumberOne');
  scoreNumberOne.innerHTML = `${playerOne.score}`;

  const scoreNumberTwo = document.getElementById('scoreNumberTwo');
  scoreNumberTwo.innerHTML = `${playerTwo.score}`;
}

function changeAnnouncement() {
  switch (roundCount) {
    case 1:
      announcements.innerHTML = `<p>Players have been assigned roles randomly</p>
                                 <h3>Round ${roundCount}</h3>
                                 <p>Make your moves</p>`;
      break;
    default:
      announcements.innerHTML = `<p><strong>${roundWinner}</strong> ${outcome} and won <strong>${wonAmount} marbles.</strong></p>
                                 <h3>Round ${roundCount}</h3>
                                 <p>Make your moves</p>`;
  }
}

function placeBets() {
  const submitBetOne = document.getElementById("submitBetOne");
  submitBetOne.addEventListener("click", () => {
    const betFieldOne = document.getElementById("betFieldOne");

    if (
      betFieldOne.value > playerOne.score ||
      betFieldOne.value > playerTwo.score ||
      betFieldOne.value < 1 ||
      isNaN(betFieldOne.value)
    ) {
      return;
    } else {
      playerOne.bet = betFieldOne.value;
    }

    const evenOne = document.getElementById("evenOne");
    const oddOne = document.getElementById("oddOne");

    if (evenOne.checked === true) {
      playerOne.choice = "even";
    } else if (oddOne.checked === true) {
      playerOne.choice = "odd";
    } else {
      return;
    }

    betFieldOne.value = "";

    betForm.classList.add("hidden");

    playerOne.ready = true;


    function aiBet(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    if (playerTwo.score > playerOne.score) {
      playerTwo.bet = aiBet(1, playerOne.score);
    } else {
      playerTwo.bet = aiBet(1, playerTwo.score)
    }
    playerTwo.bet = aiBet(1, playerTwo.score)

    function aiChoice() {
      let result;
      let randomNum = aiBet(1, 2);
      if (randomNum === 1) {
        result = 'odd';
      } else {
        result = 'even';
      }
      return result;
    }
    playerTwo.choice = aiChoice();

    playerTwo.ready = true;

    if (bothReady()) playRound();
  });
}

function resolveTurn() {
  if (playerOne.role === "guesser") {
    if (playerOne.choice === playerTwo.choice) {
      playerOne.score += Number(playerOne.bet);
      playerTwo.score -= Number(playerOne.bet);
      roundWinner = playerOne.name;
      wonAmount = playerOne.bet;
      outcome = "guessed correctly";
    } else {
      playerOne.score -= Number(playerOne.bet);
      playerTwo.score += Number(playerOne.bet);
      roundWinner = playerTwo.name;
      wonAmount = playerOne.bet;
      outcome = "has not been figured out";
    }
  } else if (playerOne.role === "hider") {
    if (playerOne.choice === playerTwo.choice) {
      playerOne.score -= Number(playerTwo.bet);
      playerTwo.score += Number(playerTwo.bet);
      roundWinner = playerTwo.name;
      wonAmount = playerTwo.bet;
      outcome = "guessed correctly";
    } else {
      playerOne.score += Number(playerTwo.bet);
      playerTwo.score -= Number(playerTwo.bet);
      roundWinner = playerOne.name;
      wonAmount = playerTwo.bet;
      outcome = "has not been figured out";
    }
  }
}

/*
function renderMarbles() {
  const marblesOne = document.getElementById('marblesOne');

  const marblePieces = document.querySelectorAll('marble')
  for (let i = 0; i < marblePieces.length; i++) {
    marblePieces[i].classList.remove('big');
    marblePieces[i].classList.add('small');
  }

  setTimeout(clear(), 1000)

  function clear() {
    marblesOne.innerHTML = '';
  }

  for (let i = 0; i < playerOne.score; i++) {
    const marbleDiv = document.createElement('div');
    marbleDiv.innerHTML = `<img src="../src/images/marble.png">`;
    marbleDiv.classList.add('marble');
    marblesOne.appendChild(marbleDiv);
  }

  const marblesTwo = document.getElementById('marblesTwo');

  marblesTwo.innerHTML = '';

  for (let i = 0; i < playerTwo.score; i++) {
    const marbleDiv = document.createElement('div');
    marbleDiv.innerHTML = `<img src="../src/images/marble.png">`;
    marbleDiv.classList.add('marble');
    marblesTwo.appendChild(marbleDiv);
  }

  for (let i = 0; i < marblePieces.length; i++) {
    marblePieces[i].classList.remove('small');
    marblePieces[i].classList.add('big');
  }

}
*/

const marblePiecesOne = document.querySelectorAll('.marble.one');
const marblePiecesTwo = document.querySelectorAll('.marble.two');

function renderMarbles() {
  for (let i = 0; i < playerOne.score; i++) {
    marblePiecesOne[i].classList.remove('small')
    marblePiecesOne[i].classList.add('big')
  }

  for (let i = 0; i < playerTwo.score; i++) {
    marblePiecesTwo[i].classList.remove('small')
    marblePiecesTwo[i].classList.add('big')
  }
}
function reRenderMarbles() {
  const marblePiecesOneBig = document.querySelectorAll('.marble.one.big');

  if (playerOne.score > marblePiecesOneBig.length) {
    let diff = playerOne.score - marblePiecesOneBig.length;
    for (let i = 0; i < diff; i++) {
      marblePiecesOne[i + marblePiecesOneBig.length].classList.remove('small')
      marblePiecesOne[i + marblePiecesOneBig.length].classList.add('big')
    }
  } else if (playerOne.score < marblePiecesOneBig.length) {
    let diff = marblePiecesOneBig.length - playerOne.score;
    for (let i = 0; i < diff; i++) {
      marblePiecesOne[i + playerOne.score].classList.remove('big')
      marblePiecesOne[i + playerOne.score].classList.add('small')
    }
  }

  const marblePiecesTwoBig = document.querySelectorAll('.marble.two.big');

  if (playerTwo.score > marblePiecesTwoBig.length) {
    let diff = playerTwo.score - marblePiecesTwoBig.length;
    for (let i = 0; i < diff; i++) {
      marblePiecesTwo[i + marblePiecesTwoBig.length].classList.remove('small')
      marblePiecesTwo[i + marblePiecesTwoBig.length].classList.add('big')
    }
  } else if (playerTwo.score < marblePiecesTwoBig.length) {
    let diff = marblePiecesTwoBig.length - playerTwo.score;
    for (let i = 0; i < diff; i++) {
      marblePiecesTwo[i + playerTwo.score].classList.remove('big')
      marblePiecesTwo[i + playerTwo.score].classList.add('small')
    }
  }
}


/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O0FBQ0o7QUFDQSxvQkFBb0IsVUFBVTtBQUM5QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0Esb0JBQW9CLFVBQVU7QUFDOUI7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0Esb0JBQW9CLFVBQVU7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL21hcmJsZXMtbXVsdGlwbGF5ZXItZGVtby8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBQbGF5ZXIgPSAobmFtZSkgPT4ge1xuICBsZXQgc2NvcmUgPSAxMDtcbiAgbGV0IGJldDtcbiAgbGV0IHJvbGU7XG4gIGxldCByZWFkeSA9IGZhbHNlO1xuICBsZXQgY2hvaWNlO1xuXG4gIHJldHVybiB7IG5hbWUsIHNjb3JlLCBiZXQsIHJvbGUsIHJlYWR5LCBjaG9pY2UgfTtcbn07XG5cbmxldCBwbGF5ZXJPbmU7XG5sZXQgcGxheWVyVHdvO1xuXG5sZXQgcm91bmRDb3VudCA9IDA7XG5cbmNvbnN0IGJldEZvcm0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYmV0Rm9ybScpO1xuY29uc3QgbWFyYmxlc09uZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYXJibGVzT25lJyk7XG5cbmNvbnN0IHJvbGVPbmUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncm9sZU9uZScpO1xuY29uc3Qgcm9sZVR3byA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyb2xlVHdvJyk7XG5cbmNvbnN0IGFubm91bmNlbWVudHMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFubm91bmNlbWVudHNcIik7XG5cblxuXG5jb25zdCBzdWJtaXROYW1lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N1Ym1pdE5hbWUnKTtcbnN1Ym1pdE5hbWUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gIGNvbnN0IGlucHV0TmFtZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpbnB1dE5hbWUnKTtcbiAgaWYgKGlucHV0TmFtZS52YWx1ZSA9PT0gXCJcIikge1xuICAgIHBsYXllck9uZSA9IFBsYXllcihcIlBsYXllciBPbmVcIik7XG4gIH0gZWxzZSB7XG4gICAgcGxheWVyT25lID0gUGxheWVyKGAke2lucHV0TmFtZS52YWx1ZX1gKTtcbiAgfVxuICBwbGF5ZXJPbmUucmVhZHkgPSB0cnVlO1xuXG4gIHBsYXllclR3byA9IFBsYXllcignQS5JLicpXG4gIHBsYXllclR3by5yZWFkeSA9IHRydWU7XG5cbiAgY29uc3QgZ2V0TmFtZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdnZXROYW1lJyk7XG4gIGdldE5hbWUuaW5uZXJIVE1MID0gJyc7XG5cbiAgY29uc3QgcGxheWVyVHdvRGl2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BsYXllclR3bycpO1xuICBwbGF5ZXJUd29EaXYuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJyk7XG4gIFxuICBjb25zdCBzY29yZU9uZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzY29yZU9uZScpO1xuICBzY29yZU9uZS5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKVxuXG4gIGNvbnN0IG5hbWVPbmUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbmFtZU9uZScpO1xuICBuYW1lT25lLmlubmVySFRNTCA9IGAke3BsYXllck9uZS5uYW1lfWA7XG4gIGNvbnN0IG5hbWVUd28gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbmFtZVR3bycpO1xuICBuYW1lVHdvLmlubmVySFRNTCA9IGAke3BsYXllclR3by5uYW1lfWA7XG5cbiAgaWYgKGJvdGhSZWFkeSgpKSBwbGF5Um91bmQoKTtcbn0pXG5cbmZ1bmN0aW9uIGJvdGhSZWFkeSgpIHtcbiAgaWYgKHBsYXllck9uZS5yZWFkeSAmJiBwbGF5ZXJUd28ucmVhZHkpIHBsYXlSb3VuZCgpO1xufVxuXG5mdW5jdGlvbiBwbGF5Um91bmQoKSB7XG4gIHJlc29sdmVUdXJuKCk7XG4gIHJvdW5kQ291bnQrKztcblxuICBwbGF5ZXJPbmUucmVhZHkgPSBmYWxzZTtcbiAgcGxheWVyVHdvLnJlYWR5ID0gZmFsc2U7XG5cbiAgYmV0Rm9ybS5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZGVuXCIpO1xuXG4gIHJlbmRlclNjb3JlKCk7XG5cbiAgaWYgKHJvdW5kQ291bnQgPT09IDEpIHtcbiAgICAvL2ZpcnN0IHJvdW5kXG4gICAgcmVuZGVyTWFyYmxlcygpO1xuICAgIGRlY2lkZVJvbGVzKCk7XG4gICAgcmVuZGVyUm9sZXMoKTtcbiAgICBjaGFuZ2VBbm5vdW5jZW1lbnQoKTtcbiAgICBwbGFjZUJldHMoKTtcbiAgfSBlbHNlIGlmIChwbGF5ZXJPbmUuc2NvcmUgPT09IDAgfHwgcGxheWVyVHdvLnNjb3JlID09PSAwKSB7XG4gICAgLy9nYW1lIGVuZHNcbiAgICByZVJlbmRlck1hcmJsZXMoKTtcbiAgICBiZXRGb3JtLmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG4gICAgcm9sZU9uZS5jbGFzc0xpc3QuYWRkKFwibm9uZVwiKTtcbiAgICByb2xlVHdvLmNsYXNzTGlzdC5hZGQoXCJub25lXCIpO1xuICAgIGFubm91bmNlbWVudHMuaW5uZXJIVE1MID0gYDxwPjxzdHJvbmc+JHtyb3VuZFdpbm5lcn08L3N0cm9uZz4gJHtvdXRjb21lfSBhbmQgd29uIDxzdHJvbmc+JHt3b25BbW91bnR9IG1hcmJsZXMuPC9zdHJvbmc+PC9wPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGgzPkdhbWUgb3ZlcjwvaDM+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cD4ke3JvdW5kV2lubmVyfSBpcyB0aGUgd2lubmVyPC9wPmA7XG4gIH0gZWxzZSB7XG4gICAgLy9kZWZhdWx0XG4gICAgcmVSZW5kZXJNYXJibGVzKCk7XG4gICAgY2hhbmdlUm9sZXMoKTtcbiAgICByZW5kZXJSb2xlcygpO1xuICAgIGNoYW5nZUFubm91bmNlbWVudCgpO1xuICAgIHBsYWNlQmV0cygpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHJlbmRlclJvbGVzKCkge1xuICByb2xlT25lLmlubmVySFRNTCA9IGAke3BsYXllck9uZS5yb2xlfWA7XG5cbiAgcm9sZVR3by5pbm5lckhUTUwgPSBgJHtwbGF5ZXJUd28ucm9sZX1gO1xufVxuXG5mdW5jdGlvbiBkZWNpZGVSb2xlcygpIHtcbiAgY29uc3QgcmVzdWx0ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMik7XG4gIGlmIChyZXN1bHQgPT09IDApIHtcbiAgICBwbGF5ZXJPbmUucm9sZSA9IFwiaGlkZXJcIjtcbiAgICBwbGF5ZXJUd28ucm9sZSA9IFwiZ3Vlc3NlclwiO1xuICB9IGVsc2Uge1xuICAgIHBsYXllck9uZS5yb2xlID0gXCJndWVzc2VyXCI7XG4gICAgcGxheWVyVHdvLnJvbGUgPSBcImhpZGVyXCI7XG4gIH1cbn1cblxuZnVuY3Rpb24gY2hhbmdlUm9sZXMoKSB7XG4gIGlmIChwbGF5ZXJPbmUuc2NvcmUgPT09IDEpIHtcbiAgICBwbGF5ZXJPbmUucm9sZSA9IFwiZ3Vlc3NlclwiO1xuICAgIHBsYXllclR3by5yb2xlID0gXCJoaWRlclwiO1xuICB9IGVsc2UgaWYgKHBsYXllclR3by5zY29yZSA9PT0gMSkge1xuICAgIHBsYXllck9uZS5yb2xlID0gXCJoaWRlclwiO1xuICAgIHBsYXllclR3by5yb2xlID0gXCJndWVzc2VyXCI7XG4gIH0gZWxzZSBpZiAocGxheWVyT25lLnJvbGUgPT09IFwiaGlkZXJcIikge1xuICAgIHBsYXllck9uZS5yb2xlID0gXCJndWVzc2VyXCI7XG4gICAgcGxheWVyVHdvLnJvbGUgPSBcImhpZGVyXCI7XG4gIH0gZWxzZSBpZiAocGxheWVyT25lLnJvbGUgPT09IFwiZ3Vlc3NlclwiKSB7XG4gICAgcGxheWVyT25lLnJvbGUgPSBcImhpZGVyXCI7XG4gICAgcGxheWVyVHdvLnJvbGUgPSBcImd1ZXNzZXJcIjtcbiAgfVxufVxuXG5mdW5jdGlvbiByZW5kZXJTY29yZSgpIHtcbiAgY29uc3Qgc2NvcmVOdW1iZXJPbmUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2NvcmVOdW1iZXJPbmUnKTtcbiAgc2NvcmVOdW1iZXJPbmUuaW5uZXJIVE1MID0gYCR7cGxheWVyT25lLnNjb3JlfWA7XG5cbiAgY29uc3Qgc2NvcmVOdW1iZXJUd28gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2NvcmVOdW1iZXJUd28nKTtcbiAgc2NvcmVOdW1iZXJUd28uaW5uZXJIVE1MID0gYCR7cGxheWVyVHdvLnNjb3JlfWA7XG59XG5cbmZ1bmN0aW9uIGNoYW5nZUFubm91bmNlbWVudCgpIHtcbiAgc3dpdGNoIChyb3VuZENvdW50KSB7XG4gICAgY2FzZSAxOlxuICAgICAgYW5ub3VuY2VtZW50cy5pbm5lckhUTUwgPSBgPHA+UGxheWVycyBoYXZlIGJlZW4gYXNzaWduZWQgcm9sZXMgcmFuZG9tbHk8L3A+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aDM+Um91bmQgJHtyb3VuZENvdW50fTwvaDM+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cD5NYWtlIHlvdXIgbW92ZXM8L3A+YDtcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICBhbm5vdW5jZW1lbnRzLmlubmVySFRNTCA9IGA8cD48c3Ryb25nPiR7cm91bmRXaW5uZXJ9PC9zdHJvbmc+ICR7b3V0Y29tZX0gYW5kIHdvbiA8c3Ryb25nPiR7d29uQW1vdW50fSBtYXJibGVzLjwvc3Ryb25nPjwvcD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxoMz5Sb3VuZCAke3JvdW5kQ291bnR9PC9oMz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwPk1ha2UgeW91ciBtb3ZlczwvcD5gO1xuICB9XG59XG5cbmZ1bmN0aW9uIHBsYWNlQmV0cygpIHtcbiAgY29uc3Qgc3VibWl0QmV0T25lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzdWJtaXRCZXRPbmVcIik7XG4gIHN1Ym1pdEJldE9uZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgIGNvbnN0IGJldEZpZWxkT25lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJiZXRGaWVsZE9uZVwiKTtcblxuICAgIGlmIChcbiAgICAgIGJldEZpZWxkT25lLnZhbHVlID4gcGxheWVyT25lLnNjb3JlIHx8XG4gICAgICBiZXRGaWVsZE9uZS52YWx1ZSA+IHBsYXllclR3by5zY29yZSB8fFxuICAgICAgYmV0RmllbGRPbmUudmFsdWUgPCAxIHx8XG4gICAgICBpc05hTihiZXRGaWVsZE9uZS52YWx1ZSlcbiAgICApIHtcbiAgICAgIHJldHVybjtcbiAgICB9IGVsc2Uge1xuICAgICAgcGxheWVyT25lLmJldCA9IGJldEZpZWxkT25lLnZhbHVlO1xuICAgIH1cblxuICAgIGNvbnN0IGV2ZW5PbmUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImV2ZW5PbmVcIik7XG4gICAgY29uc3Qgb2RkT25lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvZGRPbmVcIik7XG5cbiAgICBpZiAoZXZlbk9uZS5jaGVja2VkID09PSB0cnVlKSB7XG4gICAgICBwbGF5ZXJPbmUuY2hvaWNlID0gXCJldmVuXCI7XG4gICAgfSBlbHNlIGlmIChvZGRPbmUuY2hlY2tlZCA9PT0gdHJ1ZSkge1xuICAgICAgcGxheWVyT25lLmNob2ljZSA9IFwib2RkXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBiZXRGaWVsZE9uZS52YWx1ZSA9IFwiXCI7XG5cbiAgICBiZXRGb3JtLmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG5cbiAgICBwbGF5ZXJPbmUucmVhZHkgPSB0cnVlO1xuXG5cbiAgICBmdW5jdGlvbiBhaUJldChtaW4sIG1heCkge1xuICAgICAgbWluID0gTWF0aC5jZWlsKG1pbik7XG4gICAgICBtYXggPSBNYXRoLmZsb29yKG1heCk7XG4gICAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbiArIDEpKSArIG1pbjtcbiAgICB9XG5cbiAgICBpZiAocGxheWVyVHdvLnNjb3JlID4gcGxheWVyT25lLnNjb3JlKSB7XG4gICAgICBwbGF5ZXJUd28uYmV0ID0gYWlCZXQoMSwgcGxheWVyT25lLnNjb3JlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcGxheWVyVHdvLmJldCA9IGFpQmV0KDEsIHBsYXllclR3by5zY29yZSlcbiAgICB9XG4gICAgcGxheWVyVHdvLmJldCA9IGFpQmV0KDEsIHBsYXllclR3by5zY29yZSlcblxuICAgIGZ1bmN0aW9uIGFpQ2hvaWNlKCkge1xuICAgICAgbGV0IHJlc3VsdDtcbiAgICAgIGxldCByYW5kb21OdW0gPSBhaUJldCgxLCAyKTtcbiAgICAgIGlmIChyYW5kb21OdW0gPT09IDEpIHtcbiAgICAgICAgcmVzdWx0ID0gJ29kZCc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bHQgPSAnZXZlbic7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgICBwbGF5ZXJUd28uY2hvaWNlID0gYWlDaG9pY2UoKTtcblxuICAgIHBsYXllclR3by5yZWFkeSA9IHRydWU7XG5cbiAgICBpZiAoYm90aFJlYWR5KCkpIHBsYXlSb3VuZCgpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gcmVzb2x2ZVR1cm4oKSB7XG4gIGlmIChwbGF5ZXJPbmUucm9sZSA9PT0gXCJndWVzc2VyXCIpIHtcbiAgICBpZiAocGxheWVyT25lLmNob2ljZSA9PT0gcGxheWVyVHdvLmNob2ljZSkge1xuICAgICAgcGxheWVyT25lLnNjb3JlICs9IE51bWJlcihwbGF5ZXJPbmUuYmV0KTtcbiAgICAgIHBsYXllclR3by5zY29yZSAtPSBOdW1iZXIocGxheWVyT25lLmJldCk7XG4gICAgICByb3VuZFdpbm5lciA9IHBsYXllck9uZS5uYW1lO1xuICAgICAgd29uQW1vdW50ID0gcGxheWVyT25lLmJldDtcbiAgICAgIG91dGNvbWUgPSBcImd1ZXNzZWQgY29ycmVjdGx5XCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBsYXllck9uZS5zY29yZSAtPSBOdW1iZXIocGxheWVyT25lLmJldCk7XG4gICAgICBwbGF5ZXJUd28uc2NvcmUgKz0gTnVtYmVyKHBsYXllck9uZS5iZXQpO1xuICAgICAgcm91bmRXaW5uZXIgPSBwbGF5ZXJUd28ubmFtZTtcbiAgICAgIHdvbkFtb3VudCA9IHBsYXllck9uZS5iZXQ7XG4gICAgICBvdXRjb21lID0gXCJoYXMgbm90IGJlZW4gZmlndXJlZCBvdXRcIjtcbiAgICB9XG4gIH0gZWxzZSBpZiAocGxheWVyT25lLnJvbGUgPT09IFwiaGlkZXJcIikge1xuICAgIGlmIChwbGF5ZXJPbmUuY2hvaWNlID09PSBwbGF5ZXJUd28uY2hvaWNlKSB7XG4gICAgICBwbGF5ZXJPbmUuc2NvcmUgLT0gTnVtYmVyKHBsYXllclR3by5iZXQpO1xuICAgICAgcGxheWVyVHdvLnNjb3JlICs9IE51bWJlcihwbGF5ZXJUd28uYmV0KTtcbiAgICAgIHJvdW5kV2lubmVyID0gcGxheWVyVHdvLm5hbWU7XG4gICAgICB3b25BbW91bnQgPSBwbGF5ZXJUd28uYmV0O1xuICAgICAgb3V0Y29tZSA9IFwiZ3Vlc3NlZCBjb3JyZWN0bHlcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgcGxheWVyT25lLnNjb3JlICs9IE51bWJlcihwbGF5ZXJUd28uYmV0KTtcbiAgICAgIHBsYXllclR3by5zY29yZSAtPSBOdW1iZXIocGxheWVyVHdvLmJldCk7XG4gICAgICByb3VuZFdpbm5lciA9IHBsYXllck9uZS5uYW1lO1xuICAgICAgd29uQW1vdW50ID0gcGxheWVyVHdvLmJldDtcbiAgICAgIG91dGNvbWUgPSBcImhhcyBub3QgYmVlbiBmaWd1cmVkIG91dFwiO1xuICAgIH1cbiAgfVxufVxuXG4vKlxuZnVuY3Rpb24gcmVuZGVyTWFyYmxlcygpIHtcbiAgY29uc3QgbWFyYmxlc09uZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYXJibGVzT25lJyk7XG5cbiAgY29uc3QgbWFyYmxlUGllY2VzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnbWFyYmxlJylcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBtYXJibGVQaWVjZXMubGVuZ3RoOyBpKyspIHtcbiAgICBtYXJibGVQaWVjZXNbaV0uY2xhc3NMaXN0LnJlbW92ZSgnYmlnJyk7XG4gICAgbWFyYmxlUGllY2VzW2ldLmNsYXNzTGlzdC5hZGQoJ3NtYWxsJyk7XG4gIH1cblxuICBzZXRUaW1lb3V0KGNsZWFyKCksIDEwMDApXG5cbiAgZnVuY3Rpb24gY2xlYXIoKSB7XG4gICAgbWFyYmxlc09uZS5pbm5lckhUTUwgPSAnJztcbiAgfVxuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcGxheWVyT25lLnNjb3JlOyBpKyspIHtcbiAgICBjb25zdCBtYXJibGVEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBtYXJibGVEaXYuaW5uZXJIVE1MID0gYDxpbWcgc3JjPVwiLi4vc3JjL2ltYWdlcy9tYXJibGUucG5nXCI+YDtcbiAgICBtYXJibGVEaXYuY2xhc3NMaXN0LmFkZCgnbWFyYmxlJyk7XG4gICAgbWFyYmxlc09uZS5hcHBlbmRDaGlsZChtYXJibGVEaXYpO1xuICB9XG5cbiAgY29uc3QgbWFyYmxlc1R3byA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYXJibGVzVHdvJyk7XG5cbiAgbWFyYmxlc1R3by5pbm5lckhUTUwgPSAnJztcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IHBsYXllclR3by5zY29yZTsgaSsrKSB7XG4gICAgY29uc3QgbWFyYmxlRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgbWFyYmxlRGl2LmlubmVySFRNTCA9IGA8aW1nIHNyYz1cIi4uL3NyYy9pbWFnZXMvbWFyYmxlLnBuZ1wiPmA7XG4gICAgbWFyYmxlRGl2LmNsYXNzTGlzdC5hZGQoJ21hcmJsZScpO1xuICAgIG1hcmJsZXNUd28uYXBwZW5kQ2hpbGQobWFyYmxlRGl2KTtcbiAgfVxuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbWFyYmxlUGllY2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgbWFyYmxlUGllY2VzW2ldLmNsYXNzTGlzdC5yZW1vdmUoJ3NtYWxsJyk7XG4gICAgbWFyYmxlUGllY2VzW2ldLmNsYXNzTGlzdC5hZGQoJ2JpZycpO1xuICB9XG5cbn1cbiovXG5cbmNvbnN0IG1hcmJsZVBpZWNlc09uZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5tYXJibGUub25lJyk7XG5jb25zdCBtYXJibGVQaWVjZXNUd28gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcubWFyYmxlLnR3bycpO1xuXG5mdW5jdGlvbiByZW5kZXJNYXJibGVzKCkge1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHBsYXllck9uZS5zY29yZTsgaSsrKSB7XG4gICAgbWFyYmxlUGllY2VzT25lW2ldLmNsYXNzTGlzdC5yZW1vdmUoJ3NtYWxsJylcbiAgICBtYXJibGVQaWVjZXNPbmVbaV0uY2xhc3NMaXN0LmFkZCgnYmlnJylcbiAgfVxuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcGxheWVyVHdvLnNjb3JlOyBpKyspIHtcbiAgICBtYXJibGVQaWVjZXNUd29baV0uY2xhc3NMaXN0LnJlbW92ZSgnc21hbGwnKVxuICAgIG1hcmJsZVBpZWNlc1R3b1tpXS5jbGFzc0xpc3QuYWRkKCdiaWcnKVxuICB9XG59XG5mdW5jdGlvbiByZVJlbmRlck1hcmJsZXMoKSB7XG4gIGNvbnN0IG1hcmJsZVBpZWNlc09uZUJpZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5tYXJibGUub25lLmJpZycpO1xuXG4gIGlmIChwbGF5ZXJPbmUuc2NvcmUgPiBtYXJibGVQaWVjZXNPbmVCaWcubGVuZ3RoKSB7XG4gICAgbGV0IGRpZmYgPSBwbGF5ZXJPbmUuc2NvcmUgLSBtYXJibGVQaWVjZXNPbmVCaWcubGVuZ3RoO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGlmZjsgaSsrKSB7XG4gICAgICBtYXJibGVQaWVjZXNPbmVbaSArIG1hcmJsZVBpZWNlc09uZUJpZy5sZW5ndGhdLmNsYXNzTGlzdC5yZW1vdmUoJ3NtYWxsJylcbiAgICAgIG1hcmJsZVBpZWNlc09uZVtpICsgbWFyYmxlUGllY2VzT25lQmlnLmxlbmd0aF0uY2xhc3NMaXN0LmFkZCgnYmlnJylcbiAgICB9XG4gIH0gZWxzZSBpZiAocGxheWVyT25lLnNjb3JlIDwgbWFyYmxlUGllY2VzT25lQmlnLmxlbmd0aCkge1xuICAgIGxldCBkaWZmID0gbWFyYmxlUGllY2VzT25lQmlnLmxlbmd0aCAtIHBsYXllck9uZS5zY29yZTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRpZmY7IGkrKykge1xuICAgICAgbWFyYmxlUGllY2VzT25lW2kgKyBwbGF5ZXJPbmUuc2NvcmVdLmNsYXNzTGlzdC5yZW1vdmUoJ2JpZycpXG4gICAgICBtYXJibGVQaWVjZXNPbmVbaSArIHBsYXllck9uZS5zY29yZV0uY2xhc3NMaXN0LmFkZCgnc21hbGwnKVxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IG1hcmJsZVBpZWNlc1R3b0JpZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5tYXJibGUudHdvLmJpZycpO1xuXG4gIGlmIChwbGF5ZXJUd28uc2NvcmUgPiBtYXJibGVQaWVjZXNUd29CaWcubGVuZ3RoKSB7XG4gICAgbGV0IGRpZmYgPSBwbGF5ZXJUd28uc2NvcmUgLSBtYXJibGVQaWVjZXNUd29CaWcubGVuZ3RoO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGlmZjsgaSsrKSB7XG4gICAgICBtYXJibGVQaWVjZXNUd29baSArIG1hcmJsZVBpZWNlc1R3b0JpZy5sZW5ndGhdLmNsYXNzTGlzdC5yZW1vdmUoJ3NtYWxsJylcbiAgICAgIG1hcmJsZVBpZWNlc1R3b1tpICsgbWFyYmxlUGllY2VzVHdvQmlnLmxlbmd0aF0uY2xhc3NMaXN0LmFkZCgnYmlnJylcbiAgICB9XG4gIH0gZWxzZSBpZiAocGxheWVyVHdvLnNjb3JlIDwgbWFyYmxlUGllY2VzVHdvQmlnLmxlbmd0aCkge1xuICAgIGxldCBkaWZmID0gbWFyYmxlUGllY2VzVHdvQmlnLmxlbmd0aCAtIHBsYXllclR3by5zY29yZTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRpZmY7IGkrKykge1xuICAgICAgbWFyYmxlUGllY2VzVHdvW2kgKyBwbGF5ZXJUd28uc2NvcmVdLmNsYXNzTGlzdC5yZW1vdmUoJ2JpZycpXG4gICAgICBtYXJibGVQaWVjZXNUd29baSArIHBsYXllclR3by5zY29yZV0uY2xhc3NMaXN0LmFkZCgnc21hbGwnKVxuICAgIH1cbiAgfVxufVxuXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=