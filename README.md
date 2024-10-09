# Wordle
This project develop different game mode of wordle. 
The project is developed by node.js and normal html, css and javascript
Only words in the wordlist in word.js can be identitfy as legal guess. 

## How to start
- npm install
- operate a server (python server is used in development stage) python -m http.server
- start server.js
- open local host server and click main.html (main menu)
  
## Task 1 Normal Wordle
Score system:
- Hit: the letter is in the correct spot of answer. (Display in green)
- Present: the letter is in the answer but wrong spot. (Display in yellow)
- Miss: the letter is not in the answer. (Display in gray)
Player will have 6 rounds to guess the answer. Player identifly as lose after all rounds are used.

## Task 2 Server/client wordle
Score sytem is same with task 1
node.js is used to develop this mode.
Task 2 is merged in task 1 and task 4 for vaildate the input and random the answer.

## Task 3 Host cheating wordle
Score sytem is basically same with task 1.
The host will be cheated that no answer is selected at the beginning.
The words contain player's guesses will be removed and shortlisted.
Until there is an alphabet hitted or present all words in shortlist.
The answer would be the lowest points candidate, score system (hit = 3 points, present = 1 point).

## Task 4 Multi-player wordle
Score sytem is basically same with task 1.
Two players should come up a 5 letter words for other to guess. 
Player who first guess the answer correctly will win the game or who score higher marks will win after 6 rounds
#Score system:
- hit = 3 points * (7 - current round)
- present = 1 point * (7 - current round)
#Example: 2 hits & 1 present in round 2
-Total score = 2 * 3 * 5 + 1*5 = 35 points

#limitation
- words only allowed in the configured wordlist
- only the player who are inputting the answer for other player allowed to watch the screen
