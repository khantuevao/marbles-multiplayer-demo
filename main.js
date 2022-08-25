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

const getNameOne = document.getElementById('getNameOne');
const getNameTwo = document.getElementById('getNameTwo');
const playerOneDiv = document.querySelector('.player.one');
const playerTwoDiv = document.querySelector('.player.two');
const betOne = document.querySelector('.bet.one')
const betTwo = document.querySelector('.bet.two')
const roleOne = document.querySelector('.role.one');
const roleTwo = document.querySelector('.role.two')
const announcements = document.getElementById('announcements');
const scoreDiv = document.querySelector('.scoreDiv.hidden');

//Player factory
const Player = (name) => {
  let score = 10;
  let bet;
  let role;
  let ready = false;
  let choice;

  return {name, score, bet, role, ready, choice}
}

//init players, remove input fields and show names
const submitNameOne = document.getElementById('submitNameOne');
submitNameOne.addEventListener('click', () => {
  const nameFieldOne = document.getElementById('nameFieldOne');
  if (nameFieldOne.value === '') {
    playerOne = Player('Player One')
  } else {
    playerOne = Player(`${nameFieldOne.value}`)
  }

  playerOne.ready = true;

  getNameOne.innerHTML = '';

  const nameOne = document.querySelector('.name.one');
  nameOne.innerHTML = `${playerOne.name}`;

  if (bothReady()) playRound();
});

const submitNameTwo = document.getElementById('submitNameTwo');
submitNameTwo.addEventListener('click', () => {
  const nameFieldTwo = document.getElementById('nameFieldTwo');
  if (nameFieldTwo.value === '') {
    playerTwo = Player('Player Two')
  } else {
    playerTwo = Player(`${nameFieldTwo.value}`)
  }

  playerTwo.ready = true;

  getNameTwo.innerHTML = '';

  const nameTwo = document.querySelector('.name.two')
  nameTwo.innerHTML = `${playerTwo.name}`;
  
  if (bothReady()) playRound();
});

function bothReady() {
  if (playerOne.ready && playerTwo.ready) playRound();
}

//game controller
function playRound() {
  resolveTurn()
  roundCount++;

  playerOne.ready = false;
  playerTwo.ready = false;

  betOne.classList.remove('hidden');
  betTwo.classList.remove('hidden');

  if (roundCount === 1) {
    //first round
    betOne.classList.remove('none')
    betTwo.classList.remove('none');

    scoreDiv.classList.remove('hidden');
    renderScore();
    decideRoles();
    renderRoles();
    changeAnnouncement();
    placeBets();
  } else if (playerOne.score === 0 || playerTwo.score === 0) {
    //game ends
    renderScore();
    betOne.classList.add('none')
    betTwo.classList.add('none')
    roleOne.classList.add('none')
    roleTwo.classList.add('none')
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
    playerOne.role = 'hider';
    playerTwo.role = 'guesser';
  } else {
    playerOne.role = 'guesser';
    playerTwo.role = 'hider';
  }
}

function changeRoles() {
  if (playerOne.score === 1) {
    playerOne.role = 'guesser';
    playerTwo.role = 'hider';
  } else if (playerTwo.score === 1) {
    playerOne.role = 'hider';
    playerTwo.role = 'guesser';
  } else if (playerOne.role === 'hider') {
    playerOne.role = 'guesser';
    playerTwo.role = 'hider';
  } else if (playerOne.role === 'guesser') {
    playerOne.role = 'hider';
    playerTwo.role = 'guesser';
  } 
}

