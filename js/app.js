/*-------------------------------- Constants --------------------------------*/

// A nested Array carrting the indicies of Winning Combinations
const winningCombos = [

    // Horizontal Winning Combos
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    // Vertical Winning Combos
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    // Diagonal Winning Combos
    [0, 4, 8],
    [2, 4, 6],

];

/*---------------------------- Variables (state) ----------------------------*/
let board;
let turn;
let winner;
let tie;

// Saving the wining 3 squares combination to update thier background to 'green' color
let saveWinningComobo = [];

/*------------------------ Cached Element References ------------------------*/
const squareEls = document.querySelectorAll('.sqr');
const messageEl = document.getElementById('message');
const boardEl = document.querySelector('.board');
const resetBtnEl = document.getElementById('reset');

// Additional Audio Effect Elements
const backSound = document.getElementById("backSound");
const tieSound = document.getElementById("tie");
const successSound = document.getElementById("success");
const dogSound = document.getElementById("dogSound");
const catSound = document.getElementById("catSound");

/*-------------------------------- Functions --------------------------------*/

// Used to update the board selected sequares and messages shown to the user
const render = () => {
    updateBoard();
    updateMessage();
}

/*Update the board by iterating through the board 9 elements
and change the inner text of each square to cat '😺' or dog '🐶'.
Also make sure to disable the pointer when hovering and clicking (active) 
on classes,using pointerEvents property. 
Reference to the property provided in the References Section (Ref.1 & Ref.8)*/
const updateBoard = () => {

    board.forEach((element, index) => {
        squareEls[index].innerText = element;
        if (element) squareEls[index].style.pointerEvents = 'none'
    });

}

/* 
Update Messages shown to the user
1- If winner and tie are false --> show a message Its 😺 or 🐶 turn
2- If winner is false and tie is true --> show a message "it's tie"
3- if else (by mean winner is true) --> show congrat message.
*/
const updateMessage = () => {

    if (!winner && !tie) {
        messageEl.innerHTML = `Its the <br/><br/><span style="font-size: 100px;">${turn}</span><br/><br/> turn`
    } else if (!winner && tie) {
        messageEl.innerHTML = 'Its a Tie!'
    } else {
        messageEl.innerHTML = `Congratulations!<br/><span style="font-size: 100px;">${turn}</span><br/> Won!`
    }

}

/*
Update the winning combination
if there is a winner where the saveWinningComobo array stores the winning combination
then here we add the classes to each wining square to animate the winning combination ('animate' class) and change thier background to 'green' ('winningCombo' class)
the pointsEvents used here also to disable the pointer when hovering or clicking
on a sqaure
*/
const updateWinningCombo = () => {
    // If no winner then return
    if (!winner) return

    squareEls.forEach((item, index) => {

        if (saveWinningComobo.includes(index)) {
            squareEls[index].classList.add("winningCombo");
            squareEls[index].classList.add('animate');
        }
        squareEls[index].style.pointerEvents = 'none'

    });
}

/*
Clear the wining combination when reseting
here we are removing the animate and winningCombo classes if already activating
when for the prvious round winner. Also we are return the pointer for each 
square to activate hovering and clicking effects.
We also need to clear the saveWinningComobo Array.
*/
const clearWinningCombo = () => {

    squareEls.forEach((item, index) => {
        if (squareEls[index].classList.contains("winningCombo"))
            squareEls[index].classList.remove("winningCombo");

        if (squareEls[index].classList.contains("animate"))
            squareEls[index].classList.remove("animate");

        squareEls[index].style.pointerEvents = 'auto'

    });

    saveWinningComobo = [];
}

// Check if there a tie, this done be checking the board Array if still
// Contains empty element '' out of the 9 total elements of the board Array.
const checkForTie = () => {
    if (winner) return
    if (!board.includes("")) tie = true;
}

