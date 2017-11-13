//Initial Settings
var flippedCards = [];
var cardIds = [];
var matchAttempt = 0;
var matched = 0;
var clockState = false;

/*
 * Create a list that holds all of your cards
 */
var cards = ['diamond', 'diamond', 'paper-plane', 'paper-plane', 'anchor', 'anchor', 'bolt', 'bolt', 'cube', 'cube', 'leaf', 'leaf', 'bicycle', 'bicycle', 'bomb', 'bomb'];
var sets = cards.length / 2;
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

//Resets the game
function setCards() {
	//Resets clock to start and clear count
	document.getElementById("timer").innerHTML = "00" + ":" + "00" + ":" + "00";
	clockState = false;
	//Resets cards
	matchAttempt = 0;
	document.getElementById('movesNumber').innerHTML = matchAttempt;
	matched = 0;
	var card = '';
	shuffle(cards);
	for (var i = 0; i < cards.length; i++) {
		card += '<li class="card" id="card_' + i + '" onclick="flipCard(this,\'' + cards[i] + '\')"></div>';
	}
	document.getElementById('board').innerHTML = card;
	//Resets star rating
	document.getElementById('star1').className = "fa fa-star";
	document.getElementById('star2').className = "fa fa-star";
	document.getElementById('star3').className = "fa fa-star";
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
	var currentIndex = array.length,
		temporaryValue, randomIndex;

	while (currentIndex !== 0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

function flipCard(card, val) {
	if (flippedCards.length < 2) {
		//Starts the timer when first card is flipped
		if (clockState == false){
			clockState = true;
			clearTimeout(timerStart);
			timerStart();
		}
		//Show cards on flip
		card.className += " open show";
		card.innerHTML = "<i class='fa fa-" + val + "'></i>";
		//Star Ratings
		var perfectVictory = cards.length / 2;
		if (matchAttempt > perfectVictory && matchAttempt < perfectVictory + 2 ) {
			document.getElementById('star3').className = "fa fa-star-o";
		} else if (matchAttempt > perfectVictory + 4 && matchAttempt < perfectVictory + 6) {
			document.getElementById('star2').className = "fa fa-star-o";
		}
		//Store flipped card
		if (flippedCards.length === 0) {
			flippedCards.push(val);
			cardIds.push(card.id);
			//Store second flipped card
		} else if (flippedCards.length == 1) {
			flippedCards.push(val);
			cardIds.push(card.id);
			//Check for match
			if (flippedCards[0] == flippedCards[1]) {
				document.getElementById(cardIds[0]).className = "card match";
				document.getElementById(cardIds[1]).className = "card match";
				flippedCards = [];
				cardIds = [];
				matched += 1;
				matchAttempt += 1;
				//Increment move count
				document.getElementById('movesNumber').innerHTML = matchAttempt;
				//Check for win condition
				if (matched == sets) {
					modal.style.display = "block";
					clockState = false;
					timerChange();
					var stars = document.getElementsByClassName("fa-star");
					document.getElementById("starsAtWin").innerHTML = stars.length;
					document.getElementById('movesAtWin').innerHTML = matchAttempt;
					document.getElementById('timeAtWin').innerHTML = document.getElementById("timer").innerHTML;
					clockState = false;
					// When the user clicks on button, close the modal
					playAgainButton.onclick = function() {
						modal.style.display = "none";
						setCards();
					};
				}
			} else {
				//Set unmatched cards back
				function cardReset() {
					document.getElementById(cardIds[0]).className = "card";
					document.getElementById(cardIds[1]).className = "card";
					flippedCards = [];
					cardIds = [];
					matchAttempt += 1;
					//Increment move count
					document.getElementById('movesNumber').innerHTML = matchAttempt;
				}
				//Flip wrong guess back over
				setTimeout(cardReset, 500);
			}
		}
	}
}
// Modal Functions
// Get the modal
var modal = document.getElementById('winModal');

// Get the button element that closes the modal
var playAgainButton = document.getElementById("playAgain");

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
	if (event.target == modal) {
		modal.style.display = "none";
		setCards();
	}
};
//Adds reset functionality to button
document.getElementById('restartButton').addEventListener("click", setCards);
// Timer function
function timerStart() {
	if (clockState) {
		var timer = document.getElementById("timer").innerHTML;
		var time = timer.split(":");
		var hour = time[0];
		var min = time[1];
		var sec = time[2];

		if (sec == 59) {
			if (min == 59) {
				hour++;
				min = 0;
				if (hour < 10) hour = "0" + hour;
			} else {
				min++;
			}
			if (min < 10) min = "0" + min;
			sec = 0;
		} else {
			sec++;
			if (sec < 10) sec = "0" + sec;
		}
		document.getElementById("timer").innerHTML = hour + ":" + min + ":" + sec;
		setTimeout(timerStart, 1000);
	}
}

// Pause and restart timer
function timerChange() {
	if (clockState === false) {
		clockState = true;
		timerStart();
	} else {
		clockState = false;
	}
}

//Initiates the functon on launch of game
setCards();
