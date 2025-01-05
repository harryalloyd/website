/*******************************************
 * sudoku.js — complete file
 *******************************************/

// Tracks whether we’re currently animating (during "Solve")
let isAnimating = false;

// ========== 1) INITIALIZE THE GRID ON PAGE LOAD ==========
window.onload = function () {
    initGrid();             // Build the blank 9×9 table
    generatePuzzle('easy'); // Generate an initial Easy puzzle
};

// ========== 2) CREATE THE 9×9 <table> WITH INPUTS ==========
function initGrid() {
    const table = document.getElementById('sudoku-grid');
    table.innerHTML = ''; // Clear any existing rows

    for (let row = 0; row < 9; row++) {
        const tr = document.createElement('tr');
        for (let col = 0; col < 9; col++) {
            const td = document.createElement('td');
            td.dataset.row = row; // Store row index
            td.dataset.col = col; // Store col index

            const input = document.createElement('input');
            input.type = 'text';
            input.maxLength = 1;
            // Highlight row/col/box on click
            input.onclick = () => highlightCell(row, col);

            // Validate input is 1..9 and check conflicts
            input.oninput = () => {
                validateInput.call(input); 
                checkConflicts();
            };

            td.appendChild(input);
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
}

// ========== 3) GENERATE & FILL A NEW PUZZLE ==========
function generatePuzzle(difficulty) {
    isAnimating = false; // Stop any ongoing solve animation
    document.querySelector('h1').textContent = 'Sudoku Solver'; // Reset header

    // Clear highlights & grid
    const tds = document.querySelectorAll('#sudoku-grid td');
    tds.forEach(td => td.classList.remove('highlight'));
    clearGrid();

    // Generate a fully random solved grid
    const completeGrid = generateRandomGrid();

    // Based on difficulty, decide how many squares to remove
    let squaresToRemove;
    switch (difficulty) {
        case 'easy':
            squaresToRemove = 45;
            break;
        case 'medium':
            squaresToRemove = 55;
            break;
        case 'hard':
            squaresToRemove = 60;
            break;
        default:
            squaresToRemove = 45;
    }

    // Create the puzzle by removing some digits
    const puzzleGrid = removeNumbers(completeGrid, squaresToRemove);

    // Fill the HTML table with the puzzle
    fillGrid(puzzleGrid);
}

// ========== 4) GENERATE A COMPLETED RANDOM SUDOKU & RANDOMIZE ==========
function generateRandomGrid() {
    // Start with an empty 9×9 array of zeroes
    let grid = Array.from({ length: 9 }, () => Array(9).fill(0));

    // Solve it fully (fills in digits 1..9)
    solveSudoku(grid);

    // Randomize it in multiple valid ways
    randomizeGrid(grid);

    return grid;
}

/*************************************************************************
 * THE UPDATED “randomizeGrid” FUNCTION:
 * 1) Permute digits (1→7, 2→3, etc.)
 * 2) Swap entire row bands
 * 3) Swap entire column bands
 * 4) Swap rows within each band
 * 5) Swap columns within each band
 *************************************************************************/
function randomizeGrid(grid) {
  // 1) Randomly permute digits 1..9
  permuteDigits(grid);

  // 2) Randomly swap row bands (each band = 3 rows)
  for (let i = 0; i < 3; i++) {
    let band1 = Math.floor(Math.random() * 3);
    let band2 = Math.floor(Math.random() * 3);
    if (band1 !== band2) swapRowBands(grid, band1, band2);
  }

  // 3) Randomly swap column bands (each band = 3 columns)
  for (let i = 0; i < 3; i++) {
    let band1 = Math.floor(Math.random() * 3);
    let band2 = Math.floor(Math.random() * 3);
    if (band1 !== band2) swapColBands(grid, band1, band2);
  }

  // 4) Randomly swap rows within each 3-row band
  for (let band = 0; band < 3; band++) {
    let start = band * 3;
    let r1 = start + Math.floor(Math.random() * 3);
    let r2 = start + Math.floor(Math.random() * 3);
    if (r1 !== r2) swapRows(grid, r1, r2);
  }

  // 5) Randomly swap columns within each 3-column band
  for (let band = 0; band < 3; band++) {
    let start = band * 3;
    let c1 = start + Math.floor(Math.random() * 3);
    let c2 = start + Math.floor(Math.random() * 3);
    if (c1 !== c2) swapCols(grid, c1, c2);
  }

  return grid;
}

/*************************************************************************
 * HELPER FUNCTIONS FOR randomizeGrid
 *************************************************************************/

// (a) Digit permutation
function permuteDigits(grid) {
  // Create array [1..9] then shuffle
  const digits = [1,2,3,4,5,6,7,8,9];
  shuffleArray(digits);
  // Map each digit to a random digit
  const mapObj = {};
  for (let i = 0; i < 9; i++) {
    mapObj[i+1] = digits[i];
  }

  // Apply to the grid
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (grid[r][c] !== 0) {
        const oldVal = grid[r][c];
        grid[r][c] = mapObj[oldVal];
      }
    }
  }
}

