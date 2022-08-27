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
    const newGame = document.createElement('button');
    newGame.innerHTML = 'New Game';
    newGame.classList.add('newGame')
    betForm.appendChild(newGame)
    newGame.addEventListener('click', () => {
      window.location.reload();
    })
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxXQUFXO0FBQ1g7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7Ozs7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKLDBCQUEwQixnQkFBZ0I7QUFDMUM7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHlCQUF5QixlQUFlO0FBQ3hDO0FBQ0EseUJBQXlCLGVBQWU7O0FBRXhDO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRDQUE0QyxZQUFZLFlBQVksU0FBUyxrQkFBa0IsV0FBVztBQUMxRztBQUNBLHNDQUFzQyxhQUFhO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHlCQUF5QixlQUFlOztBQUV4Qyx5QkFBeUIsZUFBZTtBQUN4Qzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZ0NBQWdDLGdCQUFnQjs7QUFFaEQ7QUFDQSxnQ0FBZ0MsZ0JBQWdCO0FBQ2hEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkNBQTZDLFdBQVc7QUFDeEQ7QUFDQTtBQUNBO0FBQ0EsOENBQThDLFlBQVksWUFBWSxTQUFTLGtCQUFrQixXQUFXO0FBQzVHLDZDQUE2QyxXQUFXO0FBQ3hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBLE1BQU07QUFDTjtBQUNBOztBQUVBOztBQUVBOztBQUVBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0Esa0JBQWtCLHlCQUF5QjtBQUMzQztBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBLGtCQUFrQixxQkFBcUI7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQSxrQkFBa0IscUJBQXFCO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsa0JBQWtCLHlCQUF5QjtBQUMzQztBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0Esa0JBQWtCLHFCQUFxQjtBQUN2QztBQUNBO0FBQ0E7O0FBRUEsa0JBQWtCLHFCQUFxQjtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG9CQUFvQixVQUFVO0FBQzlCO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBLG9CQUFvQixVQUFVO0FBQzlCO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxvQkFBb0IsVUFBVTtBQUM5QjtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQSxvQkFBb0IsVUFBVTtBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbWFyYmxlcy1tdWx0aXBsYXllci1kZW1vLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImNvbnN0IFBsYXllciA9IChuYW1lKSA9PiB7XG4gIGxldCBzY29yZSA9IDEwO1xuICBsZXQgYmV0O1xuICBsZXQgcm9sZTtcbiAgbGV0IHJlYWR5ID0gZmFsc2U7XG4gIGxldCBjaG9pY2U7XG5cbiAgcmV0dXJuIHsgbmFtZSwgc2NvcmUsIGJldCwgcm9sZSwgcmVhZHksIGNob2ljZSB9O1xufTtcblxubGV0IHBsYXllck9uZTtcbmxldCBwbGF5ZXJUd287XG5cbmxldCByb3VuZENvdW50ID0gMDtcblxuY29uc3QgYmV0Rm9ybSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdiZXRGb3JtJyk7XG5jb25zdCBtYXJibGVzT25lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21hcmJsZXNPbmUnKTtcblxuY29uc3Qgcm9sZU9uZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyb2xlT25lJyk7XG5jb25zdCByb2xlVHdvID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3JvbGVUd28nKTtcblxuY29uc3QgYW5ub3VuY2VtZW50cyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYW5ub3VuY2VtZW50c1wiKTtcblxuXG5cbmNvbnN0IHN1Ym1pdE5hbWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3VibWl0TmFtZScpO1xuc3VibWl0TmFtZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgY29uc3QgaW5wdXROYW1lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2lucHV0TmFtZScpO1xuICBpZiAoaW5wdXROYW1lLnZhbHVlID09PSBcIlwiKSB7XG4gICAgcGxheWVyT25lID0gUGxheWVyKFwiUGxheWVyIE9uZVwiKTtcbiAgfSBlbHNlIHtcbiAgICBwbGF5ZXJPbmUgPSBQbGF5ZXIoYCR7aW5wdXROYW1lLnZhbHVlfWApO1xuICB9XG4gIHBsYXllck9uZS5yZWFkeSA9IHRydWU7XG5cbiAgcGxheWVyVHdvID0gUGxheWVyKCdBLkkuJylcbiAgcGxheWVyVHdvLnJlYWR5ID0gdHJ1ZTtcblxuICBjb25zdCBnZXROYW1lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dldE5hbWUnKTtcbiAgZ2V0TmFtZS5pbm5lckhUTUwgPSAnJztcblxuICBjb25zdCBwbGF5ZXJUd29EaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGxheWVyVHdvJyk7XG4gIHBsYXllclR3b0Rpdi5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKTtcbiAgXG4gIGNvbnN0IHNjb3JlT25lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Njb3JlT25lJyk7XG4gIHNjb3JlT25lLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpXG5cbiAgY29uc3QgbmFtZU9uZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduYW1lT25lJyk7XG4gIG5hbWVPbmUuaW5uZXJIVE1MID0gYCR7cGxheWVyT25lLm5hbWV9YDtcbiAgY29uc3QgbmFtZVR3byA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduYW1lVHdvJyk7XG4gIG5hbWVUd28uaW5uZXJIVE1MID0gYCR7cGxheWVyVHdvLm5hbWV9YDtcblxuICBpZiAoYm90aFJlYWR5KCkpIHBsYXlSb3VuZCgpO1xufSlcblxuZnVuY3Rpb24gYm90aFJlYWR5KCkge1xuICBpZiAocGxheWVyT25lLnJlYWR5ICYmIHBsYXllclR3by5yZWFkeSkgcGxheVJvdW5kKCk7XG59XG5cbmZ1bmN0aW9uIHBsYXlSb3VuZCgpIHtcbiAgcmVzb2x2ZVR1cm4oKTtcbiAgcm91bmRDb3VudCsrO1xuXG4gIHBsYXllck9uZS5yZWFkeSA9IGZhbHNlO1xuICBwbGF5ZXJUd28ucmVhZHkgPSBmYWxzZTtcblxuICBiZXRGb3JtLmNsYXNzTGlzdC5yZW1vdmUoXCJoaWRkZW5cIik7XG5cbiAgcmVuZGVyU2NvcmUoKTtcblxuICBpZiAocm91bmRDb3VudCA9PT0gMSkge1xuICAgIC8vZmlyc3Qgcm91bmRcbiAgICByZW5kZXJNYXJibGVzKCk7XG4gICAgZGVjaWRlUm9sZXMoKTtcbiAgICByZW5kZXJSb2xlcygpO1xuICAgIGNoYW5nZUFubm91bmNlbWVudCgpO1xuICAgIHBsYWNlQmV0cygpO1xuICB9IGVsc2UgaWYgKHBsYXllck9uZS5zY29yZSA9PT0gMCB8fCBwbGF5ZXJUd28uc2NvcmUgPT09IDApIHtcbiAgICAvL2dhbWUgZW5kc1xuICAgIHJlUmVuZGVyTWFyYmxlcygpO1xuICAgIGJldEZvcm0uY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcbiAgICByb2xlT25lLmNsYXNzTGlzdC5hZGQoXCJub25lXCIpO1xuICAgIHJvbGVUd28uY2xhc3NMaXN0LmFkZChcIm5vbmVcIik7XG4gICAgYW5ub3VuY2VtZW50cy5pbm5lckhUTUwgPSBgPHA+PHN0cm9uZz4ke3JvdW5kV2lubmVyfTwvc3Ryb25nPiAke291dGNvbWV9IGFuZCB3b24gPHN0cm9uZz4ke3dvbkFtb3VudH0gbWFyYmxlcy48L3N0cm9uZz48L3A+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aDM+R2FtZSBvdmVyPC9oMz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwPiR7cm91bmRXaW5uZXJ9IGlzIHRoZSB3aW5uZXI8L3A+YDtcbiAgICBjb25zdCBuZXdHYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgbmV3R2FtZS5pbm5lckhUTUwgPSAnTmV3IEdhbWUnO1xuICAgIG5ld0dhbWUuY2xhc3NMaXN0LmFkZCgnbmV3R2FtZScpXG4gICAgYmV0Rm9ybS5hcHBlbmRDaGlsZChuZXdHYW1lKVxuICAgIG5ld0dhbWUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XG4gICAgfSlcbiAgfSBlbHNlIHtcbiAgICAvL2RlZmF1bHRcbiAgICByZVJlbmRlck1hcmJsZXMoKTtcbiAgICBjaGFuZ2VSb2xlcygpO1xuICAgIHJlbmRlclJvbGVzKCk7XG4gICAgY2hhbmdlQW5ub3VuY2VtZW50KCk7XG4gICAgcGxhY2VCZXRzKCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gcmVuZGVyUm9sZXMoKSB7XG4gIHJvbGVPbmUuaW5uZXJIVE1MID0gYCR7cGxheWVyT25lLnJvbGV9YDtcblxuICByb2xlVHdvLmlubmVySFRNTCA9IGAke3BsYXllclR3by5yb2xlfWA7XG59XG5cbmZ1bmN0aW9uIGRlY2lkZVJvbGVzKCkge1xuICBjb25zdCByZXN1bHQgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyKTtcbiAgaWYgKHJlc3VsdCA9PT0gMCkge1xuICAgIHBsYXllck9uZS5yb2xlID0gXCJoaWRlclwiO1xuICAgIHBsYXllclR3by5yb2xlID0gXCJndWVzc2VyXCI7XG4gIH0gZWxzZSB7XG4gICAgcGxheWVyT25lLnJvbGUgPSBcImd1ZXNzZXJcIjtcbiAgICBwbGF5ZXJUd28ucm9sZSA9IFwiaGlkZXJcIjtcbiAgfVxufVxuXG5mdW5jdGlvbiBjaGFuZ2VSb2xlcygpIHtcbiAgaWYgKHBsYXllck9uZS5zY29yZSA9PT0gMSkge1xuICAgIHBsYXllck9uZS5yb2xlID0gXCJndWVzc2VyXCI7XG4gICAgcGxheWVyVHdvLnJvbGUgPSBcImhpZGVyXCI7XG4gIH0gZWxzZSBpZiAocGxheWVyVHdvLnNjb3JlID09PSAxKSB7XG4gICAgcGxheWVyT25lLnJvbGUgPSBcImhpZGVyXCI7XG4gICAgcGxheWVyVHdvLnJvbGUgPSBcImd1ZXNzZXJcIjtcbiAgfSBlbHNlIGlmIChwbGF5ZXJPbmUucm9sZSA9PT0gXCJoaWRlclwiKSB7XG4gICAgcGxheWVyT25lLnJvbGUgPSBcImd1ZXNzZXJcIjtcbiAgICBwbGF5ZXJUd28ucm9sZSA9IFwiaGlkZXJcIjtcbiAgfSBlbHNlIGlmIChwbGF5ZXJPbmUucm9sZSA9PT0gXCJndWVzc2VyXCIpIHtcbiAgICBwbGF5ZXJPbmUucm9sZSA9IFwiaGlkZXJcIjtcbiAgICBwbGF5ZXJUd28ucm9sZSA9IFwiZ3Vlc3NlclwiO1xuICB9XG59XG5cbmZ1bmN0aW9uIHJlbmRlclNjb3JlKCkge1xuICBjb25zdCBzY29yZU51bWJlck9uZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzY29yZU51bWJlck9uZScpO1xuICBzY29yZU51bWJlck9uZS5pbm5lckhUTUwgPSBgJHtwbGF5ZXJPbmUuc2NvcmV9YDtcblxuICBjb25zdCBzY29yZU51bWJlclR3byA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzY29yZU51bWJlclR3bycpO1xuICBzY29yZU51bWJlclR3by5pbm5lckhUTUwgPSBgJHtwbGF5ZXJUd28uc2NvcmV9YDtcbn1cblxuZnVuY3Rpb24gY2hhbmdlQW5ub3VuY2VtZW50KCkge1xuICBzd2l0Y2ggKHJvdW5kQ291bnQpIHtcbiAgICBjYXNlIDE6XG4gICAgICBhbm5vdW5jZW1lbnRzLmlubmVySFRNTCA9IGA8cD5QbGF5ZXJzIGhhdmUgYmVlbiBhc3NpZ25lZCByb2xlcyByYW5kb21seTwvcD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxoMz5Sb3VuZCAke3JvdW5kQ291bnR9PC9oMz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwPk1ha2UgeW91ciBtb3ZlczwvcD5gO1xuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIGFubm91bmNlbWVudHMuaW5uZXJIVE1MID0gYDxwPjxzdHJvbmc+JHtyb3VuZFdpbm5lcn08L3N0cm9uZz4gJHtvdXRjb21lfSBhbmQgd29uIDxzdHJvbmc+JHt3b25BbW91bnR9IG1hcmJsZXMuPC9zdHJvbmc+PC9wPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGgzPlJvdW5kICR7cm91bmRDb3VudH08L2gzPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHA+TWFrZSB5b3VyIG1vdmVzPC9wPmA7XG4gIH1cbn1cblxuZnVuY3Rpb24gcGxhY2VCZXRzKCkge1xuICBjb25zdCBzdWJtaXRCZXRPbmUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInN1Ym1pdEJldE9uZVwiKTtcbiAgc3VibWl0QmV0T25lLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgY29uc3QgYmV0RmllbGRPbmUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJldEZpZWxkT25lXCIpO1xuXG4gICAgaWYgKFxuICAgICAgYmV0RmllbGRPbmUudmFsdWUgPiBwbGF5ZXJPbmUuc2NvcmUgfHxcbiAgICAgIGJldEZpZWxkT25lLnZhbHVlID4gcGxheWVyVHdvLnNjb3JlIHx8XG4gICAgICBiZXRGaWVsZE9uZS52YWx1ZSA8IDEgfHxcbiAgICAgIGlzTmFOKGJldEZpZWxkT25lLnZhbHVlKVxuICAgICkge1xuICAgICAgcmV0dXJuO1xuICAgIH0gZWxzZSB7XG4gICAgICBwbGF5ZXJPbmUuYmV0ID0gYmV0RmllbGRPbmUudmFsdWU7XG4gICAgfVxuXG4gICAgY29uc3QgZXZlbk9uZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZXZlbk9uZVwiKTtcbiAgICBjb25zdCBvZGRPbmUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm9kZE9uZVwiKTtcblxuICAgIGlmIChldmVuT25lLmNoZWNrZWQgPT09IHRydWUpIHtcbiAgICAgIHBsYXllck9uZS5jaG9pY2UgPSBcImV2ZW5cIjtcbiAgICB9IGVsc2UgaWYgKG9kZE9uZS5jaGVja2VkID09PSB0cnVlKSB7XG4gICAgICBwbGF5ZXJPbmUuY2hvaWNlID0gXCJvZGRcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGJldEZpZWxkT25lLnZhbHVlID0gXCJcIjtcblxuICAgIGJldEZvcm0uY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcblxuICAgIHBsYXllck9uZS5yZWFkeSA9IHRydWU7XG5cblxuICAgIGZ1bmN0aW9uIGFpQmV0KG1pbiwgbWF4KSB7XG4gICAgICBtaW4gPSBNYXRoLmNlaWwobWluKTtcbiAgICAgIG1heCA9IE1hdGguZmxvb3IobWF4KTtcbiAgICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluICsgMSkpICsgbWluO1xuICAgIH1cblxuICAgIGlmIChwbGF5ZXJUd28uc2NvcmUgPiBwbGF5ZXJPbmUuc2NvcmUpIHtcbiAgICAgIHBsYXllclR3by5iZXQgPSBhaUJldCgxLCBwbGF5ZXJPbmUuc2NvcmUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwbGF5ZXJUd28uYmV0ID0gYWlCZXQoMSwgcGxheWVyVHdvLnNjb3JlKVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFpQ2hvaWNlKCkge1xuICAgICAgbGV0IHJlc3VsdDtcbiAgICAgIGxldCByYW5kb21OdW0gPSBhaUJldCgxLCAyKTtcbiAgICAgIGlmIChyYW5kb21OdW0gPT09IDEpIHtcbiAgICAgICAgcmVzdWx0ID0gJ29kZCc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bHQgPSAnZXZlbic7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgICBwbGF5ZXJUd28uY2hvaWNlID0gYWlDaG9pY2UoKTtcblxuICAgIHBsYXllclR3by5yZWFkeSA9IHRydWU7XG5cbiAgICBpZiAoYm90aFJlYWR5KCkpIHBsYXlSb3VuZCgpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gcmVzb2x2ZVR1cm4oKSB7XG4gIGlmIChwbGF5ZXJPbmUucm9sZSA9PT0gXCJndWVzc2VyXCIpIHtcbiAgICBpZiAocGxheWVyT25lLmNob2ljZSA9PT0gcGxheWVyVHdvLmNob2ljZSkge1xuICAgICAgcGxheWVyT25lLnNjb3JlICs9IE51bWJlcihwbGF5ZXJPbmUuYmV0KTtcbiAgICAgIHBsYXllclR3by5zY29yZSAtPSBOdW1iZXIocGxheWVyT25lLmJldCk7XG4gICAgICByb3VuZFdpbm5lciA9IHBsYXllck9uZS5uYW1lO1xuICAgICAgd29uQW1vdW50ID0gcGxheWVyT25lLmJldDtcbiAgICAgIG91dGNvbWUgPSBcImd1ZXNzZWQgY29ycmVjdGx5XCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBsYXllck9uZS5zY29yZSAtPSBOdW1iZXIocGxheWVyT25lLmJldCk7XG4gICAgICBwbGF5ZXJUd28uc2NvcmUgKz0gTnVtYmVyKHBsYXllck9uZS5iZXQpO1xuICAgICAgcm91bmRXaW5uZXIgPSBwbGF5ZXJUd28ubmFtZTtcbiAgICAgIHdvbkFtb3VudCA9IHBsYXllck9uZS5iZXQ7XG4gICAgICBvdXRjb21lID0gXCJoYXMgbm90IGJlZW4gZmlndXJlZCBvdXRcIjtcbiAgICB9XG4gIH0gZWxzZSBpZiAocGxheWVyT25lLnJvbGUgPT09IFwiaGlkZXJcIikge1xuICAgIGlmIChwbGF5ZXJPbmUuY2hvaWNlID09PSBwbGF5ZXJUd28uY2hvaWNlKSB7XG4gICAgICBwbGF5ZXJPbmUuc2NvcmUgLT0gTnVtYmVyKHBsYXllclR3by5iZXQpO1xuICAgICAgcGxheWVyVHdvLnNjb3JlICs9IE51bWJlcihwbGF5ZXJUd28uYmV0KTtcbiAgICAgIHJvdW5kV2lubmVyID0gcGxheWVyVHdvLm5hbWU7XG4gICAgICB3b25BbW91bnQgPSBwbGF5ZXJUd28uYmV0O1xuICAgICAgb3V0Y29tZSA9IFwiZ3Vlc3NlZCBjb3JyZWN0bHlcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgcGxheWVyT25lLnNjb3JlICs9IE51bWJlcihwbGF5ZXJUd28uYmV0KTtcbiAgICAgIHBsYXllclR3by5zY29yZSAtPSBOdW1iZXIocGxheWVyVHdvLmJldCk7XG4gICAgICByb3VuZFdpbm5lciA9IHBsYXllck9uZS5uYW1lO1xuICAgICAgd29uQW1vdW50ID0gcGxheWVyVHdvLmJldDtcbiAgICAgIG91dGNvbWUgPSBcImhhcyBub3QgYmVlbiBmaWd1cmVkIG91dFwiO1xuICAgIH1cbiAgfVxufVxuXG4vKlxuZnVuY3Rpb24gcmVuZGVyTWFyYmxlcygpIHtcbiAgY29uc3QgbWFyYmxlc09uZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYXJibGVzT25lJyk7XG5cbiAgY29uc3QgbWFyYmxlUGllY2VzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnbWFyYmxlJylcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBtYXJibGVQaWVjZXMubGVuZ3RoOyBpKyspIHtcbiAgICBtYXJibGVQaWVjZXNbaV0uY2xhc3NMaXN0LnJlbW92ZSgnYmlnJyk7XG4gICAgbWFyYmxlUGllY2VzW2ldLmNsYXNzTGlzdC5hZGQoJ3NtYWxsJyk7XG4gIH1cblxuICBzZXRUaW1lb3V0KGNsZWFyKCksIDEwMDApXG5cbiAgZnVuY3Rpb24gY2xlYXIoKSB7XG4gICAgbWFyYmxlc09uZS5pbm5lckhUTUwgPSAnJztcbiAgfVxuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcGxheWVyT25lLnNjb3JlOyBpKyspIHtcbiAgICBjb25zdCBtYXJibGVEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBtYXJibGVEaXYuaW5uZXJIVE1MID0gYDxpbWcgc3JjPVwiLi4vc3JjL2ltYWdlcy9tYXJibGUucG5nXCI+YDtcbiAgICBtYXJibGVEaXYuY2xhc3NMaXN0LmFkZCgnbWFyYmxlJyk7XG4gICAgbWFyYmxlc09uZS5hcHBlbmRDaGlsZChtYXJibGVEaXYpO1xuICB9XG5cbiAgY29uc3QgbWFyYmxlc1R3byA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYXJibGVzVHdvJyk7XG5cbiAgbWFyYmxlc1R3by5pbm5lckhUTUwgPSAnJztcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IHBsYXllclR3by5zY29yZTsgaSsrKSB7XG4gICAgY29uc3QgbWFyYmxlRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgbWFyYmxlRGl2LmlubmVySFRNTCA9IGA8aW1nIHNyYz1cIi4uL3NyYy9pbWFnZXMvbWFyYmxlLnBuZ1wiPmA7XG4gICAgbWFyYmxlRGl2LmNsYXNzTGlzdC5hZGQoJ21hcmJsZScpO1xuICAgIG1hcmJsZXNUd28uYXBwZW5kQ2hpbGQobWFyYmxlRGl2KTtcbiAgfVxuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbWFyYmxlUGllY2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgbWFyYmxlUGllY2VzW2ldLmNsYXNzTGlzdC5yZW1vdmUoJ3NtYWxsJyk7XG4gICAgbWFyYmxlUGllY2VzW2ldLmNsYXNzTGlzdC5hZGQoJ2JpZycpO1xuICB9XG5cbn1cbiovXG5cbmNvbnN0IG1hcmJsZVBpZWNlc09uZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5tYXJibGUub25lJyk7XG5jb25zdCBtYXJibGVQaWVjZXNUd28gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcubWFyYmxlLnR3bycpO1xuXG5mdW5jdGlvbiByZW5kZXJNYXJibGVzKCkge1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHBsYXllck9uZS5zY29yZTsgaSsrKSB7XG4gICAgbWFyYmxlUGllY2VzT25lW2ldLmNsYXNzTGlzdC5yZW1vdmUoJ3NtYWxsJylcbiAgICBtYXJibGVQaWVjZXNPbmVbaV0uY2xhc3NMaXN0LmFkZCgnYmlnJylcbiAgfVxuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcGxheWVyVHdvLnNjb3JlOyBpKyspIHtcbiAgICBtYXJibGVQaWVjZXNUd29baV0uY2xhc3NMaXN0LnJlbW92ZSgnc21hbGwnKVxuICAgIG1hcmJsZVBpZWNlc1R3b1tpXS5jbGFzc0xpc3QuYWRkKCdiaWcnKVxuICB9XG59XG5mdW5jdGlvbiByZVJlbmRlck1hcmJsZXMoKSB7XG4gIGNvbnN0IG1hcmJsZVBpZWNlc09uZUJpZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5tYXJibGUub25lLmJpZycpO1xuXG4gIGlmIChwbGF5ZXJPbmUuc2NvcmUgPiBtYXJibGVQaWVjZXNPbmVCaWcubGVuZ3RoKSB7XG4gICAgbGV0IGRpZmYgPSBwbGF5ZXJPbmUuc2NvcmUgLSBtYXJibGVQaWVjZXNPbmVCaWcubGVuZ3RoO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGlmZjsgaSsrKSB7XG4gICAgICBtYXJibGVQaWVjZXNPbmVbaSArIG1hcmJsZVBpZWNlc09uZUJpZy5sZW5ndGhdLmNsYXNzTGlzdC5yZW1vdmUoJ3NtYWxsJylcbiAgICAgIG1hcmJsZVBpZWNlc09uZVtpICsgbWFyYmxlUGllY2VzT25lQmlnLmxlbmd0aF0uY2xhc3NMaXN0LmFkZCgnYmlnJylcbiAgICB9XG4gIH0gZWxzZSBpZiAocGxheWVyT25lLnNjb3JlIDwgbWFyYmxlUGllY2VzT25lQmlnLmxlbmd0aCkge1xuICAgIGxldCBkaWZmID0gbWFyYmxlUGllY2VzT25lQmlnLmxlbmd0aCAtIHBsYXllck9uZS5zY29yZTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRpZmY7IGkrKykge1xuICAgICAgbWFyYmxlUGllY2VzT25lW2kgKyBwbGF5ZXJPbmUuc2NvcmVdLmNsYXNzTGlzdC5yZW1vdmUoJ2JpZycpXG4gICAgICBtYXJibGVQaWVjZXNPbmVbaSArIHBsYXllck9uZS5zY29yZV0uY2xhc3NMaXN0LmFkZCgnc21hbGwnKVxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IG1hcmJsZVBpZWNlc1R3b0JpZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5tYXJibGUudHdvLmJpZycpO1xuXG4gIGlmIChwbGF5ZXJUd28uc2NvcmUgPiBtYXJibGVQaWVjZXNUd29CaWcubGVuZ3RoKSB7XG4gICAgbGV0IGRpZmYgPSBwbGF5ZXJUd28uc2NvcmUgLSBtYXJibGVQaWVjZXNUd29CaWcubGVuZ3RoO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGlmZjsgaSsrKSB7XG4gICAgICBtYXJibGVQaWVjZXNUd29baSArIG1hcmJsZVBpZWNlc1R3b0JpZy5sZW5ndGhdLmNsYXNzTGlzdC5yZW1vdmUoJ3NtYWxsJylcbiAgICAgIG1hcmJsZVBpZWNlc1R3b1tpICsgbWFyYmxlUGllY2VzVHdvQmlnLmxlbmd0aF0uY2xhc3NMaXN0LmFkZCgnYmlnJylcbiAgICB9XG4gIH0gZWxzZSBpZiAocGxheWVyVHdvLnNjb3JlIDwgbWFyYmxlUGllY2VzVHdvQmlnLmxlbmd0aCkge1xuICAgIGxldCBkaWZmID0gbWFyYmxlUGllY2VzVHdvQmlnLmxlbmd0aCAtIHBsYXllclR3by5zY29yZTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRpZmY7IGkrKykge1xuICAgICAgbWFyYmxlUGllY2VzVHdvW2kgKyBwbGF5ZXJUd28uc2NvcmVdLmNsYXNzTGlzdC5yZW1vdmUoJ2JpZycpXG4gICAgICBtYXJibGVQaWVjZXNUd29baSArIHBsYXllclR3by5zY29yZV0uY2xhc3NMaXN0LmFkZCgnc21hbGwnKVxuICAgIH1cbiAgfVxufVxuXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=