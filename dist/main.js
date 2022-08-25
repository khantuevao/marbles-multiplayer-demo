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





function fib(n) {
  return n <= 1? n : fib(n-1) + fib(n -2);
}
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7OztBQUFBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFdBQVc7QUFDWDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0osMEJBQTBCLG1CQUFtQjtBQUM3Qzs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBLHlCQUF5QixlQUFlOztBQUV4QztBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSiwwQkFBMEIsbUJBQW1CO0FBQzdDOztBQUVBOztBQUVBOztBQUVBO0FBQ0EseUJBQXlCLGVBQWU7O0FBRXhDO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0Q0FBNEMsWUFBWSxZQUFZLFNBQVMsa0JBQWtCLFdBQVc7QUFDMUc7QUFDQSxzQ0FBc0MsYUFBYTtBQUNuRCxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHlCQUF5QixlQUFlOztBQUV4Qyx5QkFBeUIsZUFBZTtBQUN4Qzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsMEJBQTBCLGdCQUFnQjs7QUFFMUM7QUFDQSwwQkFBMEIsZ0JBQWdCO0FBQzFDOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkNBQTZDLFdBQVc7QUFDeEQ7QUFDQTtBQUNBO0FBQ0EsOENBQThDLFlBQVksWUFBWSxTQUFTLGtCQUFrQixXQUFXO0FBQzVHLDZDQUE2QyxXQUFXO0FBQ3hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBLE1BQU07QUFDTjtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQSxNQUFNO0FBQ047QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7O0FBTUE7QUFDQTtBQUNBLEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9tYXJibGVzLW11bHRpcGxheWVyLWRlbW8vLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsibGV0IHBsYXllck9uZTtcbmxldCBwbGF5ZXJUd287XG5cbmxldCByb3VuZENvdW50ID0gMDtcblxubGV0IHJvdW5kV2lubmVyO1xubGV0IHdvbkFtb3VudDtcbmxldCBvdXRjb21lO1xuXG5jb25zdCBnZXROYW1lT25lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnZXROYW1lT25lXCIpO1xuY29uc3QgZ2V0TmFtZVR3byA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ2V0TmFtZVR3b1wiKTtcbmNvbnN0IHBsYXllck9uZURpdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucGxheWVyLm9uZVwiKTtcbmNvbnN0IHBsYXllclR3b0RpdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucGxheWVyLnR3b1wiKTtcbmNvbnN0IGJldE9uZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuYmV0Lm9uZVwiKTtcbmNvbnN0IGJldFR3byA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuYmV0LnR3b1wiKTtcbmNvbnN0IHJvbGVPbmUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnJvbGUub25lXCIpO1xuY29uc3Qgcm9sZVR3byA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucm9sZS50d29cIik7XG5jb25zdCBhbm5vdW5jZW1lbnRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhbm5vdW5jZW1lbnRzXCIpO1xuY29uc3Qgc2NvcmVEaXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnNjb3JlRGl2LmhpZGRlblwiKTtcblxuLy9QbGF5ZXIgZmFjdG9yeVxuY29uc3QgUGxheWVyID0gKG5hbWUpID0+IHtcbiAgbGV0IHNjb3JlID0gMTA7XG4gIGxldCBiZXQ7XG4gIGxldCByb2xlO1xuICBsZXQgcmVhZHkgPSBmYWxzZTtcbiAgbGV0IGNob2ljZTtcblxuICByZXR1cm4geyBuYW1lLCBzY29yZSwgYmV0LCByb2xlLCByZWFkeSwgY2hvaWNlIH07XG59O1xuXG4vL2luaXQgcGxheWVycywgcmVtb3ZlIGlucHV0IGZpZWxkcyBhbmQgc2hvdyBuYW1lc1xuY29uc3Qgc3VibWl0TmFtZU9uZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3VibWl0TmFtZU9uZVwiKTtcbnN1Ym1pdE5hbWVPbmUuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgY29uc3QgbmFtZUZpZWxkT25lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuYW1lRmllbGRPbmVcIik7XG4gIGlmIChuYW1lRmllbGRPbmUudmFsdWUgPT09IFwiXCIpIHtcbiAgICBwbGF5ZXJPbmUgPSBQbGF5ZXIoXCJQbGF5ZXIgT25lXCIpO1xuICB9IGVsc2Uge1xuICAgIHBsYXllck9uZSA9IFBsYXllcihgJHtuYW1lRmllbGRPbmUudmFsdWV9YCk7XG4gIH1cblxuICBwbGF5ZXJPbmUucmVhZHkgPSB0cnVlO1xuXG4gIGdldE5hbWVPbmUuaW5uZXJIVE1MID0gXCJcIjtcblxuICBjb25zdCBuYW1lT25lID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5uYW1lLm9uZVwiKTtcbiAgbmFtZU9uZS5pbm5lckhUTUwgPSBgJHtwbGF5ZXJPbmUubmFtZX1gO1xuXG4gIGlmIChib3RoUmVhZHkoKSkgcGxheVJvdW5kKCk7XG59KTtcblxuY29uc3Qgc3VibWl0TmFtZVR3byA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3VibWl0TmFtZVR3b1wiKTtcbnN1Ym1pdE5hbWVUd28uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgY29uc3QgbmFtZUZpZWxkVHdvID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuYW1lRmllbGRUd29cIik7XG4gIGlmIChuYW1lRmllbGRUd28udmFsdWUgPT09IFwiXCIpIHtcbiAgICBwbGF5ZXJUd28gPSBQbGF5ZXIoXCJQbGF5ZXIgVHdvXCIpO1xuICB9IGVsc2Uge1xuICAgIHBsYXllclR3byA9IFBsYXllcihgJHtuYW1lRmllbGRUd28udmFsdWV9YCk7XG4gIH1cblxuICBwbGF5ZXJUd28ucmVhZHkgPSB0cnVlO1xuXG4gIGdldE5hbWVUd28uaW5uZXJIVE1MID0gXCJcIjtcblxuICBjb25zdCBuYW1lVHdvID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5uYW1lLnR3b1wiKTtcbiAgbmFtZVR3by5pbm5lckhUTUwgPSBgJHtwbGF5ZXJUd28ubmFtZX1gO1xuXG4gIGlmIChib3RoUmVhZHkoKSkgcGxheVJvdW5kKCk7XG59KTtcblxuZnVuY3Rpb24gYm90aFJlYWR5KCkge1xuICBpZiAocGxheWVyT25lLnJlYWR5ICYmIHBsYXllclR3by5yZWFkeSkgcGxheVJvdW5kKCk7XG59XG5cbi8vZ2FtZSBjb250cm9sbGVyXG5mdW5jdGlvbiBwbGF5Um91bmQoKSB7XG4gIHJlc29sdmVUdXJuKCk7XG4gIHJvdW5kQ291bnQrKztcblxuICBwbGF5ZXJPbmUucmVhZHkgPSBmYWxzZTtcbiAgcGxheWVyVHdvLnJlYWR5ID0gZmFsc2U7XG5cbiAgYmV0T25lLmNsYXNzTGlzdC5yZW1vdmUoXCJoaWRkZW5cIik7XG4gIGJldFR3by5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZGVuXCIpO1xuXG4gIGlmIChyb3VuZENvdW50ID09PSAxKSB7XG4gICAgLy9maXJzdCByb3VuZFxuICAgIGJldE9uZS5jbGFzc0xpc3QucmVtb3ZlKFwibm9uZVwiKTtcbiAgICBiZXRUd28uY2xhc3NMaXN0LnJlbW92ZShcIm5vbmVcIik7XG5cbiAgICBzY29yZURpdi5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZGVuXCIpO1xuICAgIHJlbmRlclNjb3JlKCk7XG4gICAgZGVjaWRlUm9sZXMoKTtcbiAgICByZW5kZXJSb2xlcygpO1xuICAgIGNoYW5nZUFubm91bmNlbWVudCgpO1xuICAgIHBsYWNlQmV0cygpO1xuICB9IGVsc2UgaWYgKHBsYXllck9uZS5zY29yZSA9PT0gMCB8fCBwbGF5ZXJUd28uc2NvcmUgPT09IDApIHtcbiAgICAvL2dhbWUgZW5kc1xuICAgIHJlbmRlclNjb3JlKCk7XG4gICAgYmV0T25lLmNsYXNzTGlzdC5hZGQoXCJub25lXCIpO1xuICAgIGJldFR3by5jbGFzc0xpc3QuYWRkKFwibm9uZVwiKTtcbiAgICByb2xlT25lLmNsYXNzTGlzdC5hZGQoXCJub25lXCIpO1xuICAgIHJvbGVUd28uY2xhc3NMaXN0LmFkZChcIm5vbmVcIik7XG4gICAgYW5ub3VuY2VtZW50cy5pbm5lckhUTUwgPSBgPHA+PHN0cm9uZz4ke3JvdW5kV2lubmVyfTwvc3Ryb25nPiAke291dGNvbWV9IGFuZCB3b24gPHN0cm9uZz4ke3dvbkFtb3VudH0gbWFyYmxlcy48L3N0cm9uZz48L3A+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aDM+R2FtZSBvdmVyPC9oMz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwPiR7cm91bmRXaW5uZXJ9IGlzIHRoZSB3aW5uZXI8L3A+YDtcbiAgfSBlbHNlIHtcbiAgICAvL2RlZmF1bHRcbiAgICByZW5kZXJTY29yZSgpO1xuICAgIGNoYW5nZVJvbGVzKCk7XG4gICAgcmVuZGVyUm9sZXMoKTtcbiAgICBjaGFuZ2VBbm5vdW5jZW1lbnQoKTtcbiAgICBwbGFjZUJldHMoKTtcbiAgfVxufVxuXG5mdW5jdGlvbiByZW5kZXJSb2xlcygpIHtcbiAgcm9sZU9uZS5pbm5lckhUTUwgPSBgJHtwbGF5ZXJPbmUucm9sZX1gO1xuXG4gIHJvbGVUd28uaW5uZXJIVE1MID0gYCR7cGxheWVyVHdvLnJvbGV9YDtcbn1cblxuZnVuY3Rpb24gZGVjaWRlUm9sZXMoKSB7XG4gIGNvbnN0IHJlc3VsdCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDIpO1xuICBpZiAocmVzdWx0ID09PSAwKSB7XG4gICAgcGxheWVyT25lLnJvbGUgPSBcImhpZGVyXCI7XG4gICAgcGxheWVyVHdvLnJvbGUgPSBcImd1ZXNzZXJcIjtcbiAgfSBlbHNlIHtcbiAgICBwbGF5ZXJPbmUucm9sZSA9IFwiZ3Vlc3NlclwiO1xuICAgIHBsYXllclR3by5yb2xlID0gXCJoaWRlclwiO1xuICB9XG59XG5cbmZ1bmN0aW9uIGNoYW5nZVJvbGVzKCkge1xuICBpZiAocGxheWVyT25lLnNjb3JlID09PSAxKSB7XG4gICAgcGxheWVyT25lLnJvbGUgPSBcImd1ZXNzZXJcIjtcbiAgICBwbGF5ZXJUd28ucm9sZSA9IFwiaGlkZXJcIjtcbiAgfSBlbHNlIGlmIChwbGF5ZXJUd28uc2NvcmUgPT09IDEpIHtcbiAgICBwbGF5ZXJPbmUucm9sZSA9IFwiaGlkZXJcIjtcbiAgICBwbGF5ZXJUd28ucm9sZSA9IFwiZ3Vlc3NlclwiO1xuICB9IGVsc2UgaWYgKHBsYXllck9uZS5yb2xlID09PSBcImhpZGVyXCIpIHtcbiAgICBwbGF5ZXJPbmUucm9sZSA9IFwiZ3Vlc3NlclwiO1xuICAgIHBsYXllclR3by5yb2xlID0gXCJoaWRlclwiO1xuICB9IGVsc2UgaWYgKHBsYXllck9uZS5yb2xlID09PSBcImd1ZXNzZXJcIikge1xuICAgIHBsYXllck9uZS5yb2xlID0gXCJoaWRlclwiO1xuICAgIHBsYXllclR3by5yb2xlID0gXCJndWVzc2VyXCI7XG4gIH1cbn1cblxuZnVuY3Rpb24gcmVuZGVyU2NvcmUoKSB7XG4gIGNvbnN0IHNjb3JlT25lID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5zY29yZS5vbmVcIik7XG4gIHNjb3JlT25lLmlubmVySFRNTCA9IGAke3BsYXllck9uZS5zY29yZX1gO1xuXG4gIGNvbnN0IHNjb3JlVHdvID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5zY29yZS50d29cIik7XG4gIHNjb3JlVHdvLmlubmVySFRNTCA9IGAke3BsYXllclR3by5zY29yZX1gO1xufVxuXG5mdW5jdGlvbiBjaGFuZ2VBbm5vdW5jZW1lbnQoKSB7XG4gIHN3aXRjaCAocm91bmRDb3VudCkge1xuICAgIGNhc2UgMTpcbiAgICAgIGFubm91bmNlbWVudHMuaW5uZXJIVE1MID0gYDxwPlBsYXllcnMgaGF2ZSBiZWVuIGFzc2lnbmVkIHJvbGVzIHJhbmRvbWx5PC9wPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGgzPlJvdW5kICR7cm91bmRDb3VudH08L2gzPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHA+TWFrZSB5b3VyIG1vdmVzPC9wPmA7XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgYW5ub3VuY2VtZW50cy5pbm5lckhUTUwgPSBgPHA+PHN0cm9uZz4ke3JvdW5kV2lubmVyfTwvc3Ryb25nPiAke291dGNvbWV9IGFuZCB3b24gPHN0cm9uZz4ke3dvbkFtb3VudH0gbWFyYmxlcy48L3N0cm9uZz48L3A+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aDM+Um91bmQgJHtyb3VuZENvdW50fTwvaDM+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cD5NYWtlIHlvdXIgbW92ZXM8L3A+YDtcbiAgfVxufVxuXG5mdW5jdGlvbiBwbGFjZUJldHMoKSB7XG4gIGNvbnN0IHN1Ym1pdEJldE9uZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3VibWl0QmV0T25lXCIpO1xuICBzdWJtaXRCZXRPbmUuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICBjb25zdCBiZXRGaWVsZE9uZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmV0RmllbGRPbmVcIik7XG5cbiAgICBpZiAoXG4gICAgICBiZXRGaWVsZE9uZS52YWx1ZSA+IHBsYXllck9uZS5zY29yZSB8fFxuICAgICAgYmV0RmllbGRPbmUudmFsdWUgPiBwbGF5ZXJUd28uc2NvcmUgfHxcbiAgICAgIGJldEZpZWxkT25lLnZhbHVlIDwgMSB8fFxuICAgICAgaXNOYU4oYmV0RmllbGRPbmUudmFsdWUpXG4gICAgKSB7XG4gICAgICByZXR1cm47XG4gICAgfSBlbHNlIHtcbiAgICAgIHBsYXllck9uZS5iZXQgPSBiZXRGaWVsZE9uZS52YWx1ZTtcbiAgICB9XG5cbiAgICBjb25zdCBldmVuT25lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJldmVuT25lXCIpO1xuICAgIGNvbnN0IG9kZE9uZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib2RkT25lXCIpO1xuXG4gICAgaWYgKGV2ZW5PbmUuY2hlY2tlZCA9PT0gdHJ1ZSkge1xuICAgICAgcGxheWVyT25lLmNob2ljZSA9IFwiZXZlblwiO1xuICAgIH0gZWxzZSBpZiAob2RkT25lLmNoZWNrZWQgPT09IHRydWUpIHtcbiAgICAgIHBsYXllck9uZS5jaG9pY2UgPSBcIm9kZFwiO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgYmV0RmllbGRPbmUudmFsdWUgPSBcIlwiO1xuXG4gICAgYmV0T25lLmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG5cbiAgICBwbGF5ZXJPbmUucmVhZHkgPSB0cnVlO1xuXG4gICAgaWYgKGJvdGhSZWFkeSgpKSBwbGF5Um91bmQoKTtcbiAgfSk7XG5cbiAgY29uc3Qgc3VibWl0QmV0VHdvID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzdWJtaXRCZXRUd29cIik7XG4gIHN1Ym1pdEJldFR3by5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgIGNvbnN0IGJldEZpZWxkVHdvID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJiZXRGaWVsZFR3b1wiKTtcblxuICAgIGlmIChcbiAgICAgIGJldEZpZWxkVHdvLnZhbHVlID4gcGxheWVyVHdvLnNjb3JlIHx8XG4gICAgICBiZXRGaWVsZFR3by52YWx1ZSA+IHBsYXllck9uZS5zY29yZSB8fFxuICAgICAgYmV0RmllbGRUd28udmFsdWUgPCAxIHx8XG4gICAgICBpc05hTihiZXRGaWVsZFR3by52YWx1ZSlcbiAgICApIHtcbiAgICAgIHJldHVybjtcbiAgICB9IGVsc2Uge1xuICAgICAgcGxheWVyVHdvLmJldCA9IGJldEZpZWxkVHdvLnZhbHVlO1xuICAgIH1cblxuICAgIGNvbnN0IGV2ZW5Ud28gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImV2ZW5Ud29cIik7XG4gICAgY29uc3Qgb2RkVHdvID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvZGRUd29cIik7XG5cbiAgICBpZiAoZXZlblR3by5jaGVja2VkID09PSB0cnVlKSB7XG4gICAgICBwbGF5ZXJUd28uY2hvaWNlID0gXCJldmVuXCI7XG4gICAgfSBlbHNlIGlmIChvZGRUd28uY2hlY2tlZCA9PT0gdHJ1ZSkge1xuICAgICAgcGxheWVyVHdvLmNob2ljZSA9IFwib2RkXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBiZXRGaWVsZFR3by52YWx1ZSA9IFwiXCI7XG5cbiAgICBiZXRUd28uY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcblxuICAgIHBsYXllclR3by5yZWFkeSA9IHRydWU7XG5cbiAgICBpZiAoYm90aFJlYWR5KCkpIHBsYXlSb3VuZCgpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gcmVzb2x2ZVR1cm4oKSB7XG4gIGlmIChwbGF5ZXJPbmUucm9sZSA9PT0gXCJndWVzc2VyXCIpIHtcbiAgICBpZiAocGxheWVyT25lLmNob2ljZSA9PT0gcGxheWVyVHdvLmNob2ljZSkge1xuICAgICAgcGxheWVyT25lLnNjb3JlICs9IE51bWJlcihwbGF5ZXJPbmUuYmV0KTtcbiAgICAgIHBsYXllclR3by5zY29yZSAtPSBOdW1iZXIocGxheWVyT25lLmJldCk7XG4gICAgICByb3VuZFdpbm5lciA9IHBsYXllck9uZS5uYW1lO1xuICAgICAgd29uQW1vdW50ID0gcGxheWVyT25lLmJldDtcbiAgICAgIG91dGNvbWUgPSBcImd1ZXNzZWQgY29ycmVjdGx5XCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBsYXllck9uZS5zY29yZSAtPSBOdW1iZXIocGxheWVyT25lLmJldCk7XG4gICAgICBwbGF5ZXJUd28uc2NvcmUgKz0gTnVtYmVyKHBsYXllck9uZS5iZXQpO1xuICAgICAgcm91bmRXaW5uZXIgPSBwbGF5ZXJUd28ubmFtZTtcbiAgICAgIHdvbkFtb3VudCA9IHBsYXllck9uZS5iZXQ7XG4gICAgICBvdXRjb21lID0gXCJoYXMgbm90IGJlZW4gZmlndXJlZCBvdXRcIjtcbiAgICB9XG4gIH0gZWxzZSBpZiAocGxheWVyT25lLnJvbGUgPT09IFwiaGlkZXJcIikge1xuICAgIGlmIChwbGF5ZXJPbmUuY2hvaWNlID09PSBwbGF5ZXJUd28uY2hvaWNlKSB7XG4gICAgICBwbGF5ZXJPbmUuc2NvcmUgLT0gTnVtYmVyKHBsYXllclR3by5iZXQpO1xuICAgICAgcGxheWVyVHdvLnNjb3JlICs9IE51bWJlcihwbGF5ZXJUd28uYmV0KTtcbiAgICAgIHJvdW5kV2lubmVyID0gcGxheWVyVHdvLm5hbWU7XG4gICAgICB3b25BbW91bnQgPSBwbGF5ZXJUd28uYmV0O1xuICAgICAgb3V0Y29tZSA9IFwiZ3Vlc3NlZCBjb3JyZWN0bHlcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgcGxheWVyT25lLnNjb3JlICs9IE51bWJlcihwbGF5ZXJUd28uYmV0KTtcbiAgICAgIHBsYXllclR3by5zY29yZSAtPSBOdW1iZXIocGxheWVyVHdvLmJldCk7XG4gICAgICByb3VuZFdpbm5lciA9IHBsYXllck9uZS5uYW1lO1xuICAgICAgd29uQW1vdW50ID0gcGxheWVyVHdvLmJldDtcbiAgICAgIG91dGNvbWUgPSBcImhhcyBub3QgYmVlbiBmaWd1cmVkIG91dFwiO1xuICAgIH1cbiAgfVxufVxuXG5cblxuXG5cbmZ1bmN0aW9uIGZpYihuKSB7XG4gIHJldHVybiBuIDw9IDE/IG4gOiBmaWIobi0xKSArIGZpYihuIC0yKTtcbn0iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=