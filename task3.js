import { WORDS } from "./word.js";

const numberOfRound = 6;
let roundRemaining = numberOfRound; // Count remain round
let currentGuess = []; // Temporary input array
let nextLetter = 0; //Count number of next key input
let answer = WORDS;
let wordlist = [...WORDS]; // A copy of full list
// console.log(answer);

// Generate the game board
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

// Operate a eventlistener for any keyboard movement for input
document.addEventListener("keyup", (e) => {
    // No round leave stop
    if (roundRemaining === 0) {
        return
    }

    let pressedKey = String(e.key)
    // console.log(pressedKey)
    if (pressedKey === "Backspace" && nextLetter !== 0) {
        deleteLetter()
        return
    }

    if (pressedKey === "Enter") {
        checkanswer()
        // console.log("This is WORD: ",wordlist)
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
    box.textContent = pressedKey
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

    let row = document.getElementsByClassName("attemptblock")[6 - roundRemaining]
    let box = row.children[nextLetter - 1]
    box.textContent = ""
    box.classList.remove("filled-box")
    currentGuess.pop()
    nextLetter -= 1
}

//Start the flow of check answer
function checkanswer(){

    let row = document.getElementsByClassName("attemptblock")[6 - roundRemaining]
    let guess = currentGuess.join("")

    //Return input not enough letters
    if (currentGuess.length != 5){
        alert("Not enought letters")
        return
    }

    //Return input not in the word list
    if (!wordlist.includes(guess)){
        alert("The word not include in the list or not a word")
        return
    }

    let bigcheckedarray = [] //Set up a 2 dimension array

    for (let i = 0; i < answer.length; i++){
        bigcheckedarray.push(resultcheck(currentGuess,answer[i]))
        //Get all result comparing the input and word list
    }
    // console.log(checkallM(bigcheckedarray))
    
    if (checkallM(bigcheckedarray)){
        answer = shortlist(bigcheckedarray,answer)
        // console.log("This is shortlisted answr: ",answer)
        resultdisplay(currentGuess,answer[0])
    // If there a word not hit or present any alphabet by input (All miss)
    // Return one of result from the shortlisted list (All miss)
    }
    else{
        answer = selectcandidate(bigcheckedarray,answer)
        resultdisplay(currentGuess,answer)
        // console.log("This selected candidate: ", answer)
    
    // If there all word have alphabet hit or present by input 
    // Find out the lowest score candidate
    // Return the result of selected candidate

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

// Check the result between guess and wordlist 
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
    return checkedarray; // return a result array
}

// Check the a big array contain an array with five miss
function checkallM(array) {
    return array.some(subArray => 
      subArray.length === 5 && 
      subArray.every(value => value === 'M')
    );
  }

// shortlist the big array, remain the words never hit or present any aplhabet
function shortlist(resultArray, wordArray) {
    for (let i = resultArray.length - 1; i >= 0; i--) {
        if (!resultArray[i].every(value => value === 'M')) {
            wordArray.splice(i, 1);
        }
    }
    return wordArray; 
}

// Compare all candidate and select the lowest score
function selectcandidate(resultarray, wordarray) {
    let tempanswer = ''
    let min = Infinity; // Set infinity allow the first result must be minimum
    if(typeof wordarray === 'string'){
        return wordarray
    }

    for (let i = 0; i < resultarray.length; i++){
        const countH = resultarray[i].filter(element => element === 'H').length;
        const countP = resultarray[i].filter(element => element === 'P').length;
        let count = countH*3 + countP*1 // Every hit get 3 points, Every present get 1 point
        if(count < min){
            min = count
            tempanswer = wordarray[i] // save the temporary candidate
        }

    }
    
    return tempanswer //return the lowest sroce candidate
}

// Display the result with colors
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