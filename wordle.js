// wordle.js

// ========== CONFIG ==========
let solution = "";             // The hidden 5-letter word (will be set dynamically)
let validWords = [];           // Holds all valid 5-letter words from five_letter.txt
const guessesAllowed = 6;      // 6 guesses total

// ========== LOAD WORD LIST AND PICK RANDOM WORD ==========
async function loadWordsAndSetSolution() {
  try {
    // Fetch the five_letter.txt file
    const response = await fetch("five_letter.txt");
    const wordsText = await response.text();
    // Split into an array of uppercase words
    validWords = wordsText.split("\n").map(word => word.trim().toUpperCase());
    // Choose a random word from this list as today's solution
    solution = validWords[Math.floor(Math.random() * validWords.length)];
    console.log("Today's solution:", solution); // For debugging
  } catch (error) {
    console.error("Error loading words:", error);
  }
}

// ========== GAME STATE ==========
let currentRow = 0;
let currentCol = 0;
let gameOver = false;

// ========== INITIALIZE GAME ==========
loadWordsAndSetSolution().then(() => {
  buildBoard();
  buildKeyboard();
});

// ========== BUILD THE BOARD ==========
function buildBoard() {
  const board = document.getElementById("board");
  for (let r = 0; r < guessesAllowed; r++) {
    const rowDiv = document.createElement("div");
    rowDiv.classList.add("row");
    rowDiv.style.display = "grid";
    rowDiv.style.gridTemplateColumns = "repeat(5, 60px)";
    rowDiv.style.gridGap = "5px";

    for (let c = 0; c < 5; c++) {
      const tile = document.createElement("div");
      tile.setAttribute("id", `row${r}-col${c}`);
      tile.classList.add("tile");
      rowDiv.appendChild(tile);
    }
    board.appendChild(rowDiv);
  }
}

// ========== BUILD THE KEYBOARD ==========
function buildKeyboard() {
  const row1 = document.getElementById("keyboard-row-1");
  const row2 = document.getElementById("keyboard-row-2");
  const row3 = document.getElementById("keyboard-row-3");

  const keysRow1 = ["Q","W","E","R","T","Y","U","I","O","P"];
  const keysRow2 = ["A","S","D","F","G","H","J","K","L"];
  const keysRow3 = ["Enter","Z","X","C","V","B","N","M","Del"];

  // Build row1
  keysRow1.forEach(key => {
    const button = createKeyButton(key);
    row1.appendChild(button);
  });

  // Build row2
  keysRow2.forEach(key => {
    const button = createKeyButton(key);
    row2.appendChild(button);
  });

  // Build row3
  keysRow3.forEach(key => {
    const button = createKeyButton(key);
    row3.appendChild(button);
  });
}

// Creates a <button> for a given key
function createKeyButton(letter) {
  const btn = document.createElement("button");
  btn.textContent = letter;
  btn.classList.add("key");
  if (letter === "Enter") btn.classList.add("enter");
  if (letter === "Del") btn.classList.add("del");
  btn.setAttribute("data-key", letter.toLowerCase());
  btn.addEventListener("click", handleScreenKeyboard);
  return btn;
}

// ========== ALLOW PHYSICAL KEYBOARD INPUT ==========
document.addEventListener("keydown", (e) => {
  if (gameOver) return;

  if (e.key === "Enter") {
    checkRow();
    return;
  }
  if (e.key === "Backspace" || e.key === "Delete") {
    deleteLetter();
    return;
  }
  if (/^[a-zA-Z]$/.test(e.key)) {
    addLetter(e.key.toUpperCase());
  }
});

// Screen keyboard clicks
function handleScreenKeyboard(e) {
  if (gameOver) return;
  const letter = e.target.getAttribute("data-key").toUpperCase();
  if (letter === "ENTER") {
    checkRow();
  } else if (letter === "DEL") {
    deleteLetter();
  } else {
    addLetter(letter);
  }
}

// ========== ADD / DELETE LETTERS ==========
function addLetter(letter) {
  if (currentCol < 5 && currentRow < guessesAllowed) {
    const tile = document.getElementById(`row${currentRow}-col${currentCol}`);
    tile.textContent = letter;
    currentCol++;
  }
}

function deleteLetter() {
  if (currentCol > 0) {
    currentCol--;
    const tile = document.getElementById(`row${currentRow}-col${currentCol}`);
    tile.textContent = "";
  }
}

// ========== CHECK THE GUESS ==========
function checkRow() {
  if (currentCol === 5) {
    // Gather letters from the current row
    const guessLetters = [];
    for (let c = 0; c < 5; c++) {
      const tile = document.getElementById(`row${currentRow}-col${c}`);
      guessLetters.push(tile.textContent);
    }
    const guessString = guessLetters.join("");

    // Check if guess is a valid word from five_letter.txt
    if (!validWords.includes(guessString)) {
      // Clear tiles if invalid
      for (let c = 0; c < 5; c++) {
        document.getElementById(`row${currentRow}-col${c}`).textContent = "";
      }
      alert("This might not be a legitimate word");
      currentCol = 0;
      return;
    }

    // If valid, evaluate the guess
    const result = evaluateGuess(guessString);

    // Flip/Color each tile
    for (let c = 0; c < 5; c++) {
      const tile = document.getElementById(`row${currentRow}-col${c}`);
      tile.classList.add(result[c]);
      colorKey(tile.textContent, result[c]);
    }

    // Check for win condition
    if (guessString === solution) {
      // Mark all tiles as correct
      for (let c = 0; c < 5; c++) {
        const tile = document.getElementById(`row${currentRow}-col${c}`);
        tile.classList.remove("absent", "present");
        tile.classList.add("correct");
      }
      alert("You guessed it!");
      gameOver = true;
    } else {
      // If not correct, move on or end game
      if (currentRow < guessesAllowed - 1) {
        currentRow++;
        currentCol = 0;
      } else {
        alert(`Game Over! The word was: ${solution}`);
        gameOver = true;
      }
    }
  }
}

// ========== EVALUATE GUESS LETTERS ==========
function evaluateGuess(guessString) {
  const result = Array(5).fill("absent");
  const solutionArray = solution.split("");

  // Mark correct letters
  for (let i = 0; i < 5; i++) {
    if (guessString[i] === solutionArray[i]) {
      result[i] = "correct";
      solutionArray[i] = null; 
    }
  }

  // Mark present letters
  for (let i = 0; i < 5; i++) {
    if (result[i] === "correct") continue;
    const indexInSolution = solutionArray.indexOf(guessString[i]);
    if (indexInSolution !== -1) {
      result[i] = "present";
      solutionArray[indexInSolution] = null;
    }
  }
  return result;
}

// ========== COLOR THE KEY ==========
function colorKey(letter, state) {
  const allKeys = document.querySelectorAll(".key");
  for (let btn of allKeys) {
    if (btn.textContent.toUpperCase() === letter) {
      // If already marked correct, do not downgrade it
      if (btn.classList.contains("correct")) return;

      // If currently present but now correct, upgrade it
      if (btn.classList.contains("present") && state === "correct") {
        btn.classList.remove("present");
        btn.classList.add("correct");
        return;
      }

      // Otherwise, set the new state
      if (!btn.classList.contains("correct")) {
        btn.classList.remove("absent", "present");
        btn.classList.add(state);
      }
      break;
    }
  }
}
