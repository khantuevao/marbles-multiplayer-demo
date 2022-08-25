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