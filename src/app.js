//Integration with Firebase live database

import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, set, onDisconnect, onValue, onChildAdded, onChildRemoved } from "firebase/database";
import { gameController } from "./app";

const randomFromArray = (array) => {
  return array[Math.floor(Math.random() * array.length)];
}

const createName = () => {
  const prefix = randomFromArray([
    'Cool', 'Hot', 'Pretty', 'Awesome', 'Dope', 'Buff', 'Chad'
  ]);
  const animal = randomFromArray([
    'Bear', 'Tiger', 'Lion', 'Panda', 'Platypus', 'Wolf', 'Koala'
  ]);
  return `${prefix} ${animal}`;
}

const firebaseConfig = {
  apiKey: "AIzaSyA1fEKzumxfEEhc_hLXZYdMZOuL1IX3k3o",
  authDomain: "marbles-multiplayer.firebaseapp.com",
  databaseURL: "https://marbles-multiplayer-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "marbles-multiplayer",
  storageBucket: "marbles-multiplayer.appspot.com",
  messagingSenderId: "817512452155",
  appId: "1:817512452155:web:fc7e3feea4132c007d8c1e"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);


(function () {

  let playerId;
  let playerRef;
  let playerElements = {};
  let addedPlayer;

  const initGame = () => {
    const allPlayersRef = ref(database, `players`);
    const viewersList = document.getElementById('viewersList');

    //fire when change occurs
    onValue(allPlayersRef, (snapshot) => {
      
    })

    //fire when a new node is added to the tree
    onChildAdded(allPlayersRef, (snapshot) => {
      addedPlayer = snapshot.val();

      const nameOne = document.querySelector('.name.one');

      const playerName = document.createElement('div');
      playerName.classList.add('playerName');
      if (addedPlayer.id === playerId) {
        playerName.classList.add('you');
      }
      playerName.innerHTML = `${addedPlayer.name}`;
      viewersList.appendChild(playerName);
      playerElements[addedPlayer.id] = playerName;

      
    })
    
    //removes player name from dom when player leaves
    onChildRemoved(allPlayersRef, (snapshot) => {
      const removedKey = snapshot.val().id;
      viewersList.removeChild(playerElements[removedKey]);
      delete playerElements[removedKey]
    })
  }

  signInAnonymously(auth).catch((error) => {
    let errorCode = error.code;
    let errorMessage = error.message;
    console.log(errorCode, errorMessage);
  });

  onAuthStateChanged(auth, (user) => {
    if (user) {
      playerId = user.uid;
      playerRef = ref(database, `players/${playerId}`);

      const name = createName();

      set(playerRef, {
        id: playerId,
        name,
      });

      onDisconnect(playerRef).remove();

      initGame();
    } else {
      //logged out
    }
  })

  const score = document.getElementById('score');

  function createLeaveOne() {
    const leave = document.createElement('button');
    leave.innerHTML = 'Leave 1';
    score.appendChild(leave);

    leave.addEventListener('click', () => {
      score.removeChild(leave);
      
      set(playerOneReady, false);
      set(playerOneId, '');
    });
  }

  function createLeaveTwo() {
    const leave = document.createElement('button');
    leave.innerHTML = 'Leave 2';
    score.appendChild(leave);

    leave.addEventListener('click', () => {
      score.removeChild(leave);
      
      set(playerTwoReady, false);
      set(playerTwoId, '');
    });
  }

  function createReadyOne(playerNum) {
    const ready = document.createElement('button');
    ready.innerHTML = 'Ready 1';
    ready.classList.add('readyOne')
    score.appendChild(ready);

    ready.addEventListener('click', () => {

      set(playerOneReady, true);
      set(playerOneId, addedPlayer.id);

      createLeaveOne();
    })
  }

  function createReadyTwo(playerNum) {
    const ready = document.createElement('button');
    ready.innerHTML = 'Ready 2';
    score.appendChild(ready);

    ready.addEventListener('click', () => {
      score.removeChild(ready);

      set(playerTwoReady, true);
      set(playerTwoId, addedPlayer.id);

      createLeaveTwo();
    })
  }


  const playerOneReady = ref(database, 'readyPlayers/playerOne/ready');
  const playerTwoReady = ref(database, 'readyPlayers/playerTwo/ready');
  const playerOneId = ref(database, 'readyPlayers/playerOne/id')
  const playerTwoId = ref(database, 'readyPlayers/playerTwo/id')


  onValue(playerOneReady, (snapshot) => {
    const data = snapshot.val();
    console.log(data)
    if (data === false) {
      createReadyOne();
    } else if (data === true) {
      const readyOne = document.querySelector('.readyOne');
      score.removeChild(readyOne);
    }
  })

  onValue(playerTwoReady, (snapshot) => {
    const data = snapshot.val();
    console.log(data)
    if (data === false) {
      createReadyTwo();
    } else if (data === true) {
      
    }
  })


  //Set joined person as playerOne or playerTwo
  

  
})();







