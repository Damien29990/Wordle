const numberOfRound = 6;
let roundRemaining = numberOfRound; // Count remain round
let currentGuess = []; // Temporary input array
let nextLetter = 0; //Count number of next key input
let answer = '' // answer from server

const url = "http://localhost:3005"

// Generate the game board
function initBoard() {
    let board = document.getElementById("attemptboard");

    for (let i = 0; i < numberOfRound; i++) {
        let row = document.createElement("div")
        row.className = "attemptblock"

        for (let j = 0; j < 5; j++) {
            let box = document.createElement("div")
            box.className = "wordblock"
            row.appendChild(box) //Link the row of word with board by children and parent method
        }

        board.appendChild(row) //Link the word block with row by children and parent method
    }
}

initBoard()
getanswer()

// Operate a eventlistener for any keyboard movement for input
document.addEventListener("keyup", (e) => {

    // No round leave stop
    if (roundRemaining === 0) {
        return
    }

    let pressedKey = String(e.key)
    console.log(pressedKey)
    if (pressedKey === "Backspace" && nextLetter !== 0) {
        deleteLetter()
        return
    }

    if (pressedKey === "Enter") {
        fetchguess()
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

    let row = document.getElementsByClassName("attemptblock")[6 - roundRemaining]
    let box = row.children[nextLetter]
    box.textContent = pressedKey.toUpperCase()
    box.classList.add("filled-box")
    currentGuess.push(pressedKey)
    nextLetter += 1

    console.log(currentGuess)

}

// Delete the letter in the word block
function deleteLetter(){
    if (nextLetter === 0){
        return
    }

    let row = document.getElementsByClassName("attemptblock")[6 - roundRemaining]
    let box = row.children[nextLetter - 1]
    box.textContent = ""
    box.classList.remove("filled-box")
    currentGuess.pop()
    nextLetter -= 1
}

let guess = currentGuess.join("")

// Display the result from server
function resultadjustment(resultarray){
    let row = document.getElementsByClassName("attemptblock")[6 - roundRemaining]

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

// Reset game
 function resetgame(){
    roundRemaining = numberOfRound;
    currentGuess = [];
    nextLetter = 0;    
    deleteBoard()
    initBoard()
    
    fetch(url + "/reset", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            action: 'reset'
        })
    })
    .then(response => {
        if (response.ok) {
            console.log('Reset request sent successfully');
            getanswer()
        } else {
            console.error('Failed to send reset request');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Delete previous board
function deleteBoard(){
    let board = document.getElementById("attemptboard");

    while(board.firstChild){
        board.removeChild(board.firstChild)
    }
}

// Fetch the guess to server for vaildation and checking result
async function fetchguess(){

    const response = await fetch(url + '/guess', {
    method: 'POST',
    mode: "cors", 
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ answer: currentGuess }),
});

const data = await response.json();
console.log(data.result)

if (data.valid) {
    resultadjustment(data.result)

    if (data.result.every(value => value === 'H')) {
        alert("You Win!!!")
        return
    }
    else if (roundRemaining == 1) {
        if (confirm(`You Lose~~ ${answer} \n YOu want to retry?`)) {
            resetgame()
          } else {
            return
          }
    } 
    else {
        roundRemaining -= 1; // One round passed
        currentGuess = [];
        nextLetter = 0;    
        // Normal round end reset all temporary variable
    }
}

else{
    alert("Invalid guess")
}
}

// Get the answer from server for final displayment to player
async function getanswer(){
    const response = await fetch(url + '/answer', {
        method: 'POST',
        mode: "cors", 
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answer: true }),
    });

    const data =  await response.json();
    answer = data.answer
    console.log(answer)

}