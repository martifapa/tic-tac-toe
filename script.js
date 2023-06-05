// elements
const gameContainer = document.querySelector('.game');
const popup = document.getElementById('winner-popup');
const playerXScore = document.getElementById('player-x');
const playerOScore = document.getElementById('player-o');
const winnerMessage = document.getElementById('winner-message');
const resetRound = document.getElementById('reset-round-btn');
const resetScores = document.getElementById('reset-scores-btn');

// event listeners
resetRound.addEventListener('click', () => GameBoard.resetRound());
resetScores.addEventListener('click', () => GameBoard.resetScores());

// UI functions
const toggleGridButtons = () => {
    gameContainer.style.pointerEvents == 'none' ? gameContainer.style.pointerEvents = 'auto' : gameContainer.style.pointerEvents = 'none';
};

const toggleWinnerPopup = (gameOver, winner) => {
    popup.style.opacity == 1 ? popup.style.opacity = 0 : popup.style.opacity = 1;
    popup.style.pointerEvents == 'auto' ? popup.style.pointerEvents = 'none' : popup.style.pointerEvents = 'auto';
    popup.style.opacity == 1 ? gameContainer.style.filter = 'blur(8px)' : gameContainer.style.filter = 'none';

    if (winner && gameOver) {
        winnerMessage.textContent = `Player ${winner} wins this round!`;
    } else if (!winner && gameOver) {
        winnerMessage.textContent = "Seems like it's a draw";
    }
    resetRound.textContent == 'Reset Round' ? resetRound.textContent = 'Next Round' : resetRound.textContent = 'Reset Round';
}

const displayBoard = (boardRows, parentElement) => {
    rows = 3;

    for (let i = 0; i < rows**2; i++) {
        const square = document.createElement('button');
        square.setAttribute('data-index', i);
        square.classList.add('square');
        square.addEventListener('click', () => GameBoard.playRound(i));
        parentElement.appendChild(square);
    }
    parentElement.style.pointerEvents = 'auto';
};

const updateScores = (winner) => {
    if (winner === 'x') {
        const score = parseInt(playerXScore.textContent) + 1;
        playerXScore.textContent = score;
    } else {
        const score = parseInt(playerOScore.textContent) + 1;
        playerOScore.textContent = score;
    }
}

// GAME LOGIC
const User = (chosenMarker) => {
    let marker = chosenMarker;
    let score = 0;
    const getMarker = () => marker;
    const setScore = () => score++;
    const getScore = () => score;
    return {
        getMarker,
        setScore,
        getScore
    }
}

const GameBoard = (() => {
    let board = [];
    let rows = 3;
    let round = 0;
    let isOver = false;

    const displayBoard = (boardRows, parentElement) => {
        rows = 3;

        for (let i = 0; i < rows**2; i++) {
            const square = document.createElement('button');
            square.setAttribute('data-index', i);
            square.classList.add('square');
            square.addEventListener('click', () => playRound(i));
            parentElement.appendChild(square);
        }
        parentElement.style.pointerEvents = 'auto';
    };
    displayBoard(3, gameContainer); //initialization

    const resetRound = () => {
        board = [];
        rows = 0;
        round = 0;
        if (isOver) {
            toggleWinnerPopup(winner=false, isOver);
            isOver = false;
            resetRound.textContent = 'Reset round';
        }
        gameContainer.replaceChildren();
        displayBoard(3, gameContainer);
        
    }

    const resetScores = () => {
        resetRound();
        playerXScore.textContent = 0;
        playerOScore.textContent = 0;
    }

    const playRound = (idx) => {
        const currentMarker = round % 2 === 0 ? 'x' : 'o';
        const write = writeCell(idx, currentMarker);
        if (write) { // write cell was succesful
            round++;
            const roundResult = evaluateGame(currentMarker);
            if (roundResult || round === 9) { // win game
                isOver = true;
                toggleGridButtons();
                const winner = round === 9 ? false : currentMarker;
                toggleWinnerPopup(isOver, winner);
                if (winner) updateScores(winner)
            }
        }        
    }

    const evaluateGame = (currentMarker) => {
        const colResults = [];
        for (let i = 0; i < rows; i++) { // check columns
            const column = [];
            for (let j = 0; j < rows; j++) {
                let idx = j * rows + i;
                column.push(board[idx]);
            }
            colResults.push(column.every(v => v === currentMarker));
        }

        const rowResults = [];
        for (let i = 0; i < rows; i++) {  // check rows
            const row = [];
            for (let j = 0; j < rows; j++) {
                let idx = i * rows + j;
                row.push(board[idx]);
            }
            colResults.push(row.every(v => v === currentMarker));
        }

        const diagResults = [];
        const diagonalRight = [];
        for (let i = 0; i < rows; i++) {  // left-2-right
            let idx = i * rows + i;
            diagonalRight.push(board[idx]);
        }
        diagResults.push(diagonalRight.every(v => v === currentMarker));

        const diagonalLeft = [];
        for (let i = rows; i > 0; i--) { // right-2-left
            let idx = (rows - 1) * i;
            diagonalLeft.push(board[idx]);
        }
        diagResults.push(diagonalLeft.every(v => v === currentMarker));
        
        return colResults.concat(rowResults, diagResults).some(v => v == true);
        
    };

    const writeCell = (idx, currentMarker) => {
        if (!board[idx] && idx < rows**2) {
            board[idx] = currentMarker;
            document.querySelector(`[data-index='${idx}']`).textContent = currentMarker;
            return true
        }
    };

    return {
        displayBoard,
        playRound,
        resetRound,
        resetScores
    };
})();