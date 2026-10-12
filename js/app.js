/*-------------------------------- Constants --------------------------------*/

// This array contains all 8 possible winning combinations in Tic-Tac-Toe.
// Each inner array represents the index positions of 3 squares that must
// contain the same player's symbol (X or O) for that player to win.
//
// For example:
// [0, 1, 2] = Top horizontal row
// [0, 3, 6] = Left vertical column
// [0, 4, 8] = Diagonal from top-left to bottom-right
//
// We use 'const' because these winning combinations never change.

const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];


/*---------------------------- Variables (state) ----------------------------*/

// These variables track the current state of our game.
//
// 'board' stores the contents of all 9 squares.
// An empty string ('') means the square hasn't been played.
//
// 'turn' tracks which player is currently playing.
//
// 'winner' is a boolean (true or false) that tells us
// whether someone has won.
//
// 'tie' is also a boolean that tells us whether the game
// has ended in a draw.
//
// We use 'let' because these values will change during the game.

let board;
let turn;
let winner;
let tie;


/*------------------------ Cached Element References ------------------------*/

// These variables connect our JavaScript to elements in our HTML.
//
// querySelectorAll('.sqr') finds ALL elements with the class 'sqr'.
// It returns a NodeList containing our 9 squares.
//
// querySelector('#message') finds the element with id="message".
// We use this to display whose turn it is or who won.
//
// querySelector('.board') finds the board container.
// We use this to listen for clicks on the game board.
//
// querySelector('#reset') finds the reset button.
//
// We store these references in variables so we can reuse them
// without searching the HTML again every time.

const squareEls = document.querySelectorAll('.sqr');
const messageEl = document.querySelector('#message');
const boardEl = document.querySelector('.board');
const resetBtnEl = document.querySelector('#reset');


/*-------------------------------- Functions --------------------------------*/

// INITIALIZE THE GAME
//
// This function sets the game to its starting state.
//
// We create an array containing 9 empty strings to represent
// the 9 empty squares.
//
// We set the first player to 'X'.
//
// Both 'winner' and 'tie' start as false because
// nobody has won and the game hasn't ended.
//
// Finally, we call render() to display the starting game.
//
// We also reuse this function whenever the reset button is clicked.

function init() {
    board = ['', '', '', '', '', '', '', '', ''];
    turn = 'X';
    winner = false;
    tie = false;

    render();
}


// RENDER THE GAME
//
// This function updates what the user sees on the screen.
//
// Instead of placing all our display code in one function,
// we separate it into two smaller functions:
//
// updateBoard() updates the X and O symbols.
//
// updateMessage() updates the text above the board.
//
// This makes our code easier to organize and maintain.

function render() {
    updateBoard();
    updateMessage();
}


// UPDATE THE BOARD
//
// This function displays the contents of our 'board' array
// inside the 9 HTML squares.
//
// forEach() loops through each square element.
//
// 'sqr' represents the current HTML square.
//
// 'index' represents its position (0 through 8).
//
// We set the square's textContent to the matching value
// in our board array.
//
// For example:
// If board[0] contains 'X', square 0 will display X.
//
// If board[0] contains '', square 0 will appear empty.

/*----------------------------- Update Board -----------------------------*/

/*
This function updates the contents and styling of each square.

forEach() loops through all 9 squares.

sqr.textContent displays the X or O stored in the board array.

classList.toggle() adds or removes a CSS class
depending on whether the condition is true or false.

If board[index] contains X:
    Add the class "x".

If board[index] contains O:
    Add the class "o".

If the square is empty:
    Remove both classes.

This allows CSS to display X and O in different colors.

It also makes sure the colors reset correctly
when we restart the game.
*/

function updateBoard() {
    squareEls.forEach((sqr, index) => {

        sqr.textContent = board[index];

        sqr.classList.toggle('x', board[index] === 'X');

        sqr.classList.toggle('o', board[index] === 'O');

    });
}


// UPDATE THE MESSAGE
//
// This function decides what message to display.
//
// First, we check whether there is a winner.
// If there is, we display the winning player's symbol.
//
// If nobody won but the game ended in a tie,
// we display the tie message.
//
// Otherwise, the game is still running,
// so we display whose turn it is.
//
// We use template literals (` `) with ${turn}
// to insert the value of our turn variable into the message.

function updateMessage() {
    if (winner === true) {
        messageEl.textContent = `${turn} is the winner!`;

    } else if (tie === true) {
        messageEl.textContent = "It's a Tie!";

    } else {
        messageEl.textContent = `${turn}'s turn`;
    }
}


