import { WORDS } from "./word.js";

import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Task 1 setting
let wordlist = [...WORDS]
let answer = wordlist[Math.floor(Math.random() * WORDS.length)];
console.log(answer);

// Task 4 setting 
let playerA = []
let playerB = []

// API setting
app.post('/answer', (req,res) => {
    res.json({ answer })
})
app.post('/guess', (req, res) => {
    const guess = req.body.answer;
    console.log('Received guess:', guess)

    if (!isValidGuess(guess)) {
        res.status(400).json({ valid: false, message: "Invalid guess. Please enter a 5-letter word." });
        return;
    }
    else{
        let result = checkanswer(guess, answer)
        console.log(result)
        res.json({ valid: true, message: "Valid guess", result })
    }
});

app.post('/reset', (req, res) => {
        answer = wordlist[Math.floor(Math.random() * WORDS.length)];
        res.status(200).send('Reset successful');
    
})

// task 4 API 
app.post('/task4/input', (req, res) => {
    const input = req.body.input;
    const player = req.body.player === 0 ? 'playerA' : 'playerB';

    if (!isValidGuess(input)) {
        res.status(400).json({ valid: false, message: "Invalid Input. Please enter a 5-letter word." });
        return;
    }
    else {
        player === 'playerA' ? playerA = input : playerB = input
        res.status(200).json({ valid: true, message: `${player}, Input successful`})
    }
    console.log(playerA,playerB)
})

app.post('/task4/guess', (req, res) => {
    const guess = req.body.answer;
    const turn = req.body.turn;
    const round = req.body.round;
    console.log('Received guess:', guess)

    if (!isValidGuess(guess)) {
        res.status(400).json({ valid: false, message: "Invalid guess. Please enter a 5-letter word." });
        return;
    }
    else{
        let result = checkanswer(guess, (turn === "A" ? playerB : playerA))
        console.log(result)
        res.status(200).json({ valid: true, message: "Valid guess", score: calculatescore(round,result) ,result })
    }
});

// General functions

//check guess is legel
function isValidGuess(guess) {
    guess = guess.join("")
    if(guess.length < 5){
        console.log("This is length",guess.length)
        return false;
    }

    else if (!WORDS.includes(guess)){
        console.log("This is words",guess.length)
        return false;        
    }

    else{ return true; }
}

//provide result of guessing
function checkanswer(guess, answer) {
    let checkedarray = [];

    for (let i = 0; i< answer.length; i++ ){
        let user =  guess[i];
        let server = answer[i];
 
        console.log(user, server);
 
        if (answer.includes(user)){
         if (user === server){
             checkedarray.push('H')
         }
         else{ checkedarray.push('P')}
        }
        else{ checkedarray.push('M')}
     }
    return checkedarray;
}

//Task4 calculate players' score
function calculatescore(round, result){
    let totalscore = 0

        const countH = result.filter(element => element === 'H').length;
        const countP = result.filter(element => element === 'P').length;
        totalscore = round*countH*3 + countP*round;
    
    return totalscore
}

// Start the server
const port = 3005;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
