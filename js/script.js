const guessedLettersBox = document.querySelector(".guessed-letters");
const guessButton = document.querySelector(".guess");
const letterInput = document.querySelector(".letter");
const wordInProgress = document.querySelector(".word-in-progress");
const remainingGuessesElement = document.querySelector(".remaining");
const remainingGuessesSpan = document.querySelector(".remaining span");
const message = document.querySelector(".message");
const playAgainButton = document.querySelector(".play-again");

const word = "awesome";
const guessedLetters = [];
const remainingGuesses = 8;

const getWord = async function() {
    const response = await fetch ("https://gist.githubusercontent.com/skillcrush-curriculum/7061f1d4d3d5bfe47efbfbcfe42bf57e/raw/5ffc447694486e7dea686f34a6c085ae371b43fe/words.txt");
    const words = await response.text();
    const wordArray = words.split("\n");
    const randomIndex = Math.floor(Math.random() * wordArray.length);
    word = wordArray[randomIndex].trim();
    placeholder(word);
};

//start game
getWord();

// display symbols as placeholders for the chosen words letters

const placeholder = function (word) {
    const placeholderLetters = [];
    for (const letter of word) {
    placeholderLetters.push("●");
    }
    wordInProgress.innerText = placeholderLetters.join("");
};


guessButton.addEventListener("click", function (e) {
    e.preventDefault();
    //empty mesaage paragraph
    message.innerText = "";
    //grab what was entered in the input
    const guess = letterInput.value;
    //make sure its a single letter
    const goodGuess = validateInput(guess);
  
    if (goodGuess) {
    //got a letter so lets guess
      makeGuess(guess);
    }
    letterInput.value = "";
  });


const validateInput = function(input) {
    const acceptedLetter = /[a-zA-Z]/;
    if (input.length === 0) {
    //is the input empty?
        message.innerText = "please enter A letter.";
    } else if (input.length > 1) {
    //did you type more than 1 letter?
        message.innerText = "Please enter a single letter.";
    } else if (!input.match(acceptedLetter)) {
    //did you type a non-letter?
        message.innerText = "Please enter a letter from A-Z.";
    } else {
    //finnaly got a single letter
        return input;
     }
    };

const makeGuess = function (guess) {
    guess = guess.toUpperCase();
    if (guessedLetters.includes(guess)) {
        message.innerText = "You already guessed that letter dumb dumb. Try again";
    } else {
        guessedLetters.push(guess);
        console.log(guessedLetters);
        updateGuessesRemaining(guess)
        showGuessedLetters();
        updateWordInProgress(guessedLetters);
    }
};

const showGuessedLetters = function () {
   //clear the list first
    guessedLettersBox.innerHTML = "";
for (const letter of guessedLetters) {
    const li = document.createElement("li");
    li.innerText = letter;
    guessedLettersBox.append(li);
    }
};

const updateWordInProgress = function (guessedLetters) {
    const wordUpper = word.toUpperCase();
    const wordArray = wordUpper.split("");
    const revealWord = [];
    for (const letter of wordArray) {
        if (guessedLetters.includes(letter)) {
            revealWord.push(letter.toUpperCase());
        } else {
            revealWord.push("●");
        }
    }
    wordInProgress.innerText = revealWord.join("");
    youWin();
};

const updateGuessesRemaining = function(guess) {
    const upperWord = word.toUpperCase();
    if (!upperWord.includes(guess)) {
        //bad guess lose a chance
        message.innerText = `Too bad sucka, the word has no ${guess}.`;
        remainingGuesses -= 1;
    } else {
        message.innerText = `Good guess! The word has the letter ${guess}.`;
    }

    if (remainingGuesses === 0) {
        message.innerHTML = `HA! you loser. Game over. The word was <span class="highlight">${word}</span>.`;
    } else if (remainingGuesses === 1) {
        remainingGuessesSpan.innerText = `${remainingGuesses} guess`;
    } else {
        remainingGuessesSpan.innerText = `${remainingGuesses} guesses`;
    }
};


const youWin = function() {
    if (word.toUpperCase() === wordInProgress.innerText) {
        message.classList.add("win");
        message.innerHTML = `<p class="highlight">It's about time you guessed the damn word! Congrats I guess...</p>`;
        
        startOver();
    }
};

const startOver = function() {
    guessButton.classList.add("hide");
    remainingGuessesElement.classList.add("hide");
    guessedLettersBox.classList.add("hide");
    playAgainButton.classList.remove("hide");
};

playAgainButton.addEventListener("click", function() {
    //reset all values - grab new word
message.classList.remove("win");
guessedLetters = [];
remainingGuesses = 8;
remainingGuessesSpan.innerText = `${remainingGuesses} guesses`;
guessedLettersBox.innerHtml = "";
message.innerText = "";
//grab new word
getWord();

//show the right ui element
guessButton.classList.remove("hide");f
playAgainButton.classList.add("hide");
remainingGuessesElement.classList.remove("hide");
guessedLettersBox.classList.remove("hide");
}); 