// Refering to the WinningCombos Array, 
// We are checking if the board has any of those winning combinations
// Done in 3 steps, 
// 1- Check if [0] Element is not null, and
// 2- Element [0] = Element [1], and
// 3- Element [0] = Element [2], of the Wining Combinations 
// corresponding to the board elements.
const checkForWinner = () => {

    winningCombos.forEach(combo => {

        if (board[combo[0]] !== '' && board[combo[0]] == board[combo[1]] && board[combo[0]] == board[combo[2]]) {
            winner = true
            saveWinningComobo = combo;
        }

    });
}

// When the user clicks a square, that specific square id attribute will be pointed to, to add
// the current turn element 😺 or 🐶 to the board.
const placePiece = (index => {
    board[index] = turn;
});

// If turn variable is 😺 change it to 🐶 and vice versa, make sure to return when there
// is a winner.
const switchPlayerTurn = () => {
    if (winner) return

    if (turn === '🐶') {
        turn = '😺'
    }
    else {
        turn = "🐶"
    }

};

/*
Handle Sound Effects, tie, background, success, dog, and cat sounds
Play each based on the varaibles, tie, winner, and trun values.
*/
const playSoundEffects = () => {

    if (tie) tieSound.play()
    else if (winner) {
        backSound.pause() // Ref. 2
        successSound.play() // Ref.3 & Ref.9
    } else {

        if (turn === '😺') dogSound.play()
        else if (turn = "🐶") catSound.play()

    }

    // To make sure we start playing from begning of the sound file
    tieSound.currentTime = 0
    dogSound.currentTime = 0
    catSound.currentTime = 0
    successSound.currentTime = 0

}

// Callback Function for the boardEl Element which will handls the game 
// Logic in when the user click a square.
const handleClick = (e) => {

    // Only target the sqe classes another element clicked then return
    if (!e.target.classList.contains('sqr')) return;

    // Store the current target event element id
    const squareIndex = e.target.id;

    // Return if the current item has already been clicked 
    // (😺 or 🐶 are stored), also return when we have a winner to
    // not to accept clicks once we have a winner
    if (board[squareIndex] !== '') return
    if (winner) return

    // Call each explained functions hereabove, in sequence. 
    placePiece(squareIndex)
    checkForWinner()
    updateWinningCombo()
    checkForTie()
    switchPlayerTurn()
    playSoundEffects()
    render()
};

// Configure the backgrounds sound properties
const backSoundConfig = () => {
    backSound.volume = 0.5; // Ref.4
    backSound.currentTime = 0; // Ref.5
}

// Main Initailization function
// Called on load and when the user clicks 'Reset' button
const init = () => {
    board = ['', '', '', '', '', '', '', '', '']

    // Randmoize the initail selection cat or dog
    turn = ['🐶', '😺'][Math.floor(Math.random() * 2)] //Math.floor --> Ref.6
    //Math.random() --> Ref.7
    winner = false;
    tie = false;
    clearWinningCombo();
    backSoundConfig();
    render();
}

init();


/*----------------------------- Event Listeners -----------------------------*/
// The board click Event Listener calling the handleClick CallbackFunction
boardEl.addEventListener('click', handleClick)

// The Resent Button Event Listener calling the init callBackFunction.
resetBtnEl.addEventListener('click', init)

// Add the play() function for the background Sound in a mouseover listener
// as I've received, error --> play() failed because the user didn't interact with the document. Thus Using the listener solved the issue.
boardEl.addEventListener('mouseover', () => {

    if (!winner)
        backSound.play().catch(err => {

        });
    else backSound.pause()
});


/*----------------------------- References -----------------------------
1- https://developer.mozilla.org/en-US/docs/Web/CSS/pointer-events
2- https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause
3- https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play
4- https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/volume
5- https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/currentTime
6- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/floor
7- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
8- https://stackoverflow.com/questions/18826147/javascript-audio-play-on-click
9- https://www.w3schools.com/howto/howto_css_disable_text_selection.asp
*/