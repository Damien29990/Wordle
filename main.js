const numberOfRound = 6;
let roundRemaining = numberOfRound;
let currentGuess = [];
let nextLetter = 0;
const url = "http://localhost:3003"
function initBoard() {
    let board = document.getElementById("attemptboard");

    for (let i = 0; i < numberOfRound; i++) {
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

initBoard()

document.addEventListener("keyup", (e) => {

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

    let found = pressedKey.match(/[a-z]/gi)
    if (!found || found.length > 1) {
        return
    } else {
        insertLetter(pressedKey)
    }
})

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
        } else {
            console.error('Failed to send reset request');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function deleteBoard(){
    let board = document.getElementById("attemptboard");

    while(board.firstChild){
        board.removeChild(board.firstChild)
    }
}

async function fetchguess(){

    const response = await fetch(url + '/guess', {
    method: 'POST',
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
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
        if (confirm("You Lose~~ \n YOu want to retry?")) {
            resetgame()
          } else {
            return
          }
    } 
    else {
        roundRemaining -= 1;
        currentGuess = [];
        nextLetter = 0;    
    }
}

else{
    alert("Invalid guess")
}

}