// (b) Swap entire row bands
function swapRowBands(grid, band1, band2) {
  const start1 = band1 * 3;
  const start2 = band2 * 3;
  for (let i = 0; i < 3; i++) {
    swapRows(grid, start1 + i, start2 + i);
  }
}

// (c) Swap entire column bands
function swapColBands(grid, band1, band2) {
  const start1 = band1 * 3;
  const start2 = band2 * 3;
  for (let i = 0; i < 3; i++) {
    swapCols(grid, start1 + i, start2 + i);
  }
}

// (d) Swap two rows
function swapRows(grid, r1, r2) {
  [grid[r1], grid[r2]] = [grid[r2], grid[r1]];
}

// (e) Swap two columns
function swapCols(grid, c1, c2) {
  for (let r = 0; r < 9; r++) {
    [grid[r][c1], grid[r][c2]] = [grid[r][c2], grid[r][c1]];
  }
}

// (f) Fisher-Yates shuffle
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

/*************************************************************************
 * removeNumbers – removes “count” cells by setting them to 0
 *************************************************************************/
function removeNumbers(grid, count) {
    let removedGrid = grid.map(row => row.slice()); // copy
    while (count > 0) {
        let row = Math.floor(Math.random() * 9);
        let col = Math.floor(Math.random() * 9);
        if (removedGrid[row][col] !== 0) {
            removedGrid[row][col] = 0;
            count--;
        }
    }
    return removedGrid;
}

// ========== 5) FILL THE HTML TABLE WITH A GIVEN GRID ==========
function fillGrid(grid) {
    const tds = document.querySelectorAll('#sudoku-grid td');
    tds.forEach(td => {
        const row = td.dataset.row;
        const col = td.dataset.col;
        const input = td.querySelector('input');
        const value = grid[row][col];

        if (value !== 0) {
            input.value = value;
            input.disabled = true; // Pre-filled cell
        } else {
            input.value = '';
            input.disabled = false;
        }
    });
}

// ========== 6) CLEAR THE BOARD ==========
function clearGrid() {
    isAnimating = false; 
    const tds = document.querySelectorAll('#sudoku-grid td');
    tds.forEach(td => td.classList.remove('highlight'));

    const inputs = document.querySelectorAll('#sudoku-grid input');
    inputs.forEach(input => {
        input.value = '';
        input.disabled = false;
    });
}

// ========== 7) SOLVE THE CURRENT GRID ==========
function solveGrid() {
    if (isAnimating) return; // Avoid double-clicking Solve

    const grid = [];
    // Read from the DOM into a 2D array
    for (let row = 0; row < 9; row++) {
        grid[row] = [];
        for (let col = 0; col < 9; col++) {
            const input = document.querySelector(`td[data-row="${row}"][data-col="${col}"] input`);
            const value = parseInt(input.value) || 0; 
            grid[row][col] = value;
        }
    }

    // Solve in memory
    if (solveSudoku(grid)) {
        document.querySelector('h1').textContent = 'Congratulations!';
        animateSolution(grid); // Animate the reveal
    } else {
        alert('No solution exists!');
    }
}

// ========== 8) SUDOKU SOLVER LOGIC ==========
function solveSudoku(grid) {
    let emptySpot = findEmpty(grid);
    if (!emptySpot) return true; // No empty spots => solved

    let [row, col] = emptySpot;
    for (let num = 1; num <= 9; num++) {
        if (isValid(grid, num, [row, col])) {
            grid[row][col] = num;
            if (solveSudoku(grid)) return true;
            grid[row][col] = 0;
        }
    }
    return false;
}

function findEmpty(grid) {
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            if (grid[r][c] === 0) return [r, c];
        }
    }
    return null;
}

