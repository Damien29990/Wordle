let answer = ["HELLO", "WORLD", "QUITE", "FANCY", "FRESH", "PANIC", "CRAZY", "BUGGY"]
let currentGuess= ["H","E","L","L","O"]

// let answer = [ 'FANCY', 'PANIC', 'CRAZY', 'BUGGY' ]
// let currentGuess = ["W","O","R","L","D"]

// let answer = [ 'FANCY', 'PANIC', 'BUGGY' ]
// let currentGuess = ["F","R","E","S","H"]

// let answer = [ 'PANIC', 'BUGGY' ]
// let currentGuess = ["C","R","A","Z","Y"]

// for (let i = 0; i< currentGuess.length; i++ ){
//     let poplist = answer
//     let templist = []
//     for(let j = 0; j < answer.length; j++){
//         console.log("Before pop: ", poplist)
//         let userinput =  currentGuess[i];
//         let word = poplist[j];
//         console.log(userinput, word);
        
//         if(word.includes(userinput)){
//             templist.push(word)
//             poplist.splice(j, 1)
//         }

//         if(poplist == []){
//             console.log("This is present")
//             poplist = templist
//         }

//         console.log("After pop: ", poplist)
//     }
//     console.log(poplist)
// }

let bigcheckedarray = []

for (let i = 0; i < answer.length; i++){
    bigcheckedarray.push(resultcheck(currentGuess,answer[i]))
    // console.log(bigcheckedarray)
}
console.log(checkallM(bigcheckedarray))

if (checkallM(bigcheckedarray)){
    answer = shortlist(bigcheckedarray,answer)
    console.log(answer)
}
else{
    selectcandidate(bigcheckedarray,answer)
    console.log(selectcandidate(bigcheckedarray,answer))
}

function resultcheck (userword,serverword){
    let checkedarray = [];

    for (let i = 0; i< serverword.length; i++ ){
        let user =  userword[i];
        let server = serverword[i];
 
        console.log(user, server);
 
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

function shortlist(resultarray, wordarray){
    for(let i = 0; i < resultarray.length; i++){
        if(!resultarray[i].every(value => value === 'M')){
            wordarray.splice(i,1)
        }
    }
    return wordarray;
}

function selectcandidate(resultarray, wordarray) {
    let tempanswer = ''
    let min = Infinity;
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