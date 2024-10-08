import { WORDS } from "./word.js";

import express from 'express';
import cors from 'cors';
const app = express();

app.use(cors());
app.use(express.json());

app.post('/guess', (req, res) => {
    const guess = req.body.answer;
    console.log('Received guess:', guess)

    if (!isValidGuess(guess)) {
        res.status(400).json({ valid: false, message: "Invalid guess. Please enter a 5-letter word." });
        return;
    }
    else{
        let result = checkanswer(guess)
        console.log(result)
        res.json({ valid: true, message: "Valid guess", result })
    }
});

let answer = WORDS[Math.floor(Math.random() * WORDS.length)];
console.log(answer);

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
    // return /^[a-zA-Z]{5}$/.test(guess);
}

function checkanswer(guess) {
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

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