function renderScore() {
  const scoreOne = document.querySelector('.score.one');
  scoreOne.innerHTML = `${playerOne.score}`;

  const scoreTwo = document.querySelector('.score.two');
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
  const submitBetOne = document.getElementById('submitBetOne');
  submitBetOne.addEventListener('click', () => {
    const betFieldOne = document.getElementById('betFieldOne');

    if (betFieldOne.value > playerOne.score || betFieldOne.value > playerTwo.score || betFieldOne.value < 1 || isNaN(betFieldOne.value)) {
      return;
    } else {
      playerOne.bet = betFieldOne.value;
    }

    const evenOne = document.getElementById('evenOne');
    const unevenOne = document.getElementById('unevenOne');

    if (evenOne.checked === true) {
      playerOne.choice = 'even';
    } else if (unevenOne.checked === true) {
      playerOne.choice = 'uneven';
    } else {
      return;
    }

    betFieldOne.value = '';

    betOne.classList.add('hidden');

    playerOne.ready = true;

    if (bothReady()) playRound();
  })
  
  const submitBetTwo = document.getElementById('submitBetTwo');
  submitBetTwo.addEventListener('click', () => {
    const betFieldTwo = document.getElementById('betFieldTwo');

    if (betFieldTwo.value > playerTwo.score || betFieldTwo.value > playerOne.score || betFieldTwo.value < 1 || isNaN(betFieldTwo.value)) {
      return;
    } else {
      playerTwo.bet = betFieldTwo.value;
    }

    const evenTwo = document.getElementById('evenTwo');
    const unevenTwo = document.getElementById('unevenTwo');

    if (evenTwo.checked === true) {
      playerTwo.choice = 'even';
    } else if (unevenTwo.checked === true) {
      playerTwo.choice = 'uneven';
    } else {
      return;
    }

    betFieldTwo.value = '';

    betTwo.classList.add('hidden');

    playerTwo.ready = true;

    if (bothReady()) playRound();
  })
}

