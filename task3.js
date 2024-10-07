import { WORDS } from "./word.js";

const numberOfRound = 6;
let roundRemaining = numberOfRound;
let currentGuess = [];
let nextLetter = 0;
let answer = WORDS;
console.log(answer);

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
        checkanswer()
        // fetchguess()
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
    box.textContent = pressedKey
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

function checkanswer(){

    let row = document.getElementsByClassName("attemptblock")[6 - roundRemaining]
    let guess = currentGuess.join("")
    console.log("This is Guess: ",guess)

    if (currentGuess.length != 5){
        alert("Not enought letters")
        return
    }


    if (!WORDS.includes(guess)){
        alert("The word not include in the list or not a word")
        return
    }

    for (let i = 0; i< currentGuess.length; i++ ){
        let templist = []
        for(let j = 0; j < answer.length; j++){
            let userinput =  currentGuess[i];
            let word = answer[j];
            console.log(userinput, word);
            
            if(word.includes(userinput)){
                templist.push(word)
                answer.splice(j, 1)
            }

            if(answer == []){
                console.log("This is present")
                answer = templist
            }
        }

    //    let user =  currentGuess[i];
    //    let server = answer[i];
    //    let box = row.children[i]

    //    if (answer.includes(user)){
    //     if (user === server){
    //         box.classList.add("hitbox")
    //     }
    //     else{ box.classList.add("presentbox")}
    //    }
    //    else{ box.classList.add("missbox")}
    }

    if (guess === answer) {
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
};
