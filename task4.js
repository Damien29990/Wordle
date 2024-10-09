// Initial declaration
const numberOfRound = 6;
let roundRemaining = numberOfRound; // Count remain round
let currentGuess = []; // Temporary input array
let nextLetter = 0; //Count number of next key input
let playerA = ''    //Player A answer
let playerB = ''    //Player B answer
let playerA_score = 0
let playerB_score = 0
let A_result = []
let B_result = []
const url = "http://localhost:3005"

//Initial the board when window load
window.addEventListener('load', function() {
    if(checkInput() === 0){
        initanswer()
        updatescore()
        // console.log(A_result.length)
    }
});

//Update the score and player turn
function updatescore(){
    document.getElementById("scoreA").innerHTML = `Player A Score: ${playerA_score}`;
    document.getElementById("scoreB").innerHTML = `Player B Score: ${playerB_score}`;
    document.getElementById("playerturn").innerHTML = `Player ${checkturn()} Turn`;

}

//Ensure there no anyone answer in comfirm
function initanswer(){
    let text = document.getElementById("attemptboard_mainA");
    text.style.display = 'block';
    if (checkInput() === 0) {
        text.innerHTML = "Player A, Please input words for Player B to guess";
    } else {
        text.innerHTML = "Player B, Please input words for Player A to guess";
    }
    initBoard('A',1) //Provide one row for player A input answer
}

//Generate game board
function initBoard(id, rownumber) {
    let board = document.getElementById(`attemptboard_main${id}`);

    for (let i = 0; i < rownumber; i++) {
        let row = document.createElement("div")
        row.className = "attemptblock"

        for (let j = 0; j < 5; j++) {
            let box = document.createElement("div")
            box.className = "wordblock"
            row.appendChild(box)
        }

        board.appendChild(row)
    }
}

//Switch game board when other is finished
function switchBoard() {
    let boardA = document.getElementById("attemptboard_mainA");
    let boardB = document.getElementById("attemptboard_mainB");

    if (boardA.classList.contains("deactivate")) {
        boardA.classList.remove("deactivate");
        boardB.classList.add("deactivate");
    } else {
        boardB.classList.remove("deactivate");
        boardA.classList.add("deactivate");
    }
}

//Delete game board when needed
function deleteBoard(id){
    let board = document.getElementById(`attemptboard_main${id}`);

    while(board.firstChild){
        board.removeChild(board.firstChild)
    }
}

//Check current stage of two players' answer is inputted 
function checkInput() {
    if (playerA === '') {
        return playerB === '' ? 0 : 1;
    } else if (playerB === '') {
        return 1;
    } else {
        return 2;
    }
    //Return numbers to indicate current situation
}

//Check current turn
function checkturn(){
    if(A_result.length == B_result.length){
        return "A"
        //Using the length of recorded result of guesses 
    }
    else{ return "B"}
}
// Operate a eventlistener for any keyboard movement for input
document.addEventListener("keyup", (e) => {
    // No round leave stop
    if (roundRemaining === 0) {
        return
    }

    let pressedKey = String(e.key)
    if (pressedKey === "Backspace" && nextLetter !== 0) {
        deleteLetter()
        return
    }

    if (pressedKey === "Enter") {

    // If both confirmed normal guessing
        if(checkInput() === 2){
            fetchguess()
        }
        // If players' answer is not confirmed, fetch the input to server
        else if (checkInput() === 0){
            fetchinput(checkInput())
        }
        else if (checkInput() === 1){
            fetchinput(checkInput())
        }

        return
    }
    // Prevent other key input
    let found = pressedKey.match(/[a-z]/gi)
    if (!found || found.length > 1) {
        return
    } else {
        insertLetter(pressedKey)
    }
})

