import { WORDS } from "./word.js";

const numberOfRound = 6;
let roundRemaining = numberOfRound;
let currentGuess = [];
let nextLetter = 0;
let answer = WORDS;
let wordlist = [...WORDS];
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
        console.log("This is WORD: ",wordlist)
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

    if (currentGuess.length != 5){
        alert("Not enought letters")
        return
    }


    if (!wordlist.includes(guess)){
        alert("The word not include in the list or not a word")
        return
    }

    let bigcheckedarray = []

    for (let i = 0; i < answer.length; i++){
        bigcheckedarray.push(resultcheck(currentGuess,answer[i]))
        // console.log(bigcheckedarray)
    }
    // console.log(checkallM(bigcheckedarray))
    
    if (checkallM(bigcheckedarray)){
        answer = shortlist(bigcheckedarray,answer)
        console.log("This is shortlisted answr: ",answer)
        resultdisplay(currentGuess,answer[0])

    }
    else{
        answer = selectcandidate(bigcheckedarray,answer)
        resultdisplay(currentGuess,answer)
        console.log("This selected candidate: ", answer)

    }

    if (guess === answer) {
        alert("You Win!!!")
        return
    }
    else if (roundRemaining == 1) {
        if (confirm(`You Lose~~  \n The answer is ${answer} \n You want to retry?`)) {
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

function resultcheck (userword,serverword){
    let checkedarray = [];

    for (let i = 0; i< serverword.length; i++ ){
        let user =  userword[i];
        let server = serverword[i];
 
        // console.log(user, server);
 
        if (serverword.includes(user)){
         if (user === server){
             checkedarray.push('H')
         }
         else{ checkedarray.push('P')}
        }
        else{ checkedarray.push('M')}
     }
    return checkedarray;
}

function checkallM(array) {
    return array.some(subArray => 
      subArray.length === 5 && 
      subArray.every(value => value === 'M')
    );
  }

function shortlist(resultArray, wordArray) {
    for (let i = resultArray.length - 1; i >= 0; i--) {
        if (!resultArray[i].every(value => value === 'M')) {
            wordArray.splice(i, 1);
        }
    }
    return wordArray;
}

function selectcandidate(resultarray, wordarray) {
    let tempanswer = ''
    let min = Infinity;
    if(typeof wordarray === 'string'){
        return wordarray
    }

    for (let i = 0; i < resultarray.length; i++){
        const countH = resultarray[i].filter(element => element === 'H').length;
        const countP = resultarray[i].filter(element => element === 'P').length;
        let count = countH*3 + countP*1
        console.log(count)
        if(count < min){
            min = count
            tempanswer = wordarray[i]
        }

    }
    
    return tempanswer
}

function resultdisplay(userword,serverword){
    let row = document.getElementsByClassName("attemptblock")[6 - roundRemaining]

    for (let i = 0; i< serverword.length; i++ ){
        let user =  userword[i];
        let server = serverword[i];
        let box = row.children[i]
 
        if (serverword.includes(user)){
         if (user === server){
             box.classList.add("hitbox")
         }
         else{ box.classList.add("presentbox")}
        }
        else{ box.classList.add("missbox")}
     }
}