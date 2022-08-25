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
    const unevenOne = document.getElementById("unevenOne");

    if (evenOne.checked === true) {
      playerOne.choice = "even";
    } else if (unevenOne.checked === true) {
      playerOne.choice = "uneven";
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
    const unevenTwo = document.getElementById("unevenTwo");

    if (evenTwo.checked === true) {
      playerTwo.choice = "even";
    } else if (unevenTwo.checked === true) {
      playerTwo.choice = "uneven";
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7OztBQUFBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFdBQVc7QUFDWDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0osMEJBQTBCLG1CQUFtQjtBQUM3Qzs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBLHlCQUF5QixlQUFlOztBQUV4QztBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSiwwQkFBMEIsbUJBQW1CO0FBQzdDOztBQUVBOztBQUVBOztBQUVBO0FBQ0EseUJBQXlCLGVBQWU7O0FBRXhDO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0Q0FBNEMsWUFBWSxZQUFZLFNBQVMsa0JBQWtCLFdBQVc7QUFDMUc7QUFDQSxzQ0FBc0MsYUFBYTtBQUNuRCxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHlCQUF5QixlQUFlOztBQUV4Qyx5QkFBeUIsZUFBZTtBQUN4Qzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsMEJBQTBCLGdCQUFnQjs7QUFFMUM7QUFDQSwwQkFBMEIsZ0JBQWdCO0FBQzFDOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkNBQTZDLFdBQVc7QUFDeEQ7QUFDQTtBQUNBO0FBQ0EsOENBQThDLFlBQVksWUFBWSxTQUFTLGtCQUFrQixXQUFXO0FBQzVHLDZDQUE2QyxXQUFXO0FBQ3hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBLE1BQU07QUFDTjtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQSxNQUFNO0FBQ047QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL21hcmJsZXMtbXVsdGlwbGF5ZXItZGVtby8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJsZXQgcGxheWVyT25lO1xubGV0IHBsYXllclR3bztcblxubGV0IHJvdW5kQ291bnQgPSAwO1xuXG5sZXQgcm91bmRXaW5uZXI7XG5sZXQgd29uQW1vdW50O1xubGV0IG91dGNvbWU7XG5cbmNvbnN0IGdldE5hbWVPbmUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdldE5hbWVPbmVcIik7XG5jb25zdCBnZXROYW1lVHdvID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnZXROYW1lVHdvXCIpO1xuY29uc3QgcGxheWVyT25lRGl2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wbGF5ZXIub25lXCIpO1xuY29uc3QgcGxheWVyVHdvRGl2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wbGF5ZXIudHdvXCIpO1xuY29uc3QgYmV0T25lID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5iZXQub25lXCIpO1xuY29uc3QgYmV0VHdvID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5iZXQudHdvXCIpO1xuY29uc3Qgcm9sZU9uZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucm9sZS5vbmVcIik7XG5jb25zdCByb2xlVHdvID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5yb2xlLnR3b1wiKTtcbmNvbnN0IGFubm91bmNlbWVudHMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFubm91bmNlbWVudHNcIik7XG5jb25zdCBzY29yZURpdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc2NvcmVEaXYuaGlkZGVuXCIpO1xuXG4vL1BsYXllciBmYWN0b3J5XG5jb25zdCBQbGF5ZXIgPSAobmFtZSkgPT4ge1xuICBsZXQgc2NvcmUgPSAxMDtcbiAgbGV0IGJldDtcbiAgbGV0IHJvbGU7XG4gIGxldCByZWFkeSA9IGZhbHNlO1xuICBsZXQgY2hvaWNlO1xuXG4gIHJldHVybiB7IG5hbWUsIHNjb3JlLCBiZXQsIHJvbGUsIHJlYWR5LCBjaG9pY2UgfTtcbn07XG5cbi8vaW5pdCBwbGF5ZXJzLCByZW1vdmUgaW5wdXQgZmllbGRzIGFuZCBzaG93IG5hbWVzXG5jb25zdCBzdWJtaXROYW1lT25lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzdWJtaXROYW1lT25lXCIpO1xuc3VibWl0TmFtZU9uZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICBjb25zdCBuYW1lRmllbGRPbmUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5hbWVGaWVsZE9uZVwiKTtcbiAgaWYgKG5hbWVGaWVsZE9uZS52YWx1ZSA9PT0gXCJcIikge1xuICAgIHBsYXllck9uZSA9IFBsYXllcihcIlBsYXllciBPbmVcIik7XG4gIH0gZWxzZSB7XG4gICAgcGxheWVyT25lID0gUGxheWVyKGAke25hbWVGaWVsZE9uZS52YWx1ZX1gKTtcbiAgfVxuXG4gIHBsYXllck9uZS5yZWFkeSA9IHRydWU7XG5cbiAgZ2V0TmFtZU9uZS5pbm5lckhUTUwgPSBcIlwiO1xuXG4gIGNvbnN0IG5hbWVPbmUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLm5hbWUub25lXCIpO1xuICBuYW1lT25lLmlubmVySFRNTCA9IGAke3BsYXllck9uZS5uYW1lfWA7XG5cbiAgaWYgKGJvdGhSZWFkeSgpKSBwbGF5Um91bmQoKTtcbn0pO1xuXG5jb25zdCBzdWJtaXROYW1lVHdvID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzdWJtaXROYW1lVHdvXCIpO1xuc3VibWl0TmFtZVR3by5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICBjb25zdCBuYW1lRmllbGRUd28gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5hbWVGaWVsZFR3b1wiKTtcbiAgaWYgKG5hbWVGaWVsZFR3by52YWx1ZSA9PT0gXCJcIikge1xuICAgIHBsYXllclR3byA9IFBsYXllcihcIlBsYXllciBUd29cIik7XG4gIH0gZWxzZSB7XG4gICAgcGxheWVyVHdvID0gUGxheWVyKGAke25hbWVGaWVsZFR3by52YWx1ZX1gKTtcbiAgfVxuXG4gIHBsYXllclR3by5yZWFkeSA9IHRydWU7XG5cbiAgZ2V0TmFtZVR3by5pbm5lckhUTUwgPSBcIlwiO1xuXG4gIGNvbnN0IG5hbWVUd28gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLm5hbWUudHdvXCIpO1xuICBuYW1lVHdvLmlubmVySFRNTCA9IGAke3BsYXllclR3by5uYW1lfWA7XG5cbiAgaWYgKGJvdGhSZWFkeSgpKSBwbGF5Um91bmQoKTtcbn0pO1xuXG5mdW5jdGlvbiBib3RoUmVhZHkoKSB7XG4gIGlmIChwbGF5ZXJPbmUucmVhZHkgJiYgcGxheWVyVHdvLnJlYWR5KSBwbGF5Um91bmQoKTtcbn1cblxuLy9nYW1lIGNvbnRyb2xsZXJcbmZ1bmN0aW9uIHBsYXlSb3VuZCgpIHtcbiAgcmVzb2x2ZVR1cm4oKTtcbiAgcm91bmRDb3VudCsrO1xuXG4gIHBsYXllck9uZS5yZWFkeSA9IGZhbHNlO1xuICBwbGF5ZXJUd28ucmVhZHkgPSBmYWxzZTtcblxuICBiZXRPbmUuY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKTtcbiAgYmV0VHdvLmNsYXNzTGlzdC5yZW1vdmUoXCJoaWRkZW5cIik7XG5cbiAgaWYgKHJvdW5kQ291bnQgPT09IDEpIHtcbiAgICAvL2ZpcnN0IHJvdW5kXG4gICAgYmV0T25lLmNsYXNzTGlzdC5yZW1vdmUoXCJub25lXCIpO1xuICAgIGJldFR3by5jbGFzc0xpc3QucmVtb3ZlKFwibm9uZVwiKTtcblxuICAgIHNjb3JlRGl2LmNsYXNzTGlzdC5yZW1vdmUoXCJoaWRkZW5cIik7XG4gICAgcmVuZGVyU2NvcmUoKTtcbiAgICBkZWNpZGVSb2xlcygpO1xuICAgIHJlbmRlclJvbGVzKCk7XG4gICAgY2hhbmdlQW5ub3VuY2VtZW50KCk7XG4gICAgcGxhY2VCZXRzKCk7XG4gIH0gZWxzZSBpZiAocGxheWVyT25lLnNjb3JlID09PSAwIHx8IHBsYXllclR3by5zY29yZSA9PT0gMCkge1xuICAgIC8vZ2FtZSBlbmRzXG4gICAgcmVuZGVyU2NvcmUoKTtcbiAgICBiZXRPbmUuY2xhc3NMaXN0LmFkZChcIm5vbmVcIik7XG4gICAgYmV0VHdvLmNsYXNzTGlzdC5hZGQoXCJub25lXCIpO1xuICAgIHJvbGVPbmUuY2xhc3NMaXN0LmFkZChcIm5vbmVcIik7XG4gICAgcm9sZVR3by5jbGFzc0xpc3QuYWRkKFwibm9uZVwiKTtcbiAgICBhbm5vdW5jZW1lbnRzLmlubmVySFRNTCA9IGA8cD48c3Ryb25nPiR7cm91bmRXaW5uZXJ9PC9zdHJvbmc+ICR7b3V0Y29tZX0gYW5kIHdvbiA8c3Ryb25nPiR7d29uQW1vdW50fSBtYXJibGVzLjwvc3Ryb25nPjwvcD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxoMz5HYW1lIG92ZXI8L2gzPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHA+JHtyb3VuZFdpbm5lcn0gaXMgdGhlIHdpbm5lcjwvcD5gO1xuICB9IGVsc2Uge1xuICAgIC8vZGVmYXVsdFxuICAgIHJlbmRlclNjb3JlKCk7XG4gICAgY2hhbmdlUm9sZXMoKTtcbiAgICByZW5kZXJSb2xlcygpO1xuICAgIGNoYW5nZUFubm91bmNlbWVudCgpO1xuICAgIHBsYWNlQmV0cygpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHJlbmRlclJvbGVzKCkge1xuICByb2xlT25lLmlubmVySFRNTCA9IGAke3BsYXllck9uZS5yb2xlfWA7XG5cbiAgcm9sZVR3by5pbm5lckhUTUwgPSBgJHtwbGF5ZXJUd28ucm9sZX1gO1xufVxuXG5mdW5jdGlvbiBkZWNpZGVSb2xlcygpIHtcbiAgY29uc3QgcmVzdWx0ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMik7XG4gIGlmIChyZXN1bHQgPT09IDApIHtcbiAgICBwbGF5ZXJPbmUucm9sZSA9IFwiaGlkZXJcIjtcbiAgICBwbGF5ZXJUd28ucm9sZSA9IFwiZ3Vlc3NlclwiO1xuICB9IGVsc2Uge1xuICAgIHBsYXllck9uZS5yb2xlID0gXCJndWVzc2VyXCI7XG4gICAgcGxheWVyVHdvLnJvbGUgPSBcImhpZGVyXCI7XG4gIH1cbn1cblxuZnVuY3Rpb24gY2hhbmdlUm9sZXMoKSB7XG4gIGlmIChwbGF5ZXJPbmUuc2NvcmUgPT09IDEpIHtcbiAgICBwbGF5ZXJPbmUucm9sZSA9IFwiZ3Vlc3NlclwiO1xuICAgIHBsYXllclR3by5yb2xlID0gXCJoaWRlclwiO1xuICB9IGVsc2UgaWYgKHBsYXllclR3by5zY29yZSA9PT0gMSkge1xuICAgIHBsYXllck9uZS5yb2xlID0gXCJoaWRlclwiO1xuICAgIHBsYXllclR3by5yb2xlID0gXCJndWVzc2VyXCI7XG4gIH0gZWxzZSBpZiAocGxheWVyT25lLnJvbGUgPT09IFwiaGlkZXJcIikge1xuICAgIHBsYXllck9uZS5yb2xlID0gXCJndWVzc2VyXCI7XG4gICAgcGxheWVyVHdvLnJvbGUgPSBcImhpZGVyXCI7XG4gIH0gZWxzZSBpZiAocGxheWVyT25lLnJvbGUgPT09IFwiZ3Vlc3NlclwiKSB7XG4gICAgcGxheWVyT25lLnJvbGUgPSBcImhpZGVyXCI7XG4gICAgcGxheWVyVHdvLnJvbGUgPSBcImd1ZXNzZXJcIjtcbiAgfVxufVxuXG5mdW5jdGlvbiByZW5kZXJTY29yZSgpIHtcbiAgY29uc3Qgc2NvcmVPbmUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnNjb3JlLm9uZVwiKTtcbiAgc2NvcmVPbmUuaW5uZXJIVE1MID0gYCR7cGxheWVyT25lLnNjb3JlfWA7XG5cbiAgY29uc3Qgc2NvcmVUd28gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnNjb3JlLnR3b1wiKTtcbiAgc2NvcmVUd28uaW5uZXJIVE1MID0gYCR7cGxheWVyVHdvLnNjb3JlfWA7XG59XG5cbmZ1bmN0aW9uIGNoYW5nZUFubm91bmNlbWVudCgpIHtcbiAgc3dpdGNoIChyb3VuZENvdW50KSB7XG4gICAgY2FzZSAxOlxuICAgICAgYW5ub3VuY2VtZW50cy5pbm5lckhUTUwgPSBgPHA+UGxheWVycyBoYXZlIGJlZW4gYXNzaWduZWQgcm9sZXMgcmFuZG9tbHk8L3A+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aDM+Um91bmQgJHtyb3VuZENvdW50fTwvaDM+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cD5NYWtlIHlvdXIgbW92ZXM8L3A+YDtcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICBhbm5vdW5jZW1lbnRzLmlubmVySFRNTCA9IGA8cD48c3Ryb25nPiR7cm91bmRXaW5uZXJ9PC9zdHJvbmc+ICR7b3V0Y29tZX0gYW5kIHdvbiA8c3Ryb25nPiR7d29uQW1vdW50fSBtYXJibGVzLjwvc3Ryb25nPjwvcD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxoMz5Sb3VuZCAke3JvdW5kQ291bnR9PC9oMz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwPk1ha2UgeW91ciBtb3ZlczwvcD5gO1xuICB9XG59XG5cbmZ1bmN0aW9uIHBsYWNlQmV0cygpIHtcbiAgY29uc3Qgc3VibWl0QmV0T25lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzdWJtaXRCZXRPbmVcIik7XG4gIHN1Ym1pdEJldE9uZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgIGNvbnN0IGJldEZpZWxkT25lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJiZXRGaWVsZE9uZVwiKTtcblxuICAgIGlmIChcbiAgICAgIGJldEZpZWxkT25lLnZhbHVlID4gcGxheWVyT25lLnNjb3JlIHx8XG4gICAgICBiZXRGaWVsZE9uZS52YWx1ZSA+IHBsYXllclR3by5zY29yZSB8fFxuICAgICAgYmV0RmllbGRPbmUudmFsdWUgPCAxIHx8XG4gICAgICBpc05hTihiZXRGaWVsZE9uZS52YWx1ZSlcbiAgICApIHtcbiAgICAgIHJldHVybjtcbiAgICB9IGVsc2Uge1xuICAgICAgcGxheWVyT25lLmJldCA9IGJldEZpZWxkT25lLnZhbHVlO1xuICAgIH1cblxuICAgIGNvbnN0IGV2ZW5PbmUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImV2ZW5PbmVcIik7XG4gICAgY29uc3QgdW5ldmVuT25lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ1bmV2ZW5PbmVcIik7XG5cbiAgICBpZiAoZXZlbk9uZS5jaGVja2VkID09PSB0cnVlKSB7XG4gICAgICBwbGF5ZXJPbmUuY2hvaWNlID0gXCJldmVuXCI7XG4gICAgfSBlbHNlIGlmICh1bmV2ZW5PbmUuY2hlY2tlZCA9PT0gdHJ1ZSkge1xuICAgICAgcGxheWVyT25lLmNob2ljZSA9IFwidW5ldmVuXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBiZXRGaWVsZE9uZS52YWx1ZSA9IFwiXCI7XG5cbiAgICBiZXRPbmUuY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcblxuICAgIHBsYXllck9uZS5yZWFkeSA9IHRydWU7XG5cbiAgICBpZiAoYm90aFJlYWR5KCkpIHBsYXlSb3VuZCgpO1xuICB9KTtcblxuICBjb25zdCBzdWJtaXRCZXRUd28gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInN1Ym1pdEJldFR3b1wiKTtcbiAgc3VibWl0QmV0VHdvLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgY29uc3QgYmV0RmllbGRUd28gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJldEZpZWxkVHdvXCIpO1xuXG4gICAgaWYgKFxuICAgICAgYmV0RmllbGRUd28udmFsdWUgPiBwbGF5ZXJUd28uc2NvcmUgfHxcbiAgICAgIGJldEZpZWxkVHdvLnZhbHVlID4gcGxheWVyT25lLnNjb3JlIHx8XG4gICAgICBiZXRGaWVsZFR3by52YWx1ZSA8IDEgfHxcbiAgICAgIGlzTmFOKGJldEZpZWxkVHdvLnZhbHVlKVxuICAgICkge1xuICAgICAgcmV0dXJuO1xuICAgIH0gZWxzZSB7XG4gICAgICBwbGF5ZXJUd28uYmV0ID0gYmV0RmllbGRUd28udmFsdWU7XG4gICAgfVxuXG4gICAgY29uc3QgZXZlblR3byA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZXZlblR3b1wiKTtcbiAgICBjb25zdCB1bmV2ZW5Ud28gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInVuZXZlblR3b1wiKTtcblxuICAgIGlmIChldmVuVHdvLmNoZWNrZWQgPT09IHRydWUpIHtcbiAgICAgIHBsYXllclR3by5jaG9pY2UgPSBcImV2ZW5cIjtcbiAgICB9IGVsc2UgaWYgKHVuZXZlblR3by5jaGVja2VkID09PSB0cnVlKSB7XG4gICAgICBwbGF5ZXJUd28uY2hvaWNlID0gXCJ1bmV2ZW5cIjtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGJldEZpZWxkVHdvLnZhbHVlID0gXCJcIjtcblxuICAgIGJldFR3by5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xuXG4gICAgcGxheWVyVHdvLnJlYWR5ID0gdHJ1ZTtcblxuICAgIGlmIChib3RoUmVhZHkoKSkgcGxheVJvdW5kKCk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiByZXNvbHZlVHVybigpIHtcbiAgaWYgKHBsYXllck9uZS5yb2xlID09PSBcImd1ZXNzZXJcIikge1xuICAgIGlmIChwbGF5ZXJPbmUuY2hvaWNlID09PSBwbGF5ZXJUd28uY2hvaWNlKSB7XG4gICAgICBwbGF5ZXJPbmUuc2NvcmUgKz0gTnVtYmVyKHBsYXllck9uZS5iZXQpO1xuICAgICAgcGxheWVyVHdvLnNjb3JlIC09IE51bWJlcihwbGF5ZXJPbmUuYmV0KTtcbiAgICAgIHJvdW5kV2lubmVyID0gcGxheWVyT25lLm5hbWU7XG4gICAgICB3b25BbW91bnQgPSBwbGF5ZXJPbmUuYmV0O1xuICAgICAgb3V0Y29tZSA9IFwiZ3Vlc3NlZCBjb3JyZWN0bHlcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgcGxheWVyT25lLnNjb3JlIC09IE51bWJlcihwbGF5ZXJPbmUuYmV0KTtcbiAgICAgIHBsYXllclR3by5zY29yZSArPSBOdW1iZXIocGxheWVyT25lLmJldCk7XG4gICAgICByb3VuZFdpbm5lciA9IHBsYXllclR3by5uYW1lO1xuICAgICAgd29uQW1vdW50ID0gcGxheWVyT25lLmJldDtcbiAgICAgIG91dGNvbWUgPSBcImhhcyBub3QgYmVlbiBmaWd1cmVkIG91dFwiO1xuICAgIH1cbiAgfSBlbHNlIGlmIChwbGF5ZXJPbmUucm9sZSA9PT0gXCJoaWRlclwiKSB7XG4gICAgaWYgKHBsYXllck9uZS5jaG9pY2UgPT09IHBsYXllclR3by5jaG9pY2UpIHtcbiAgICAgIHBsYXllck9uZS5zY29yZSAtPSBOdW1iZXIocGxheWVyVHdvLmJldCk7XG4gICAgICBwbGF5ZXJUd28uc2NvcmUgKz0gTnVtYmVyKHBsYXllclR3by5iZXQpO1xuICAgICAgcm91bmRXaW5uZXIgPSBwbGF5ZXJUd28ubmFtZTtcbiAgICAgIHdvbkFtb3VudCA9IHBsYXllclR3by5iZXQ7XG4gICAgICBvdXRjb21lID0gXCJndWVzc2VkIGNvcnJlY3RseVwiO1xuICAgIH0gZWxzZSB7XG4gICAgICBwbGF5ZXJPbmUuc2NvcmUgKz0gTnVtYmVyKHBsYXllclR3by5iZXQpO1xuICAgICAgcGxheWVyVHdvLnNjb3JlIC09IE51bWJlcihwbGF5ZXJUd28uYmV0KTtcbiAgICAgIHJvdW5kV2lubmVyID0gcGxheWVyT25lLm5hbWU7XG4gICAgICB3b25BbW91bnQgPSBwbGF5ZXJUd28uYmV0O1xuICAgICAgb3V0Y29tZSA9IFwiaGFzIG5vdCBiZWVuIGZpZ3VyZWQgb3V0XCI7XG4gICAgfVxuICB9XG59XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=