// HANDLE A PLAYER CLICKING A SQUARE
//
// This function runs whenever the player clicks the board.
//
// The 'event' parameter contains information about the click.
//
// event.target tells us which HTML element was clicked.
//
// First, we check that the clicked element has the class 'sqr'.
// If it doesn't, we stop the function using 'return'.
//
// Next, we get the id of the clicked square.
// Each square has an id from 0 to 8.
//
// Number() converts that id from a string into a number.
//
// Before allowing a move, we check:
// 1. Whether the square is already occupied.
// 2. Whether someone has already won.
// 3. Whether the game has ended in a tie.
//
// If any of these conditions are true, we stop the function.
//
// Otherwise, we:
// 1. Place the player's symbol.
// 2. Check whether the player won.
// 3. Check whether the game ended in a tie.
// 4. Switch turns if the game is still running.
// 5. Update the screen.

function handleClick(event) {

    if (!event.target.classList.contains('sqr')) return;

    const squareIndex = Number(event.target.id);

    if (board[squareIndex] !== '' || winner || tie) return;

    placePiece(squareIndex);
    checkForWinner();
    checkForTie();
    switchPlayerTurn();

    render();
}


// PLACE A PLAYER'S PIECE
//
// This function places the current player's symbol
// into the selected position of our board array.
//
// 'index' is the position of the square that was clicked.
//
// 'turn' contains either 'X' or 'O'.
//
// For example:
// If turn = 'X' and index = 4,
// board[4] becomes 'X'.
//
// The screen won't change immediately.
// The render() function will display the updated board.

function placePiece(index) {
    board[index] = turn;
}


// CHECK FOR A WINNER
//
// This function checks whether the current player has won.
//
// We use a for...of loop to go through every winning
// combination stored in our winningCombos array.
//
// Each 'combo' contains three board positions.
//
// Destructuring:
// const [a, b, c] = combo;
//
// This takes the three numbers from the array and
// stores them in separate variables.
//
// For example, if combo = [0, 1, 2]:
// a = 0, b = 1, c = 2
//
// We then check three conditions:
//
// 1. board[a] must not be empty.
// 2. board[a] must equal board[b].
// 3. board[a] must equal board[c].
//
// If all conditions are true, someone has won.
//
// We set winner to true and use 'return' to stop
// checking the remaining combinations.

function checkForWinner() {
    for (let combo of winningCombos) {

        const [a, b, c] = combo;

        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            winner = true;
            return;
        }
    }
}


// CHECK FOR A TIE
//
// A tie happens when all 9 squares are filled
// AND neither player has won.
//
// The every() method checks every element in the board array.
//
// It returns true only if EVERY square contains something.
//
// We also use !winner to ensure that a full board
// containing a winning combination isn't treated as a tie.
//
// For example:
// If every square contains X or O and winner is false,
// the game is a tie.

function checkForTie() {
    tie = !winner && board.every((cell) => cell !== '');
}


// SWITCH THE CURRENT PLAYER
//
// This function switches between player X and player O.
//
// We only switch turns if the game hasn't ended.
//
// !winner means nobody has won.
// !tie means the game hasn't ended in a draw.
//
// We use a ternary operator:
//
// condition ? valueIfTrue : valueIfFalse
//
// If turn is currently 'X', change it to 'O'.
// Otherwise, change it to 'X'.
//
// For example:
// turn = 'X' changes to 'O'.
// turn = 'O' changes to 'X'.

function switchPlayerTurn() {
    if (!winner && !tie) {
        turn = turn === 'X' ? 'O' : 'X';
    }
}


/*----------------------------- Event Listeners -----------------------------*/

// LISTEN FOR CLICKS ON THE BOARD
//
// addEventListener() tells JavaScript to run a function
// whenever a specific event happens.
//
// Here, we listen for 'click' events on the board.
//
// When a player clicks a square, handleClick() runs.
//
// We don't include parentheses after handleClick
// because we want it to run only when a click occurs,
// not immediately when JavaScript loads.

boardEl.addEventListener('click', handleClick);


// LISTEN FOR CLICKS ON THE RESET BUTTON
//
// When the reset button is clicked, init() runs again.
//
// This clears the board, sets the turn back to X,
// resets the winner and tie variables,
// and displays the starting game.

resetBtnEl.addEventListener('click', init);


// START THE GAME
//
// We call init() once when the page loads.
//
// This sets up the initial state and displays the game.
//
// Because our HTML loads app.js using 'defer',
// the HTML has already been parsed before this code runs.
//
// Therefore, we don't need an additional
// DOMContentLoaded event listener.

init();