'use strict';
/*console.log(document.querySelector('.message').textContent);
document.querySelector('.message').textContent = '🧠Correct Number';
console.log(document.querySelector('.message').textContent);
document.querySelector('.number').textContent = 13;
document.querySelector('.score').textContent = 15;
console.log((document.querySelector('.guess').value = 23));*/

let secretNumber = Math.trunc(Math.random() * 30) + 1;
let score = 30;
let highscore = 0;
const displayMessage = function (message) {
  document.querySelector('.message').textContent = message;
};

document.querySelector('.check').addEventListener('click', function () {
  const guess = Number(document.querySelector('.guess').value);
  console.log(guess, typeof guess);

  // When there is no input
  if (!guess) {
    displayMessage('No Number');
  }
  // When player wins
  else if (guess === secretNumber) {
    document.querySelector('.number').textContent = secretNumber;
    displayMessage('✅You Got It');
    document.querySelector('body').style.backgroundColor = '#60b347';
    document.querySelector('.number').style.width = '30rem';
    if (score > highscore) {
      highscore = score;
      document.querySelector('.highscore').textContent = highscore;
    }
  } else if (guess !== secretNumber) {
    if (score > 1) {
      // document.querySelector('.message').textContent =
      //   guess > secretNumber ? 'Too high!' : 'Too low';
      displayMessage(guess > secretNumber ? '⏫Too high!' : '⏬Too low');
      score--;
      document.querySelector('.score').textContent = score;
    } else {
      displayMessage('❌You lost the game!');
      document.querySelector('body').style.backgroundColor = 'red';
      document.querySelector('.score').textContent = 0;
    }
  }
  // else if (guess > secretNumber) {
  //   if (score > 1) {
  //     displayMessage('Too high!');
  //     score--;
  //     document.querySelector('.score').textContent = score;
  //   } else {
  //     displayMessage('You lost the game!');
  //     document.querySelector('.score').textContent = 0;
  //   }
  //   // When player lose
  // } else if (guess < secretNumber) {
  //   if (score > 1) {
  //     displayMessage('Too low!');
  //     score--;
  //     document.querySelector('.score').textContent = score;
  //   } else {
  //     displayMessage('You lost the game!');
  //     document.querySelector('.score').textContent = 0;
  //   }
  // }
});
document.querySelector('.again').addEventListener('click', function () {
  secretNumber = Math.trunc(Math.random() * 30) + 1;
  score = 30;
  document.querySelector('.number').textContent = '?';
  displayMessage('Start guessing...');
  document.querySelector('.score').textContent = score;
  document.querySelector('body').style.backgroundColor = '#222';
  document.querySelector('.number').style.width = '15rem';
  document.querySelector('.guess').value = '';
});