function resolveTurn() {
  if (playerOne.role === 'guesser') {
    if (playerOne.choice === playerTwo.choice) {
      playerOne.score += Number(playerOne.bet);
      playerTwo.score -= Number(playerOne.bet);
      roundWinner = playerOne.name;
      wonAmount = playerOne.bet;
      outcome = 'guessed correctly';
    } else {
      playerOne.score -= Number(playerOne.bet);
      playerTwo.score += Number(playerOne.bet);
      roundWinner = playerTwo.name;
      wonAmount = playerOne.bet;
      outcome = 'has not been figured out';
    }
  } else if (playerOne.role === 'hider') {
    if (playerOne.choice === playerTwo.choice) {
      playerOne.score -= Number(playerTwo.bet);
      playerTwo.score += Number(playerTwo.bet);
      roundWinner = playerTwo.name;
      wonAmount = playerTwo.bet;
      outcome = 'guessed correctly';
    } else {
      playerOne.score += Number(playerTwo.bet);
      playerTwo.score -= Number(playerTwo.bet);
      roundWinner = playerOne.name;
      wonAmount = playerTwo.bet;
      outcome = 'has not been figured out';
    }
  }
}
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7OztBQUFBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFVBQVU7QUFDVjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0osMEJBQTBCLG1CQUFtQjtBQUM3Qzs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBLHlCQUF5QixlQUFlOztBQUV4QztBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSiwwQkFBMEIsbUJBQW1CO0FBQzdDOztBQUVBOztBQUVBOztBQUVBO0FBQ0EseUJBQXlCLGVBQWU7QUFDeEM7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNENBQTRDLFlBQVksWUFBWSxTQUFTLGtCQUFrQixXQUFXO0FBQzFHO0FBQ0Esc0NBQXNDLGFBQWE7QUFDbkQsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSx5QkFBeUIsZUFBZTs7QUFFeEMseUJBQXlCLGVBQWU7QUFDeEM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDBCQUEwQixnQkFBZ0I7O0FBRTFDO0FBQ0EsMEJBQTBCLGdCQUFnQjtBQUMxQzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZDQUE2QyxXQUFXO0FBQ3hEO0FBQ0E7QUFDQTtBQUNBLDhDQUE4QyxZQUFZLFlBQVksU0FBUyxrQkFBa0IsV0FBVztBQUM1Ryw2Q0FBNkMsV0FBVztBQUN4RDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBLE1BQU07QUFDTjtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQSxNQUFNO0FBQ047QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbWFyYmxlcy1tdWx0aXBsYXllci1kZW1vLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImxldCBwbGF5ZXJPbmU7XG5sZXQgcGxheWVyVHdvO1xuXG5sZXQgcm91bmRDb3VudCA9IDA7XG5cbmxldCByb3VuZFdpbm5lcjtcbmxldCB3b25BbW91bnQ7XG5sZXQgb3V0Y29tZTtcblxuY29uc3QgZ2V0TmFtZU9uZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdnZXROYW1lT25lJyk7XG5jb25zdCBnZXROYW1lVHdvID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dldE5hbWVUd28nKTtcbmNvbnN0IHBsYXllck9uZURpdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wbGF5ZXIub25lJyk7XG5jb25zdCBwbGF5ZXJUd29EaXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGxheWVyLnR3bycpO1xuY29uc3QgYmV0T25lID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmJldC5vbmUnKVxuY29uc3QgYmV0VHdvID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmJldC50d28nKVxuY29uc3Qgcm9sZU9uZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5yb2xlLm9uZScpO1xuY29uc3Qgcm9sZVR3byA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5yb2xlLnR3bycpXG5jb25zdCBhbm5vdW5jZW1lbnRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Fubm91bmNlbWVudHMnKTtcbmNvbnN0IHNjb3JlRGl2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNjb3JlRGl2LmhpZGRlbicpO1xuXG4vL1BsYXllciBmYWN0b3J5XG5jb25zdCBQbGF5ZXIgPSAobmFtZSkgPT4ge1xuICBsZXQgc2NvcmUgPSAxMDtcbiAgbGV0IGJldDtcbiAgbGV0IHJvbGU7XG4gIGxldCByZWFkeSA9IGZhbHNlO1xuICBsZXQgY2hvaWNlO1xuXG4gIHJldHVybiB7bmFtZSwgc2NvcmUsIGJldCwgcm9sZSwgcmVhZHksIGNob2ljZX1cbn1cblxuLy9pbml0IHBsYXllcnMsIHJlbW92ZSBpbnB1dCBmaWVsZHMgYW5kIHNob3cgbmFtZXNcbmNvbnN0IHN1Ym1pdE5hbWVPbmUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3VibWl0TmFtZU9uZScpO1xuc3VibWl0TmFtZU9uZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgY29uc3QgbmFtZUZpZWxkT25lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ25hbWVGaWVsZE9uZScpO1xuICBpZiAobmFtZUZpZWxkT25lLnZhbHVlID09PSAnJykge1xuICAgIHBsYXllck9uZSA9IFBsYXllcignUGxheWVyIE9uZScpXG4gIH0gZWxzZSB7XG4gICAgcGxheWVyT25lID0gUGxheWVyKGAke25hbWVGaWVsZE9uZS52YWx1ZX1gKVxuICB9XG5cbiAgcGxheWVyT25lLnJlYWR5ID0gdHJ1ZTtcblxuICBnZXROYW1lT25lLmlubmVySFRNTCA9ICcnO1xuXG4gIGNvbnN0IG5hbWVPbmUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubmFtZS5vbmUnKTtcbiAgbmFtZU9uZS5pbm5lckhUTUwgPSBgJHtwbGF5ZXJPbmUubmFtZX1gO1xuXG4gIGlmIChib3RoUmVhZHkoKSkgcGxheVJvdW5kKCk7XG59KTtcblxuY29uc3Qgc3VibWl0TmFtZVR3byA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdWJtaXROYW1lVHdvJyk7XG5zdWJtaXROYW1lVHdvLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICBjb25zdCBuYW1lRmllbGRUd28gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbmFtZUZpZWxkVHdvJyk7XG4gIGlmIChuYW1lRmllbGRUd28udmFsdWUgPT09ICcnKSB7XG4gICAgcGxheWVyVHdvID0gUGxheWVyKCdQbGF5ZXIgVHdvJylcbiAgfSBlbHNlIHtcbiAgICBwbGF5ZXJUd28gPSBQbGF5ZXIoYCR7bmFtZUZpZWxkVHdvLnZhbHVlfWApXG4gIH1cblxuICBwbGF5ZXJUd28ucmVhZHkgPSB0cnVlO1xuXG4gIGdldE5hbWVUd28uaW5uZXJIVE1MID0gJyc7XG5cbiAgY29uc3QgbmFtZVR3byA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5uYW1lLnR3bycpXG4gIG5hbWVUd28uaW5uZXJIVE1MID0gYCR7cGxheWVyVHdvLm5hbWV9YDtcbiAgXG4gIGlmIChib3RoUmVhZHkoKSkgcGxheVJvdW5kKCk7XG59KTtcblxuZnVuY3Rpb24gYm90aFJlYWR5KCkge1xuICBpZiAocGxheWVyT25lLnJlYWR5ICYmIHBsYXllclR3by5yZWFkeSkgcGxheVJvdW5kKCk7XG59XG5cbi8vZ2FtZSBjb250cm9sbGVyXG5mdW5jdGlvbiBwbGF5Um91bmQoKSB7XG4gIHJlc29sdmVUdXJuKClcbiAgcm91bmRDb3VudCsrO1xuXG4gIHBsYXllck9uZS5yZWFkeSA9IGZhbHNlO1xuICBwbGF5ZXJUd28ucmVhZHkgPSBmYWxzZTtcblxuICBiZXRPbmUuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJyk7XG4gIGJldFR3by5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKTtcblxuICBpZiAocm91bmRDb3VudCA9PT0gMSkge1xuICAgIC8vZmlyc3Qgcm91bmRcbiAgICBiZXRPbmUuY2xhc3NMaXN0LnJlbW92ZSgnbm9uZScpXG4gICAgYmV0VHdvLmNsYXNzTGlzdC5yZW1vdmUoJ25vbmUnKTtcblxuICAgIHNjb3JlRGl2LmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpO1xuICAgIHJlbmRlclNjb3JlKCk7XG4gICAgZGVjaWRlUm9sZXMoKTtcbiAgICByZW5kZXJSb2xlcygpO1xuICAgIGNoYW5nZUFubm91bmNlbWVudCgpO1xuICAgIHBsYWNlQmV0cygpO1xuICB9IGVsc2UgaWYgKHBsYXllck9uZS5zY29yZSA9PT0gMCB8fCBwbGF5ZXJUd28uc2NvcmUgPT09IDApIHtcbiAgICAvL2dhbWUgZW5kc1xuICAgIHJlbmRlclNjb3JlKCk7XG4gICAgYmV0T25lLmNsYXNzTGlzdC5hZGQoJ25vbmUnKVxuICAgIGJldFR3by5jbGFzc0xpc3QuYWRkKCdub25lJylcbiAgICByb2xlT25lLmNsYXNzTGlzdC5hZGQoJ25vbmUnKVxuICAgIHJvbGVUd28uY2xhc3NMaXN0LmFkZCgnbm9uZScpXG4gICAgYW5ub3VuY2VtZW50cy5pbm5lckhUTUwgPSBgPHA+PHN0cm9uZz4ke3JvdW5kV2lubmVyfTwvc3Ryb25nPiAke291dGNvbWV9IGFuZCB3b24gPHN0cm9uZz4ke3dvbkFtb3VudH0gbWFyYmxlcy48L3N0cm9uZz48L3A+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aDM+R2FtZSBvdmVyPC9oMz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwPiR7cm91bmRXaW5uZXJ9IGlzIHRoZSB3aW5uZXI8L3A+YDtcbiAgfSBlbHNlIHtcbiAgICAvL2RlZmF1bHRcbiAgICByZW5kZXJTY29yZSgpO1xuICAgIGNoYW5nZVJvbGVzKCk7XG4gICAgcmVuZGVyUm9sZXMoKTtcbiAgICBjaGFuZ2VBbm5vdW5jZW1lbnQoKTtcbiAgICBwbGFjZUJldHMoKTtcbiAgfVxufVxuXG5mdW5jdGlvbiByZW5kZXJSb2xlcygpIHtcbiAgcm9sZU9uZS5pbm5lckhUTUwgPSBgJHtwbGF5ZXJPbmUucm9sZX1gO1xuXG4gIHJvbGVUd28uaW5uZXJIVE1MID0gYCR7cGxheWVyVHdvLnJvbGV9YDtcbn1cblxuZnVuY3Rpb24gZGVjaWRlUm9sZXMoKSB7XG4gIGNvbnN0IHJlc3VsdCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDIpO1xuICBpZiAocmVzdWx0ID09PSAwKSB7XG4gICAgcGxheWVyT25lLnJvbGUgPSAnaGlkZXInO1xuICAgIHBsYXllclR3by5yb2xlID0gJ2d1ZXNzZXInO1xuICB9IGVsc2Uge1xuICAgIHBsYXllck9uZS5yb2xlID0gJ2d1ZXNzZXInO1xuICAgIHBsYXllclR3by5yb2xlID0gJ2hpZGVyJztcbiAgfVxufVxuXG5mdW5jdGlvbiBjaGFuZ2VSb2xlcygpIHtcbiAgaWYgKHBsYXllck9uZS5zY29yZSA9PT0gMSkge1xuICAgIHBsYXllck9uZS5yb2xlID0gJ2d1ZXNzZXInO1xuICAgIHBsYXllclR3by5yb2xlID0gJ2hpZGVyJztcbiAgfSBlbHNlIGlmIChwbGF5ZXJUd28uc2NvcmUgPT09IDEpIHtcbiAgICBwbGF5ZXJPbmUucm9sZSA9ICdoaWRlcic7XG4gICAgcGxheWVyVHdvLnJvbGUgPSAnZ3Vlc3Nlcic7XG4gIH0gZWxzZSBpZiAocGxheWVyT25lLnJvbGUgPT09ICdoaWRlcicpIHtcbiAgICBwbGF5ZXJPbmUucm9sZSA9ICdndWVzc2VyJztcbiAgICBwbGF5ZXJUd28ucm9sZSA9ICdoaWRlcic7XG4gIH0gZWxzZSBpZiAocGxheWVyT25lLnJvbGUgPT09ICdndWVzc2VyJykge1xuICAgIHBsYXllck9uZS5yb2xlID0gJ2hpZGVyJztcbiAgICBwbGF5ZXJUd28ucm9sZSA9ICdndWVzc2VyJztcbiAgfSBcbn1cblxuZnVuY3Rpb24gcmVuZGVyU2NvcmUoKSB7XG4gIGNvbnN0IHNjb3JlT25lID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNjb3JlLm9uZScpO1xuICBzY29yZU9uZS5pbm5lckhUTUwgPSBgJHtwbGF5ZXJPbmUuc2NvcmV9YDtcblxuICBjb25zdCBzY29yZVR3byA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zY29yZS50d28nKTtcbiAgc2NvcmVUd28uaW5uZXJIVE1MID0gYCR7cGxheWVyVHdvLnNjb3JlfWA7XG59XG5cbmZ1bmN0aW9uIGNoYW5nZUFubm91bmNlbWVudCgpIHtcbiAgc3dpdGNoIChyb3VuZENvdW50KSB7XG4gICAgY2FzZSAxOlxuICAgICAgYW5ub3VuY2VtZW50cy5pbm5lckhUTUwgPSBgPHA+UGxheWVycyBoYXZlIGJlZW4gYXNzaWduZWQgcm9sZXMgcmFuZG9tbHk8L3A+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aDM+Um91bmQgJHtyb3VuZENvdW50fTwvaDM+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cD5NYWtlIHlvdXIgbW92ZXM8L3A+YDtcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICBhbm5vdW5jZW1lbnRzLmlubmVySFRNTCA9IGA8cD48c3Ryb25nPiR7cm91bmRXaW5uZXJ9PC9zdHJvbmc+ICR7b3V0Y29tZX0gYW5kIHdvbiA8c3Ryb25nPiR7d29uQW1vdW50fSBtYXJibGVzLjwvc3Ryb25nPjwvcD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxoMz5Sb3VuZCAke3JvdW5kQ291bnR9PC9oMz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwPk1ha2UgeW91ciBtb3ZlczwvcD5gO1xuICB9XG59XG5cbmZ1bmN0aW9uIHBsYWNlQmV0cygpIHtcbiAgY29uc3Qgc3VibWl0QmV0T25lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N1Ym1pdEJldE9uZScpO1xuICBzdWJtaXRCZXRPbmUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgY29uc3QgYmV0RmllbGRPbmUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYmV0RmllbGRPbmUnKTtcblxuICAgIGlmIChiZXRGaWVsZE9uZS52YWx1ZSA+IHBsYXllck9uZS5zY29yZSB8fCBiZXRGaWVsZE9uZS52YWx1ZSA+IHBsYXllclR3by5zY29yZSB8fCBiZXRGaWVsZE9uZS52YWx1ZSA8IDEgfHwgaXNOYU4oYmV0RmllbGRPbmUudmFsdWUpKSB7XG4gICAgICByZXR1cm47XG4gICAgfSBlbHNlIHtcbiAgICAgIHBsYXllck9uZS5iZXQgPSBiZXRGaWVsZE9uZS52YWx1ZTtcbiAgICB9XG5cbiAgICBjb25zdCBldmVuT25lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2V2ZW5PbmUnKTtcbiAgICBjb25zdCB1bmV2ZW5PbmUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndW5ldmVuT25lJyk7XG5cbiAgICBpZiAoZXZlbk9uZS5jaGVja2VkID09PSB0cnVlKSB7XG4gICAgICBwbGF5ZXJPbmUuY2hvaWNlID0gJ2V2ZW4nO1xuICAgIH0gZWxzZSBpZiAodW5ldmVuT25lLmNoZWNrZWQgPT09IHRydWUpIHtcbiAgICAgIHBsYXllck9uZS5jaG9pY2UgPSAndW5ldmVuJztcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGJldEZpZWxkT25lLnZhbHVlID0gJyc7XG5cbiAgICBiZXRPbmUuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XG5cbiAgICBwbGF5ZXJPbmUucmVhZHkgPSB0cnVlO1xuXG4gICAgaWYgKGJvdGhSZWFkeSgpKSBwbGF5Um91bmQoKTtcbiAgfSlcbiAgXG4gIGNvbnN0IHN1Ym1pdEJldFR3byA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdWJtaXRCZXRUd28nKTtcbiAgc3VibWl0QmV0VHdvLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgIGNvbnN0IGJldEZpZWxkVHdvID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2JldEZpZWxkVHdvJyk7XG5cbiAgICBpZiAoYmV0RmllbGRUd28udmFsdWUgPiBwbGF5ZXJUd28uc2NvcmUgfHwgYmV0RmllbGRUd28udmFsdWUgPiBwbGF5ZXJPbmUuc2NvcmUgfHwgYmV0RmllbGRUd28udmFsdWUgPCAxIHx8IGlzTmFOKGJldEZpZWxkVHdvLnZhbHVlKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH0gZWxzZSB7XG4gICAgICBwbGF5ZXJUd28uYmV0ID0gYmV0RmllbGRUd28udmFsdWU7XG4gICAgfVxuXG4gICAgY29uc3QgZXZlblR3byA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdldmVuVHdvJyk7XG4gICAgY29uc3QgdW5ldmVuVHdvID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3VuZXZlblR3bycpO1xuXG4gICAgaWYgKGV2ZW5Ud28uY2hlY2tlZCA9PT0gdHJ1ZSkge1xuICAgICAgcGxheWVyVHdvLmNob2ljZSA9ICdldmVuJztcbiAgICB9IGVsc2UgaWYgKHVuZXZlblR3by5jaGVja2VkID09PSB0cnVlKSB7XG4gICAgICBwbGF5ZXJUd28uY2hvaWNlID0gJ3VuZXZlbic7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBiZXRGaWVsZFR3by52YWx1ZSA9ICcnO1xuXG4gICAgYmV0VHdvLmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpO1xuXG4gICAgcGxheWVyVHdvLnJlYWR5ID0gdHJ1ZTtcblxuICAgIGlmIChib3RoUmVhZHkoKSkgcGxheVJvdW5kKCk7XG4gIH0pXG59XG5cbmZ1bmN0aW9uIHJlc29sdmVUdXJuKCkge1xuICBpZiAocGxheWVyT25lLnJvbGUgPT09ICdndWVzc2VyJykge1xuICAgIGlmIChwbGF5ZXJPbmUuY2hvaWNlID09PSBwbGF5ZXJUd28uY2hvaWNlKSB7XG4gICAgICBwbGF5ZXJPbmUuc2NvcmUgKz0gTnVtYmVyKHBsYXllck9uZS5iZXQpO1xuICAgICAgcGxheWVyVHdvLnNjb3JlIC09IE51bWJlcihwbGF5ZXJPbmUuYmV0KTtcbiAgICAgIHJvdW5kV2lubmVyID0gcGxheWVyT25lLm5hbWU7XG4gICAgICB3b25BbW91bnQgPSBwbGF5ZXJPbmUuYmV0O1xuICAgICAgb3V0Y29tZSA9ICdndWVzc2VkIGNvcnJlY3RseSc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBsYXllck9uZS5zY29yZSAtPSBOdW1iZXIocGxheWVyT25lLmJldCk7XG4gICAgICBwbGF5ZXJUd28uc2NvcmUgKz0gTnVtYmVyKHBsYXllck9uZS5iZXQpO1xuICAgICAgcm91bmRXaW5uZXIgPSBwbGF5ZXJUd28ubmFtZTtcbiAgICAgIHdvbkFtb3VudCA9IHBsYXllck9uZS5iZXQ7XG4gICAgICBvdXRjb21lID0gJ2hhcyBub3QgYmVlbiBmaWd1cmVkIG91dCc7XG4gICAgfVxuICB9IGVsc2UgaWYgKHBsYXllck9uZS5yb2xlID09PSAnaGlkZXInKSB7XG4gICAgaWYgKHBsYXllck9uZS5jaG9pY2UgPT09IHBsYXllclR3by5jaG9pY2UpIHtcbiAgICAgIHBsYXllck9uZS5zY29yZSAtPSBOdW1iZXIocGxheWVyVHdvLmJldCk7XG4gICAgICBwbGF5ZXJUd28uc2NvcmUgKz0gTnVtYmVyKHBsYXllclR3by5iZXQpO1xuICAgICAgcm91bmRXaW5uZXIgPSBwbGF5ZXJUd28ubmFtZTtcbiAgICAgIHdvbkFtb3VudCA9IHBsYXllclR3by5iZXQ7XG4gICAgICBvdXRjb21lID0gJ2d1ZXNzZWQgY29ycmVjdGx5JztcbiAgICB9IGVsc2Uge1xuICAgICAgcGxheWVyT25lLnNjb3JlICs9IE51bWJlcihwbGF5ZXJUd28uYmV0KTtcbiAgICAgIHBsYXllclR3by5zY29yZSAtPSBOdW1iZXIocGxheWVyVHdvLmJldCk7XG4gICAgICByb3VuZFdpbm5lciA9IHBsYXllck9uZS5uYW1lO1xuICAgICAgd29uQW1vdW50ID0gcGxheWVyVHdvLmJldDtcbiAgICAgIG91dGNvbWUgPSAnaGFzIG5vdCBiZWVuIGZpZ3VyZWQgb3V0JztcbiAgICB9XG4gIH1cbn0iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=