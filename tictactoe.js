// -------------------------------------------------------------------------------------------------
// JavaScript: tictactoe.js
// Author: Cornicon
// Purpose: TicTacToe lesson from the Odin Project
// -------------------------------------------------------------------------------------------------

function GameBoard(consoleLogging)
{
    // act as private fields inside of the object
    const rows = 3;
    const columns = 3;
    const board = [];
    let gameover = false;

    // Create a 2D array that will represent the state of the gameboard
    // Row 0 will represent the top row
    // Column 0 will represent the left-most column

    for (let i = 0; i < rows; i++)
    {
        board[i] = [];
        for (let j = 0; j < columns; j++)
        {
            board[i].push(Cell());
        }
    }

    // This will be the method of getting the entire board that our UI
    // will eventually need to render

    const  getBoard = () => board;

    const playSquare = (row, column, player) => {
        if(board[row][column].getValue() === 'open')
        {
            board[row][column].addToken(player);
            return true;
        }
        else
            return false;
    };

    const checkWinner = (player) => {
        for(let i = 0; i < 3; i++)
        {
            if(
                (board[i][0].getValue() === player.token &&
                board[i][1].getValue() === player.token &&
                board[i][2].getValue() === player.token)
                ||
                (board[i][0].getValue() === player.token &&
                board[i][1].getValue() === player.token &&
                board[i][2].getValue() === player.token)
            )
                gameover = true;
        }

        if(
            (board[0][0].getValue() === player.token &&
             board[1][1].getValue() === player.token &&
              board[2][2].getValue() === player.token)
              ||
              (board[0][2].getValue() === player.token &&
              board[1][1].getValue() === player.token &&
               board[2][0].getValue() === player.token)
        )
            gameover = true;

        return gameover;
    }

    const checkTie = () => {
        for (let i = 0; i < rows; i++)
        {
            for(let j = 0; j < columns; j++)
            {
                if(board[i][j].getValue() === 'open')
                    return gameover;
            }
        }
        gameover = true;
        return gameover;
    }

    const resetBoard = () => {
        for(let i = 0; i < rows; i++)
        {
            for(let j = 0; j < columns; j++)
            {
                board[i][j].addToken('open');
            }
        }
        gameover = false;
        if(consoleLogging)
        {
            printBoard();
            console.log(`The board has been reset successfully. Player 1, please select your move.`);
        }
    }

    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
        if(consoleLogging)
            console.log(boardWithCellValues);
    }

    return { getBoard, playSquare, printBoard, checkWinner, checkTie, resetBoard };
}

function Cell() {
    let value = 'open';

    // Accept a player's token to change the value of the cell
    const addToken = (player) => {
        value = player;
    }

    // How we retreive the current value of this cell through closure
    const getValue = () => value;

    return { addToken, getValue };
}

function GameController(playerOneName = "Player One", playerTwoName = "Player Two", consoleLogging = false) {
    const board = new GameBoard(consoleLogging);//Object.create(GameBoard);

    const players = [
        {
            name: playerOneName,
            token: 'X'
        },
        {
            name: playerTwoName,
            token: 'O'
        }
    ];

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer;

    printNewRound = () => {
        board.printBoard();
        if(consoleLogging)
            console.log(`${activePlayer.name}'s turn.`);
        // renderGameBoard(`${activePlayer.name}'s turn.`);
        renderGameBoard();
    };

    const renderGameBoard = () => {
        // let gameboardMessage = document.getElementById("gameboard-message");
        // gameboardMessage.textContent = message;

        const boardWithCellValues = board.getBoard().map((row) => row.map((cell) => cell.getValue()));
        for(let i = 0; i < 3; i++)
        {
            for(let j = 0; j < 3; j++)
            {
                let cell = document.getElementById(`cell-${i}${j}`);
                cell.textContent = boardWithCellValues[i][j];
            }
        }
    };

    this.handleCellClick = (event) => {
        const clickedCell = event.target;
        const row = clickedCell.dataset.row;
        const col = clickedCell.dataset.col;

        playRound(row, col);
    }

    const initializeGameBoardHTML = () => {
        const gameboard = document.querySelector("#gameboard");
        for(let i = 0; i < 3; i++)
        {
            for(let j = 0; j < 3; j++)
            {
                const cell = document.createElement("div");
                cell.classList.add("cell");
                cell.id = `cell-${i}${j}`;
                cell.dataset.row = i;
                cell.dataset.col = j;
                cell.addEventListener("click", this.handleCellClick);
                gameboard.appendChild(cell);
            }
        }
    }

    const playRound = (row, column) => {
        // Play active players token in the row, column
        let activePlayer = getActivePlayer();
        if(consoleLogging)
            console.log(`${activePlayer.name} played ${activePlayer.token} on ${row},${column}`);

        if(board.playSquare(row, column, activePlayer.token))
        {
            // Check if there is a winner
            if(board.checkWinner(activePlayer))
            {
                if(consoleLogging)
                    console.log(`${activePlayer.name} is the winner!`);
                // get new gameboard to start new game
                board.resetBoard();
                renderGameBoard();
                return;
            }
            else if(board.checkTie())
            {
                if(consoleLogging)
                    console.log("It's a tie");
                board.resetBoard();
                renderGameBoard();
                return;
            }

            // Switch Players Turn
            switchPlayerTurn();
            printNewRound();
        }
        else
            if(consoleLogging)
                console.log("That square was already taken. Please try again.");
    };

    // Initial Play Game Message
    initializeGameBoardHTML();
    renderGameBoard();
    printNewRound();

    return { playRound, getActivePlayer, renderGameBoard };
}

const game = GameController();