// Display the letter to the word block
function insertLetter (pressedKey) {
    if (nextLetter === 5) {
        return
    }
    pressedKey = pressedKey.toLowerCase()

    let row = document.getElementsByClassName("attemptblock")[getattemptrow()]
    let box = row.children[nextLetter]
    box.textContent = pressedKey.toUpperCase()
    box.classList.add("filled-box")
    currentGuess.push(pressedKey)
    nextLetter += 1

    // console.log(currentGuess)

}

// Delete the letter in the word block
function deleteLetter(){
    if (nextLetter === 0){
        return
    }

    let row = document.getElementsByClassName("attemptblock")[getattemptrow()]
    let box = row.children[nextLetter - 1]
    box.textContent = ""
    box.classList.remove("filled-box")
    currentGuess.pop()
    nextLetter -= 1
}

//Get current attempt row 
function getattemptrow(){
    if(checkInput() !== 2){
        return(6 - roundRemaining)
    }

    if(checkturn() === "A")
    {
        return (6 - roundRemaining)}  //Board A row start from 0 - 5
    else {return (12 - roundRemaining)} // Board B row start from 6 - 11
}

// Display the result from server
function resultadjustment(resultarray){
    let row = document.getElementsByClassName("attemptblock")[getattemptrow()]

    for(let i = 0; i <resultarray.length; i++){
        let box = row.children[i]

        if(resultarray[i] === "M"){
            box.classList.add("missbox")
        }
        else if(resultarray[i] === "P"){
            box.classList.add("presentbox")
        }
        else{box.classList.add("hitbox")}
    }

    
}

// Fetch the input to server for vaildation and confirm players' answer
async function fetchinput(number){

    const response = await fetch(url + '/task4/input', {
    method: 'POST',
    mode: "cors", 
    cache: "no-cache", 
    credentials: "same-origin",
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ input: currentGuess, player: number }),
});

const data = await response.json();

if (data.valid) {
    number === 0 ? playerA = currentGuess.join('') :  playerB = currentGuess.join('')

    deleteBoard('A') //delete input answer board
    currentGuess = []
    nextLetter = 0

    if (checkInput() == 1){
        initanswer()
        //If only player A's answer confirm, initial one more board for player B
        return
    }
    else{ initBoard('A',numberOfRound)
        initBoard('B',numberOfRound)
        return
        //Generate two game board
    }
}
else{
    alert("Invalid Input")
    return
}
}

// Fetch the guess to server for vaildation and checking result
async function fetchguess(){

    const response = await fetch(url + '/task4/guess', {
    method: 'POST',
    mode: "cors", 
    cache: "no-cache", 
    credentials: "same-origin",
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ answer: currentGuess, turn: checkturn(), round:roundRemaining }),
});

const data = await response.json();
// console.log("This is result",data.result)

if (data.valid) {
    resultadjustment(data.result) //Display the color of word blocks
    if(checkturn()  === "A"){
        A_result.push(data.result)
        playerA_score += data.score;
    } 
        else{
            B_result.push(data.result)
            playerB_score += data.score;
        }
    
    updatescore() //update score
    setTimeout(switchBoard, 2000); //Switch board with delay for showing animation
    // console.log(playerA_score,playerB_score)
    console.log(playerA,playerB)

    if (data.result.every(value => value === 'H')) {
        alert(checkturn()  === "B" ? "Player A Win!!!" : "Player B Win!!!")
        return
    }
    else if (roundRemaining === 1 && checkturn() === "A") {
        let player;
        if (playerA_score > playerB_score) {
            player = "Player A Win!!!";
        } else if (playerA_score < playerB_score) {
            player = "Player B Win!!!";
        } else {
            player = "It's a tie!";
        }
        
        if (confirm(`${player} \n Player A's answer is ${playerA} \n Player B's answer is ${playerB} \n You want to retry?`)) {
            window.location.reload();
          } else {
            return
          }
    } 
    else {
        if(checkturn() === "A"){
            roundRemaining -= 1;
            // Minus one if two player finish guessing
        }
        currentGuess = [];
        nextLetter = 0;    
    }
}

else{
    alert("Invalid guess")
}
}