/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
let playerOne;
let playerTwo;

let roundCount = 0;

let roundWinner;
let wonAmount;
let outcome;

const getNameOne = document.getElementById("getNameOne");
const getNameTwo = document.getElementById("getNameTwo");
const playerOneDiv = document.querySelector(".player.one");
const playerTwoDiv = document.querySelector(".player.two");
const betOne = document.querySelector(".bet.one");
const betTwo = document.querySelector(".bet.two");
const roleOne = document.querySelector(".role.one");
const roleTwo = document.querySelector(".role.two");
const announcements = document.getElementById("announcements");
const scoreDiv = document.querySelector(".scoreDiv.hidden");

//Player factory
const Player = (name) => {
  let score = 10;
  let bet;
  let role;
  let ready = false;
  let choice;

  return { name, score, bet, role, ready, choice };
};

//init players, remove input fields and show names
const submitNameOne = document.getElementById("submitNameOne");
submitNameOne.addEventListener("click", () => {
  const nameFieldOne = document.getElementById("nameFieldOne");
  if (nameFieldOne.value === "") {
    playerOne = Player("Player One");
  } else {
    playerOne = Player(`${nameFieldOne.value}`);
  }

  playerOne.ready = true;

  getNameOne.innerHTML = "";

  const nameOne = document.querySelector(".name.one");
  nameOne.innerHTML = `${playerOne.name}`;

  if (bothReady()) playRound();
});

const submitNameTwo = document.getElementById("submitNameTwo");
submitNameTwo.addEventListener("click", () => {
  const nameFieldTwo = document.getElementById("nameFieldTwo");
  if (nameFieldTwo.value === "") {
    playerTwo = Player("Player Two");
  } else {
    playerTwo = Player(`${nameFieldTwo.value}`);
  }

  playerTwo.ready = true;

  getNameTwo.innerHTML = "";

  const nameTwo = document.querySelector(".name.two");
  nameTwo.innerHTML = `${playerTwo.name}`;

  if (bothReady()) playRound();
});

function bothReady() {
  if (playerOne.ready && playerTwo.ready) playRound();
}