function isValid(grid, num, [row, col]) {
    // Row check
    for (let i = 0; i < 9; i++) {
        if (grid[row][i] === num && i !== col) return false;
    }
    // Column check
    for (let i = 0; i < 9; i++) {
        if (grid[i][col] === num && i !== row) return false;
    }
    // 3x3 box check
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let r = boxRow; r < boxRow + 3; r++) {
        for (let c = boxCol; c < boxCol + 3; c++) {
            if (grid[r][c] === num && (r !== row || c !== col)) return false;
        }
    }
    return true;
}

// ========== 9) HIGHLIGHT THE SELECTED ROW, COLUMN & BOX ==========
function highlightCell(row, col) {
    const tds = document.querySelectorAll('#sudoku-grid td');
    // Remove old highlights
    tds.forEach(td => td.classList.remove('highlight'));

    // Highlight row
    for (let c = 0; c < 9; c++) {
        const rowCell = document.querySelector(`td[data-row="${row}"][data-col="${c}"]`);
        if (rowCell) rowCell.classList.add('highlight');
    }

    // Highlight column
    for (let r = 0; r < 9; r++) {
        const colCell = document.querySelector(`td[data-row="${r}"][data-col="${col}"]`);
        if (colCell) colCell.classList.add('highlight');
    }

    // Highlight 3×3 box
    const boxRowStart = Math.floor(row / 3) * 3;
    const boxColStart = Math.floor(col / 3) * 3;
    for (let r = boxRowStart; r < boxRowStart + 3; r++) {
        for (let c = boxColStart; c < boxColStart + 3; c++) {
            const boxCell = document.querySelector(`td[data-row="${r}"][data-col="${c}"]`);
            if (boxCell) boxCell.classList.add('highlight');
        }
    }
}

// ========== 10) VALIDATE TYPED INPUT IS 1..9 ==========
function validateInput() {
    // Strip out anything that's not 1..9
    this.value = this.value.replace(/[^1-9]/g, '');
}

// ========== 11) CHECK FOR CONFLICTS (ROW, COL, BOX) ==========
function checkConflicts() {
    // Clear old conflicts
    const tds = document.querySelectorAll('#sudoku-grid td');
    tds.forEach(td => td.classList.remove('conflict'));

    // Build a 2D array from the DOM
    const grid = [];
    for (let row = 0; row < 9; row++) {
        grid[row] = [];
        for (let col = 0; col < 9; col++) {
            const input = document.querySelector(`td[data-row="${row}"][data-col="${col}"] input`);
            grid[row][col] = input.value || null;
        }
    }

    // Check each cell for duplicates in row/col/box
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const value = grid[row][col];
            if (value) {
                // Check row
                for (let c = 0; c < 9; c++) {
                    if (c !== col && grid[row][c] === value) {
                        markConflict(row, col, row, c);
                    }
                }
                // Check col
                for (let r = 0; r < 9; r++) {
                    if (r !== row && grid[r][col] === value) {
                        markConflict(row, col, r, col);
                    }
                }
                // Check 3x3 box
                const boxRowStart = Math.floor(row / 3) * 3;
                const boxColStart = Math.floor(col / 3) * 3;
                for (let rr = boxRowStart; rr < boxRowStart + 3; rr++) {
                    for (let cc = boxColStart; cc < boxColStart + 3; cc++) {
                        if ((rr !== row || cc !== col) && grid[rr][cc] === value) {
                            markConflict(row, col, rr, cc);
                        }
                    }
                }
            }
        }
    }
}

function markConflict(r1, c1, r2, c2) {
    document.querySelector(`td[data-row="${r1}"][data-col="${c1}"]`).classList.add('conflict');
    document.querySelector(`td[data-row="${r2}"][data-col="${c2}"]`).classList.add('conflict');
}

// ========== 12) ANIMATE THE SOLUTION (CELL-BY-CELL) ==========
function animateSolution(grid) {
    isAnimating = true;
    const tds = document.querySelectorAll('#sudoku-grid td');

    // Clear existing numbers visually
    tds.forEach(td => {
        td.querySelector('input').value = '';
    });

    let delay = 0;
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (!isAnimating) return; 
            const td = document.querySelector(`td[data-row="${row}"][data-col="${col}"]`);
            const input = td.querySelector('input');
            const value = grid[row][col];

            // Fill each cell with a slight delay
            setTimeout(() => {
                if (!isAnimating) return; 
                input.value = value;
                input.disabled = true;
                td.classList.add('highlight');
                setTimeout(() => td.classList.remove('highlight'), 300);
            }, delay);

            delay += 100; // 0.1s increment
        }
    }

    // After final cell
    setTimeout(() => {
        isAnimating = false;
    }, delay);
}
