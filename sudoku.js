let isAnimating = false;

function initGrid() {
    const table = document.getElementById('sudoku-grid');
    table.innerHTML = ''; // Clear the grid

    for (let row = 0; row < 9; row++) {
        const tr = document.createElement('tr');
        for (let col = 0; col < 9; col++) {
            const td = document.createElement('td');
            td.dataset.row = row; // Assign row attribute
            td.dataset.col = col; // Assign column attribute

            const input = document.createElement('input');
            input.type = 'text';
            input.maxLength = 1;
            input.onclick = () => highlightCell(row, col); // Add click listener
            input.oninput = () => {
                validateInput.call(input); // Validate current input
                checkConflicts(); // Check for conflicts dynamically
            };

            td.appendChild(input);
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
}


function isBoardSolved() {
    const grid = [];
    let isComplete = true;

    for (let row = 0; row < 9; row++) {
        grid[row] = [];
        for (let col = 0; col < 9; col++) {
            const input = document.querySelector(`td[data-row="${row}"][data-col="${col}"] input`);
            const value = parseInt(input.value);
            if (!value || value < 1 || value > 9) {
                isComplete = false; // Not all cells are valid
            }
            grid[row][col] = value;
        }
    }

    if (!isComplete) return false; // Grid is incomplete

    // Check for conflicts
    checkConflicts();
    const conflicts = document.querySelectorAll('.conflict');
    return conflicts.length === 0; // Return true if no conflicts
}

function highlightCell(row, col) {
    // Clear all previous highlights
    const tds = document.querySelectorAll('#sudoku-grid td');
    tds.forEach(td => td.classList.remove('highlight'));

    // Highlight the current row
    for (let c = 0; c < 9; c++) {
        const rowCell = document.querySelector(`td[data-row="${row}"][data-col="${c}"]`);
        if (rowCell) rowCell.classList.add('highlight');
    }

    // Highlight the current column
    for (let r = 0; r < 9; r++) {
        const colCell = document.querySelector(`td[data-row="${r}"][data-col="${col}"]`);
        if (colCell) colCell.classList.add('highlight');
    }

    // Highlight the 3x3 grid
    const boxRowStart = Math.floor(row / 3) * 3;
    const boxColStart = Math.floor(col / 3) * 3;
    for (let r = boxRowStart; r < boxRowStart + 3; r++) {
        for (let c = boxColStart; c < boxColStart + 3; c++) {
            const boxCell = document.querySelector(`td[data-row="${r}"][data-col="${c}"]`);
            if (boxCell) boxCell.classList.add('highlight');
        }
    }
}


function validateInput() {
    this.value = this.value.replace(/[^1-9]/g, '');
}

function clearGrid() {
    isAnimating = false; // Stop any ongoing animation

    // Clear all highlights
    const tds = document.querySelectorAll('#sudoku-grid td');
    tds.forEach(td => td.classList.remove('highlight'));

    const inputs = document.querySelectorAll('#sudoku-grid input');
    inputs.forEach(input => {
        input.value = '';
        input.disabled = false; // Enable all inputs
    });
}

function generatePuzzle(difficulty) {
    isAnimating = false; // Stop any ongoing animation
    document.querySelector('h1').textContent = 'Sudoku Solver'; // Reset header

    // Clear all highlights
    const tds = document.querySelectorAll('#sudoku-grid td');
    tds.forEach(td => td.classList.remove('highlight'));

    clearGrid(); // Clear existing grid

    const grid = generateRandomGrid(); // Generate a complete random Sudoku grid
    let squaresToRemove;

    // Set the number of cells to remove based on difficulty
    switch (difficulty) {
        case 'easy':
            squaresToRemove = 45; // Moderate number of blanks
            break;
        case 'medium':
            squaresToRemove = 55; // More blanks
            break;
        case 'hard':
            squaresToRemove = 60; // Maximum blanks
            break;
        default:
            squaresToRemove = 45;
    }

    const puzzleGrid = removeNumbers(grid, squaresToRemove); // Create the puzzle
    fillGrid(puzzleGrid); // Populate the grid with numbers
}



function fillGrid(grid) {
    const tds = document.querySelectorAll('#sudoku-grid td');
    tds.forEach(td => {
        const row = td.dataset.row;
        const col = td.dataset.col;
        const input = td.querySelector('input');
        const value = grid[row][col];
        if (value !== 0) {
            input.value = value;
            input.disabled = true; // Disable pre-filled cells
        } else {
            input.value = '';
            input.disabled = false; // Enable empty cells
        }
    });
}

function solveGrid() {
    if (isAnimating) return; // Prevent solving while an animation is running

    const grid = [];

    // Read the current grid
    for (let row = 0; row < 9; row++) {
        grid[row] = [];
        for (let col = 0; col < 9; col++) {
            const input = document.querySelector(`td[data-row="${row}"][data-col="${col}"] input`);
            const value = parseInt(input.value) || 0; // Default to 0 for empty cells
            grid[row][col] = value;
        }
    }

    // Solve the grid
    if (solveSudoku(grid)) {
        document.querySelector('h1').textContent = 'Congratulations!';
        animateSolution(grid); // Trigger animation for the solution
    } else {
        alert('No solution exists!');
    }
}

function generateRandomGrid() {
    let grid = Array.from({ length: 9 }, () => Array(9).fill(0));
    solveSudoku(grid);

    // Randomize rows, columns, and boxes for variation
    randomizeGrid(grid);
    return grid;
}

function randomizeGrid(grid) {
    for (let i = 0; i < 9; i++) {
        let box = Math.floor(i / 3) * 3;
        let row1 = box + Math.floor(Math.random() * 3);
        let row2 = box + Math.floor(Math.random() * 3);
        [grid[row1], grid[row2]] = [grid[row2], grid[row1]];
    }
    return grid;
}

function removeNumbers(grid, count) {
    let removedGrid = grid.map(row => row.slice());
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

function solveSudoku(grid) {
    let emptySpot = findEmpty(grid);
    if (!emptySpot) return true;

    let row = emptySpot[0];
    let col = emptySpot[1];

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
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (grid[i][j] === 0) return [i, j];
        }
    }
    return null;
}

function isValid(grid, num, pos) {
    let row = pos[0];
    let col = pos[1];

    for (let i = 0; i < 9; i++) {
        if (grid[row][i] === num && col !== i) return false;
        if (grid[i][col] === num && row !== i) return false;
    }

    let boxRow = Math.floor(row / 3) * 3;
    let boxCol = Math.floor(col / 3) * 3;

    for (let i = boxRow; i < boxRow + 3; i++) {
        for (let j = boxCol; j < boxCol + 3; j++) {
            if (grid[i][j] === num && (i !== row || j !== col)) return false;
        }
    }
    return true;
}

window.onload = function () {
    initGrid(); // Initialize the grid
    generatePuzzle('easy'); // Start in Easy mode by default
};


function checkConflicts() {
    const tds = document.querySelectorAll('#sudoku-grid td');
    tds.forEach(td => td.classList.remove('conflict')); // Clear previous conflicts

    const grid = [];
    for (let row = 0; row < 9; row++) {
        grid[row] = [];
        for (let col = 0; col < 9; col++) {
            const input = document.querySelector(`td[data-row="${row}"][data-col="${col}"] input`);
            grid[row][col] = input.value || null; // Null if the cell is empty
        }
    }

    // Check for conflicts in rows, columns, and 3x3 grids
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const value = grid[row][col];
            if (value) {
                // Check row conflict
                for (let c = 0; c < 9; c++) {
                    if (c !== col && grid[row][c] === value) {
                        document.querySelector(`td[data-row="${row}"][data-col="${col}"]`).classList.add('conflict');
                        document.querySelector(`td[data-row="${row}"][data-col="${c}"]`).classList.add('conflict');
                    }
                }

                // Check column conflict
                for (let r = 0; r < 9; r++) {
                    if (r !== row && grid[r][col] === value) {
                        document.querySelector(`td[data-row="${row}"][data-col="${col}"]`).classList.add('conflict');
                        document.querySelector(`td[data-row="${r}"][data-col="${col}"]`).classList.add('conflict');
                    }
                }

                // Check 3x3 grid conflict
                const boxRowStart = Math.floor(row / 3) * 3;
                const boxColStart = Math.floor(col / 3) * 3;
                for (let r = boxRowStart; r < boxRowStart + 3; r++) {
                    for (let c = boxColStart; c < boxColStart + 3; c++) {
                        if ((r !== row || c !== col) && grid[r][c] === value) {
                            document.querySelector(`td[data-row="${row}"][data-col="${col}"]`).classList.add('conflict');
                            document.querySelector(`td[data-row="${r}"][data-col="${c}"]`).classList.add('conflict');
                        }
                    }
                }
            }
        }
    }
}


function animateSolution(grid) {
    isAnimating = true; // Start the animation
    const tds = document.querySelectorAll('#sudoku-grid td');

    // Clear the board visually
    tds.forEach(td => {
        const input = td.querySelector('input');
        input.value = '';
    });

    // Animate filling the board
    let delay = 0; // Delay in milliseconds for each cell
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (!isAnimating) return; // Stop if animation is interrupted

            const td = document.querySelector(`td[data-row="${row}"][data-col="${col}"]`);
            const input = td.querySelector('input');
            const value = grid[row][col];

            setTimeout(() => {
                if (!isAnimating) return; // Stop if animation is interrupted
                input.value = value; // Fill the cell
                input.disabled = true; // Disable the input for solved cells
                td.classList.add('highlight'); // Optional highlight effect
                setTimeout(() => td.classList.remove('highlight'), 300); // Remove highlight after 300ms
            }, delay);

            delay += 100; // Increase delay for the next cell
        }
    }

    // Reset animation state after all cells are filled
    setTimeout(() => {
        isAnimating = false;
    }, delay);
}