//game controller
function playRound() {
  resolveTurn();
  roundCount++;

  playerOne.ready = false;
  playerTwo.ready = false;

  betOne.classList.remove("hidden");
  betTwo.classList.remove("hidden");

  if (roundCount === 1) {
    //first round
    betOne.classList.remove("none");
    betTwo.classList.remove("none");

    scoreDiv.classList.remove("hidden");
    renderScore();
    decideRoles();
    renderRoles();
    changeAnnouncement();
    placeBets();
  } else if (playerOne.score === 0 || playerTwo.score === 0) {
    //game ends
    renderScore();
    betOne.classList.add("none");
    betTwo.classList.add("none");
    roleOne.classList.add("none");
    roleTwo.classList.add("none");
    announcements.innerHTML = `<p><strong>${roundWinner}</strong> ${outcome} and won <strong>${wonAmount} marbles.</strong></p>
                                 <h3>Game over</h3>
                                 <p>${roundWinner} is the winner</p>`;
  } else {
    //default
    renderScore();
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
  const scoreOne = document.querySelector(".score.one");
  scoreOne.innerHTML = `${playerOne.score}`;

  const scoreTwo = document.querySelector(".score.two");
  scoreTwo.innerHTML = `${playerTwo.score}`;
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

    betOne.classList.add("hidden");

    playerOne.ready = true;

    if (bothReady()) playRound();
  });

  const submitBetTwo = document.getElementById("submitBetTwo");
  submitBetTwo.addEventListener("click", () => {
    const betFieldTwo = document.getElementById("betFieldTwo");

    if (
      betFieldTwo.value > playerTwo.score ||
      betFieldTwo.value > playerOne.score ||
      betFieldTwo.value < 1 ||
      isNaN(betFieldTwo.value)
    ) {
      return;
    } else {
      playerTwo.bet = betFieldTwo.value;
    }

    const evenTwo = document.getElementById("evenTwo");
    const oddTwo = document.getElementById("oddTwo");

    if (evenTwo.checked === true) {
      playerTwo.choice = "even";
    } else if (oddTwo.checked === true) {
      playerTwo.choice = "odd";
    } else {
      return;
    }

    betFieldTwo.value = "";

    betTwo.classList.add("hidden");

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
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7OztBQUFBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFdBQVc7QUFDWDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0osMEJBQTBCLG1CQUFtQjtBQUM3Qzs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBLHlCQUF5QixlQUFlOztBQUV4QztBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSiwwQkFBMEIsbUJBQW1CO0FBQzdDOztBQUVBOztBQUVBOztBQUVBO0FBQ0EseUJBQXlCLGVBQWU7O0FBRXhDO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0Q0FBNEMsWUFBWSxZQUFZLFNBQVMsa0JBQWtCLFdBQVc7QUFDMUc7QUFDQSxzQ0FBc0MsYUFBYTtBQUNuRCxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHlCQUF5QixlQUFlOztBQUV4Qyx5QkFBeUIsZUFBZTtBQUN4Qzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsMEJBQTBCLGdCQUFnQjs7QUFFMUM7QUFDQSwwQkFBMEIsZ0JBQWdCO0FBQzFDOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkNBQTZDLFdBQVc7QUFDeEQ7QUFDQTtBQUNBO0FBQ0EsOENBQThDLFlBQVksWUFBWSxTQUFTLGtCQUFrQixXQUFXO0FBQzVHLDZDQUE2QyxXQUFXO0FBQ3hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBLE1BQU07QUFDTjtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQSxNQUFNO0FBQ047QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbWFyYmxlcy1tdWx0aXBsYXllci1kZW1vLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImxldCBwbGF5ZXJPbmU7XG5sZXQgcGxheWVyVHdvO1xuXG5sZXQgcm91bmRDb3VudCA9IDA7XG5cbmxldCByb3VuZFdpbm5lcjtcbmxldCB3b25BbW91bnQ7XG5sZXQgb3V0Y29tZTtcblxuY29uc3QgZ2V0TmFtZU9uZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ2V0TmFtZU9uZVwiKTtcbmNvbnN0IGdldE5hbWVUd28gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdldE5hbWVUd29cIik7XG5jb25zdCBwbGF5ZXJPbmVEaXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBsYXllci5vbmVcIik7XG5jb25zdCBwbGF5ZXJUd29EaXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBsYXllci50d29cIik7XG5jb25zdCBiZXRPbmUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmJldC5vbmVcIik7XG5jb25zdCBiZXRUd28gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmJldC50d29cIik7XG5jb25zdCByb2xlT25lID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5yb2xlLm9uZVwiKTtcbmNvbnN0IHJvbGVUd28gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnJvbGUudHdvXCIpO1xuY29uc3QgYW5ub3VuY2VtZW50cyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYW5ub3VuY2VtZW50c1wiKTtcbmNvbnN0IHNjb3JlRGl2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5zY29yZURpdi5oaWRkZW5cIik7XG5cbi8vUGxheWVyIGZhY3RvcnlcbmNvbnN0IFBsYXllciA9IChuYW1lKSA9PiB7XG4gIGxldCBzY29yZSA9IDEwO1xuICBsZXQgYmV0O1xuICBsZXQgcm9sZTtcbiAgbGV0IHJlYWR5ID0gZmFsc2U7XG4gIGxldCBjaG9pY2U7XG5cbiAgcmV0dXJuIHsgbmFtZSwgc2NvcmUsIGJldCwgcm9sZSwgcmVhZHksIGNob2ljZSB9O1xufTtcblxuLy9pbml0IHBsYXllcnMsIHJlbW92ZSBpbnB1dCBmaWVsZHMgYW5kIHNob3cgbmFtZXNcbmNvbnN0IHN1Ym1pdE5hbWVPbmUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInN1Ym1pdE5hbWVPbmVcIik7XG5zdWJtaXROYW1lT25lLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gIGNvbnN0IG5hbWVGaWVsZE9uZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmFtZUZpZWxkT25lXCIpO1xuICBpZiAobmFtZUZpZWxkT25lLnZhbHVlID09PSBcIlwiKSB7XG4gICAgcGxheWVyT25lID0gUGxheWVyKFwiUGxheWVyIE9uZVwiKTtcbiAgfSBlbHNlIHtcbiAgICBwbGF5ZXJPbmUgPSBQbGF5ZXIoYCR7bmFtZUZpZWxkT25lLnZhbHVlfWApO1xuICB9XG5cbiAgcGxheWVyT25lLnJlYWR5ID0gdHJ1ZTtcblxuICBnZXROYW1lT25lLmlubmVySFRNTCA9IFwiXCI7XG5cbiAgY29uc3QgbmFtZU9uZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubmFtZS5vbmVcIik7XG4gIG5hbWVPbmUuaW5uZXJIVE1MID0gYCR7cGxheWVyT25lLm5hbWV9YDtcblxuICBpZiAoYm90aFJlYWR5KCkpIHBsYXlSb3VuZCgpO1xufSk7XG5cbmNvbnN0IHN1Ym1pdE5hbWVUd28gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInN1Ym1pdE5hbWVUd29cIik7XG5zdWJtaXROYW1lVHdvLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gIGNvbnN0IG5hbWVGaWVsZFR3byA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmFtZUZpZWxkVHdvXCIpO1xuICBpZiAobmFtZUZpZWxkVHdvLnZhbHVlID09PSBcIlwiKSB7XG4gICAgcGxheWVyVHdvID0gUGxheWVyKFwiUGxheWVyIFR3b1wiKTtcbiAgfSBlbHNlIHtcbiAgICBwbGF5ZXJUd28gPSBQbGF5ZXIoYCR7bmFtZUZpZWxkVHdvLnZhbHVlfWApO1xuICB9XG5cbiAgcGxheWVyVHdvLnJlYWR5ID0gdHJ1ZTtcblxuICBnZXROYW1lVHdvLmlubmVySFRNTCA9IFwiXCI7XG5cbiAgY29uc3QgbmFtZVR3byA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubmFtZS50d29cIik7XG4gIG5hbWVUd28uaW5uZXJIVE1MID0gYCR7cGxheWVyVHdvLm5hbWV9YDtcblxuICBpZiAoYm90aFJlYWR5KCkpIHBsYXlSb3VuZCgpO1xufSk7XG5cbmZ1bmN0aW9uIGJvdGhSZWFkeSgpIHtcbiAgaWYgKHBsYXllck9uZS5yZWFkeSAmJiBwbGF5ZXJUd28ucmVhZHkpIHBsYXlSb3VuZCgpO1xufVxuXG4vL2dhbWUgY29udHJvbGxlclxuZnVuY3Rpb24gcGxheVJvdW5kKCkge1xuICByZXNvbHZlVHVybigpO1xuICByb3VuZENvdW50Kys7XG5cbiAgcGxheWVyT25lLnJlYWR5ID0gZmFsc2U7XG4gIHBsYXllclR3by5yZWFkeSA9IGZhbHNlO1xuXG4gIGJldE9uZS5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZGVuXCIpO1xuICBiZXRUd28uY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKTtcblxuICBpZiAocm91bmRDb3VudCA9PT0gMSkge1xuICAgIC8vZmlyc3Qgcm91bmRcbiAgICBiZXRPbmUuY2xhc3NMaXN0LnJlbW92ZShcIm5vbmVcIik7XG4gICAgYmV0VHdvLmNsYXNzTGlzdC5yZW1vdmUoXCJub25lXCIpO1xuXG4gICAgc2NvcmVEaXYuY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKTtcbiAgICByZW5kZXJTY29yZSgpO1xuICAgIGRlY2lkZVJvbGVzKCk7XG4gICAgcmVuZGVyUm9sZXMoKTtcbiAgICBjaGFuZ2VBbm5vdW5jZW1lbnQoKTtcbiAgICBwbGFjZUJldHMoKTtcbiAgfSBlbHNlIGlmIChwbGF5ZXJPbmUuc2NvcmUgPT09IDAgfHwgcGxheWVyVHdvLnNjb3JlID09PSAwKSB7XG4gICAgLy9nYW1lIGVuZHNcbiAgICByZW5kZXJTY29yZSgpO1xuICAgIGJldE9uZS5jbGFzc0xpc3QuYWRkKFwibm9uZVwiKTtcbiAgICBiZXRUd28uY2xhc3NMaXN0LmFkZChcIm5vbmVcIik7XG4gICAgcm9sZU9uZS5jbGFzc0xpc3QuYWRkKFwibm9uZVwiKTtcbiAgICByb2xlVHdvLmNsYXNzTGlzdC5hZGQoXCJub25lXCIpO1xuICAgIGFubm91bmNlbWVudHMuaW5uZXJIVE1MID0gYDxwPjxzdHJvbmc+JHtyb3VuZFdpbm5lcn08L3N0cm9uZz4gJHtvdXRjb21lfSBhbmQgd29uIDxzdHJvbmc+JHt3b25BbW91bnR9IG1hcmJsZXMuPC9zdHJvbmc+PC9wPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGgzPkdhbWUgb3ZlcjwvaDM+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cD4ke3JvdW5kV2lubmVyfSBpcyB0aGUgd2lubmVyPC9wPmA7XG4gIH0gZWxzZSB7XG4gICAgLy9kZWZhdWx0XG4gICAgcmVuZGVyU2NvcmUoKTtcbiAgICBjaGFuZ2VSb2xlcygpO1xuICAgIHJlbmRlclJvbGVzKCk7XG4gICAgY2hhbmdlQW5ub3VuY2VtZW50KCk7XG4gICAgcGxhY2VCZXRzKCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gcmVuZGVyUm9sZXMoKSB7XG4gIHJvbGVPbmUuaW5uZXJIVE1MID0gYCR7cGxheWVyT25lLnJvbGV9YDtcblxuICByb2xlVHdvLmlubmVySFRNTCA9IGAke3BsYXllclR3by5yb2xlfWA7XG59XG5cbmZ1bmN0aW9uIGRlY2lkZVJvbGVzKCkge1xuICBjb25zdCByZXN1bHQgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyKTtcbiAgaWYgKHJlc3VsdCA9PT0gMCkge1xuICAgIHBsYXllck9uZS5yb2xlID0gXCJoaWRlclwiO1xuICAgIHBsYXllclR3by5yb2xlID0gXCJndWVzc2VyXCI7XG4gIH0gZWxzZSB7XG4gICAgcGxheWVyT25lLnJvbGUgPSBcImd1ZXNzZXJcIjtcbiAgICBwbGF5ZXJUd28ucm9sZSA9IFwiaGlkZXJcIjtcbiAgfVxufVxuXG5mdW5jdGlvbiBjaGFuZ2VSb2xlcygpIHtcbiAgaWYgKHBsYXllck9uZS5zY29yZSA9PT0gMSkge1xuICAgIHBsYXllck9uZS5yb2xlID0gXCJndWVzc2VyXCI7XG4gICAgcGxheWVyVHdvLnJvbGUgPSBcImhpZGVyXCI7XG4gIH0gZWxzZSBpZiAocGxheWVyVHdvLnNjb3JlID09PSAxKSB7XG4gICAgcGxheWVyT25lLnJvbGUgPSBcImhpZGVyXCI7XG4gICAgcGxheWVyVHdvLnJvbGUgPSBcImd1ZXNzZXJcIjtcbiAgfSBlbHNlIGlmIChwbGF5ZXJPbmUucm9sZSA9PT0gXCJoaWRlclwiKSB7XG4gICAgcGxheWVyT25lLnJvbGUgPSBcImd1ZXNzZXJcIjtcbiAgICBwbGF5ZXJUd28ucm9sZSA9IFwiaGlkZXJcIjtcbiAgfSBlbHNlIGlmIChwbGF5ZXJPbmUucm9sZSA9PT0gXCJndWVzc2VyXCIpIHtcbiAgICBwbGF5ZXJPbmUucm9sZSA9IFwiaGlkZXJcIjtcbiAgICBwbGF5ZXJUd28ucm9sZSA9IFwiZ3Vlc3NlclwiO1xuICB9XG59XG5cbmZ1bmN0aW9uIHJlbmRlclNjb3JlKCkge1xuICBjb25zdCBzY29yZU9uZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc2NvcmUub25lXCIpO1xuICBzY29yZU9uZS5pbm5lckhUTUwgPSBgJHtwbGF5ZXJPbmUuc2NvcmV9YDtcblxuICBjb25zdCBzY29yZVR3byA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc2NvcmUudHdvXCIpO1xuICBzY29yZVR3by5pbm5lckhUTUwgPSBgJHtwbGF5ZXJUd28uc2NvcmV9YDtcbn1cblxuZnVuY3Rpb24gY2hhbmdlQW5ub3VuY2VtZW50KCkge1xuICBzd2l0Y2ggKHJvdW5kQ291bnQpIHtcbiAgICBjYXNlIDE6XG4gICAgICBhbm5vdW5jZW1lbnRzLmlubmVySFRNTCA9IGA8cD5QbGF5ZXJzIGhhdmUgYmVlbiBhc3NpZ25lZCByb2xlcyByYW5kb21seTwvcD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxoMz5Sb3VuZCAke3JvdW5kQ291bnR9PC9oMz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwPk1ha2UgeW91ciBtb3ZlczwvcD5gO1xuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIGFubm91bmNlbWVudHMuaW5uZXJIVE1MID0gYDxwPjxzdHJvbmc+JHtyb3VuZFdpbm5lcn08L3N0cm9uZz4gJHtvdXRjb21lfSBhbmQgd29uIDxzdHJvbmc+JHt3b25BbW91bnR9IG1hcmJsZXMuPC9zdHJvbmc+PC9wPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGgzPlJvdW5kICR7cm91bmRDb3VudH08L2gzPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHA+TWFrZSB5b3VyIG1vdmVzPC9wPmA7XG4gIH1cbn1cblxuZnVuY3Rpb24gcGxhY2VCZXRzKCkge1xuICBjb25zdCBzdWJtaXRCZXRPbmUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInN1Ym1pdEJldE9uZVwiKTtcbiAgc3VibWl0QmV0T25lLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgY29uc3QgYmV0RmllbGRPbmUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJldEZpZWxkT25lXCIpO1xuXG4gICAgaWYgKFxuICAgICAgYmV0RmllbGRPbmUudmFsdWUgPiBwbGF5ZXJPbmUuc2NvcmUgfHxcbiAgICAgIGJldEZpZWxkT25lLnZhbHVlID4gcGxheWVyVHdvLnNjb3JlIHx8XG4gICAgICBiZXRGaWVsZE9uZS52YWx1ZSA8IDEgfHxcbiAgICAgIGlzTmFOKGJldEZpZWxkT25lLnZhbHVlKVxuICAgICkge1xuICAgICAgcmV0dXJuO1xuICAgIH0gZWxzZSB7XG4gICAgICBwbGF5ZXJPbmUuYmV0ID0gYmV0RmllbGRPbmUudmFsdWU7XG4gICAgfVxuXG4gICAgY29uc3QgZXZlbk9uZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZXZlbk9uZVwiKTtcbiAgICBjb25zdCBvZGRPbmUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm9kZE9uZVwiKTtcblxuICAgIGlmIChldmVuT25lLmNoZWNrZWQgPT09IHRydWUpIHtcbiAgICAgIHBsYXllck9uZS5jaG9pY2UgPSBcImV2ZW5cIjtcbiAgICB9IGVsc2UgaWYgKG9kZE9uZS5jaGVja2VkID09PSB0cnVlKSB7XG4gICAgICBwbGF5ZXJPbmUuY2hvaWNlID0gXCJvZGRcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGJldEZpZWxkT25lLnZhbHVlID0gXCJcIjtcblxuICAgIGJldE9uZS5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xuXG4gICAgcGxheWVyT25lLnJlYWR5ID0gdHJ1ZTtcblxuICAgIGlmIChib3RoUmVhZHkoKSkgcGxheVJvdW5kKCk7XG4gIH0pO1xuXG4gIGNvbnN0IHN1Ym1pdEJldFR3byA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3VibWl0QmV0VHdvXCIpO1xuICBzdWJtaXRCZXRUd28uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICBjb25zdCBiZXRGaWVsZFR3byA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmV0RmllbGRUd29cIik7XG5cbiAgICBpZiAoXG4gICAgICBiZXRGaWVsZFR3by52YWx1ZSA+IHBsYXllclR3by5zY29yZSB8fFxuICAgICAgYmV0RmllbGRUd28udmFsdWUgPiBwbGF5ZXJPbmUuc2NvcmUgfHxcbiAgICAgIGJldEZpZWxkVHdvLnZhbHVlIDwgMSB8fFxuICAgICAgaXNOYU4oYmV0RmllbGRUd28udmFsdWUpXG4gICAgKSB7XG4gICAgICByZXR1cm47XG4gICAgfSBlbHNlIHtcbiAgICAgIHBsYXllclR3by5iZXQgPSBiZXRGaWVsZFR3by52YWx1ZTtcbiAgICB9XG5cbiAgICBjb25zdCBldmVuVHdvID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJldmVuVHdvXCIpO1xuICAgIGNvbnN0IG9kZFR3byA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib2RkVHdvXCIpO1xuXG4gICAgaWYgKGV2ZW5Ud28uY2hlY2tlZCA9PT0gdHJ1ZSkge1xuICAgICAgcGxheWVyVHdvLmNob2ljZSA9IFwiZXZlblwiO1xuICAgIH0gZWxzZSBpZiAob2RkVHdvLmNoZWNrZWQgPT09IHRydWUpIHtcbiAgICAgIHBsYXllclR3by5jaG9pY2UgPSBcIm9kZFwiO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgYmV0RmllbGRUd28udmFsdWUgPSBcIlwiO1xuXG4gICAgYmV0VHdvLmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG5cbiAgICBwbGF5ZXJUd28ucmVhZHkgPSB0cnVlO1xuXG4gICAgaWYgKGJvdGhSZWFkeSgpKSBwbGF5Um91bmQoKTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHJlc29sdmVUdXJuKCkge1xuICBpZiAocGxheWVyT25lLnJvbGUgPT09IFwiZ3Vlc3NlclwiKSB7XG4gICAgaWYgKHBsYXllck9uZS5jaG9pY2UgPT09IHBsYXllclR3by5jaG9pY2UpIHtcbiAgICAgIHBsYXllck9uZS5zY29yZSArPSBOdW1iZXIocGxheWVyT25lLmJldCk7XG4gICAgICBwbGF5ZXJUd28uc2NvcmUgLT0gTnVtYmVyKHBsYXllck9uZS5iZXQpO1xuICAgICAgcm91bmRXaW5uZXIgPSBwbGF5ZXJPbmUubmFtZTtcbiAgICAgIHdvbkFtb3VudCA9IHBsYXllck9uZS5iZXQ7XG4gICAgICBvdXRjb21lID0gXCJndWVzc2VkIGNvcnJlY3RseVwiO1xuICAgIH0gZWxzZSB7XG4gICAgICBwbGF5ZXJPbmUuc2NvcmUgLT0gTnVtYmVyKHBsYXllck9uZS5iZXQpO1xuICAgICAgcGxheWVyVHdvLnNjb3JlICs9IE51bWJlcihwbGF5ZXJPbmUuYmV0KTtcbiAgICAgIHJvdW5kV2lubmVyID0gcGxheWVyVHdvLm5hbWU7XG4gICAgICB3b25BbW91bnQgPSBwbGF5ZXJPbmUuYmV0O1xuICAgICAgb3V0Y29tZSA9IFwiaGFzIG5vdCBiZWVuIGZpZ3VyZWQgb3V0XCI7XG4gICAgfVxuICB9IGVsc2UgaWYgKHBsYXllck9uZS5yb2xlID09PSBcImhpZGVyXCIpIHtcbiAgICBpZiAocGxheWVyT25lLmNob2ljZSA9PT0gcGxheWVyVHdvLmNob2ljZSkge1xuICAgICAgcGxheWVyT25lLnNjb3JlIC09IE51bWJlcihwbGF5ZXJUd28uYmV0KTtcbiAgICAgIHBsYXllclR3by5zY29yZSArPSBOdW1iZXIocGxheWVyVHdvLmJldCk7XG4gICAgICByb3VuZFdpbm5lciA9IHBsYXllclR3by5uYW1lO1xuICAgICAgd29uQW1vdW50ID0gcGxheWVyVHdvLmJldDtcbiAgICAgIG91dGNvbWUgPSBcImd1ZXNzZWQgY29ycmVjdGx5XCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBsYXllck9uZS5zY29yZSArPSBOdW1iZXIocGxheWVyVHdvLmJldCk7XG4gICAgICBwbGF5ZXJUd28uc2NvcmUgLT0gTnVtYmVyKHBsYXllclR3by5iZXQpO1xuICAgICAgcm91bmRXaW5uZXIgPSBwbGF5ZXJPbmUubmFtZTtcbiAgICAgIHdvbkFtb3VudCA9IHBsYXllclR3by5iZXQ7XG4gICAgICBvdXRjb21lID0gXCJoYXMgbm90IGJlZW4gZmlndXJlZCBvdXRcIjtcbiAgICB9XG4gIH1cbn0iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=