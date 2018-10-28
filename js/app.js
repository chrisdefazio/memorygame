//variables and constants
let moves = 0,
  stars = document.getElementsByClassName("stars")[0],
  //full star
  star = `<li><i class="fa fa-star"></i></li>`,
  //empty star
  starO = `<li><i class="fa fa-star-o"></i></li>`,
  stars1 = star + starO + starO,
  stars2 = star + star + starO,
  stars3 = star + star + star,
  //default rating 3stars
  rating = stars3,
  // holds open cards
  open = [],
  //holds matched cards
  matched = [],
  seconds = 0,
  //is the timer on?
  timeOn = 0,
  startGame = 1; //has the game started?

const lineBreak = "</br>",
  deck = document.querySelector(".deck"),
  movesTotal = document.querySelector("#moves"),
  restartButton = document.querySelector(".restart");
symbols = [
  "fa fa-diamond",
  "fa fa-diamond",
  "fa fa-paper-plane-o",
  "fa fa-paper-plane-o",
  "fa fa-anchor",
  "fa fa-anchor",
  "fa fa-bolt",
  "fa fa-bolt",
  "fa fa-cube",
  "fa fa-cube",
  "fa fa-leaf",
  "fa fa-leaf",
  "fa fa-bicycle",
  "fa fa-bicycle",
  "fa fa-bomb",
  "fa fa-bomb"
];

//start function
function start() {
  //shuffle card symbols
  shuffleArray(symbols);
  //usingdocumentFragment as discussed in lesson 23!
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < symbols.length; i++) {
    const card = document.createElement("li");
    card.classList.add("card");
    card.innerHTML = "<i class='" + symbols[i] + "'></i>";
    fragment.appendChild(card);
    click(card);
  }
  deck.appendChild(fragment);
}
//click listener
function click(card) {
  card.addEventListener("click", function() {
    //if startGame is true start timer and set startGame to false after first click
    if (startGame) {
      timeOn = 1;
      startGame = 0;
    }
    const card2 = this;
    const card1 = open[0];

    if (open.length === 1) {
      //if player has an open card already, run match check function

      card.classList.add("open", "show", "disable"); //disable class disables pointer-events!
      open.push(this);

      match(card2, card1);
    } else {
      // if player hasn't already opened a card, just push to open
      card2.classList.add("open", "show", "disable");
      open.push(this);
    }
  });
}

//match check function
function match(card2, card1) {
  if (card2.innerHTML === card1.innerHTML) {
    //if match exists, push to matched array
    card2.classList.add("match");
    card1.classList.add("match");

    matched.push(card2, card1);

    open = [];

    // Check if the game is over!
    winCheck();
  } else {
    //timeout for 200ms then hide cards
    setTimeout(function() {
      card2.classList.remove("open", "show", "disable");
      card1.classList.remove("open", "show", "disable");
    }, 200);

    open = [];
  }

  //update moves
  moveCount();
}

start();

restartButton.addEventListener("click", function() {
  restart();
});

//shuffle function from http://stackoverflow.com/a/2450976 updated to ES6 and optimized
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // randomize index
    [array[i], array[j]] = [array[j], array[i]]; // eslint-disable-line no-param-reassign
  }
  return array;
}

//move count function
function moveCount() {
  movesTotal.innerHTML = moves;
  moves++;

  //check player rating
  rate();
}

//function to check if player has won
function winCheck() {
  //if unmatched cards equals 0 display win message
  if (matched.length === 16) {
    timeOn = 0;
    let secondsAlert = seconds - 1;
    swal({
      title: "YOU WIN! PLAY AGAIN?",
      html:
        "Total moves: " +
        moves +
        lineBreak +
        " Rating: " +
        rating +
        lineBreak +
        " Time: " +
        secondsAlert,
      confirmButtonText: "Yep, one more!"
    }).then(result => {
      if (result.value) {
        document.location.reload();
      }
    });
  }
}

//function to control stars/rating
function rate() {
  if (moves > 12) {
    stars.innerHTML = stars2;
    rating = stars2;
  }
  if (moves > 20) {
    stars.innerHTML = stars1;
    rating = stars1;
  } else {
    rating = stars3;
  }
}

//function to restart game
function restart() {
  //using sweetalert2 library for prettier alerts
  swal({
    title: "Are you sure?",
    text: "You will lose your current progress!",
    type: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, restart!",
    cancelButtonText: "No, keep playing!",
    reverseButtons: true
  }).then(result => {
    if (result.value) {
      document.location.reload();
      startGame = 1;
    } else if (result.dismiss === swal.DismissReason.cancel) {
      swal("Cancelled", "Keep playing! 😊", "error");
    }
  });
}

//timer function
setInterval(timer, 1000); //sets timeout before incrementing seconds
function timer() {
  if (timeOn) {
    time.innerHTML = seconds;
    seconds++;
  }
}
