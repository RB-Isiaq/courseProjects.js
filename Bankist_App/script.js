'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP
// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovement = function (movements, sort = false) {
  containerMovements.innerHTML = '';
  // .textContent = 0;

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? `deposit` : `withdrawal`;
    const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__value">${mov}€</div>
        </div>
  `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => mov + acc, 0);
  labelBalance.textContent = `${acc.balance} €`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes} €`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)} €`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(deposit => deposit >= 1)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumInterest.textContent = `${interest} €`;
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(first => first[0])
      .join('');
  });
};
createUsernames(accounts);
// console.log(accounts); // stw
// console.log(containerMovements.innerHTML);

const updateUI = function (acc) {
  // Display movements
  displayMovement(acc.movements);
  // Display balance
  calcDisplayBalance(acc);
  // Dislay summary
  calcDisplaySummary(acc);
};

// Event Handler
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  // Prevent form for submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and a welcome message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginUsername.blur();
    inputLoginPin.blur();

    // UPDATE UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';
  // Transfer happens if
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // UPDATE UI
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add the movement
    currentAccount.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    const i = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(i);
    // .indexOf(23)

    // Delete account
    accounts.splice(i, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

// The find Index method: returns the index of the found element

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovement(currentAccount.movements, !sorted);
  sorted = !sorted;
});

labelBalance.addEventListener('click', function () {
  const movementUI = Array.from(
    document.querySelectorAll('.movements__value'),
    el => Number(el.textContent.replace('€', ''))
  );

  console.log(movementUI);
  const movementUI2 = [...document.querySelectorAll('.movements__value')].map(
    el => Number(el.textContent.replace('€', ''))
  );
  console.log(movementUI2);
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

// ARRAY METHODS
// SLICE
// let arr = ['a', 'b', 'c', 'd', 'e'];

// // SLICE
// console.log(arr.slice(2));
// console.log(arr.slice(2, 4));
// console.log(arr.slice(-1));
// console.log(arr.slice(1, -2));
// console.log(arr.slice());
// console.log([...arr]);

// // SPLICE // mutates
// // console.log(arr.splice(2));
// console.log(arr.splice(-1));
// console.log(arr);
// arr.splice(1, 2); // b amd c are deleted
// console.log(arr);

// // REVERSE // mutates
// arr = ['a', 'b', 'c', 'd', 'e'];
// const arr2 = ['j', 'i', 'h', 'g', 'f'];
// console.log(arr2.reverse());
// console.log(arr2);

// // CONCAT
// const letters = arr.concat(arr2);
// console.log(letters);
// console.log([...arr, ...arr2]);

// // JOIN
// console.log(letters.join('-'));

// // includes , indexOF, shift, unshifft, push, pop
// console.log(letters.includes('x'));
// console.log(letters.indexOf('g'));

// // The at method
// const arr = [23, 11, 64];
// console.log(arr[0]);
// console.log(arr.at(0));

// // Getting the last array element
// console.log(arr[arr.length - 1]);
// console.log(arr.slice(-1)[0]);
// console.log(arr.at(-1));

// console.log('ridwan'.at(0));
// console.log('ridwan'.at(-1));

////////////////////////////
// // The forEach loop
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// // for (const movement of movements) {

// for (const [i, movement] of movements.entries()) {
//   if (movement > 0) {
//     console.log(`Movement ${i + 1}: You deposited ${movement}`);
//   } else {
//     console.log(`Movement ${i + 1}: You withdrew ${Math.abs(movement)}`);
//   }
// }

// console.log('-----FOREACH-----');
// movements.forEach(function (mov, i, arr) {
//   if (mov > 0) {
//     console.log(`Movement ${i + 1}: You deposited ${mov}`);
//   } else {
//     console.log(`Movement ${i + 1}: You withdrew ${Math.abs(mov)}`);
//   }
// });
// // 0: function(200)
// // 1: function(450)
// // 2: function(-400)

// // forEach on MAP
// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// console.log(currencies);
// currencies.forEach(function (value, key, map) {
//   console.log(`${key}: ${value}`);
// });
// // forEach on SET
// const currenciesUnique = new Set(['USD', 'GBP', 'EUR', 'EUR', 'GBP', 'USD']);
// console.log(currenciesUnique);
// currenciesUnique.forEach(function (value, _, map) {
//   console.log(`${value}: ${value}`);
// });

// The Map method
// const euroToUsd = 1.1;
// // const movementUSD = movements.map(function(mov) {
// //   return mov * euroToUsd
// // })
// const movementUSD = movements.map(mov => mov * euroToUsd);

// console.log(movements);
// console.log(movementUSD);

// const movementUSDfor = [];
// for (const mov of movements) movementUSDfor.push(mov * euroToUsd);
// console.log(movementUSDfor);

// const movementsDescriptions = movements.map(
//   (mov, i) =>
//     `Movement ${i + 1}: You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(
//       mov
//     )}`
// );
// console.log(movementsDescriptions);

// // THE Filter method
// const deposit = movements.filter(function (mov, i, arr) {
//   return mov > 0;
// });
// console.log(movements);
// console.log(deposit);

// const depositFor = [];
// for (const mov of movements) {
//   if (mov > 0) depositFor.push(mov);
// }
// console.log(depositFor);

// const withdrawals = movements.filter(mov => mov < 0);

// console.log(withdrawals);

// THE Reduce method
// console.log(movements);

// accumulator => SNOWBALL
// const balance = movements.reduce(function (acc, mov, i, arr) {
//   console.log(`ITERATION ${i}: ${acc} + ${mov} = ${acc + mov}`);
//   return acc + mov;
// }, 0);
// const balance = movements.reduce((acc, mov) => acc + mov, 0);
// console.log(balance);
// // for of
// let balance2 = 0;
// for (const sum of movements) balance2 += sum;
// console.log(balance2);

// Maximum value of the movement array
// const max = movements.reduce((acc, curr) => {
//   if (acc > curr) return acc;
//   else return curr;
// }, movements[0]);
// console.log(max);

// The chaining method PIPELINE
// const euroToUsd = 1.1;
// const totalDepositToUSD = movements
//   .filter(mov => mov > 0)
//   .map((mov, i, arr) => {
//     // console.log(arr); // to check for error, you can look at the resulting array
//     return mov * euroToUsd;
//   })
//   .reduce((acc, mov) => acc + mov, 0);

// console.log(totalDepositToUSD);
// // using reduce method only
// const totDeposit = movements.reduce((acc, mov) => {
//   return acc + (mov > 0 && mov * euroToUsd);
// }, 0);
// console.log(totDeposit);

// // The Find method
// const firstWithdrawal = movements.find(mov => mov < 0);
// console.log(movements);
// console.log(firstWithdrawal);

// console.log(accounts);

// const account = accounts.find(acc => acc.owner === 'Jessica Davis');
// console.log(account);

// let accountFor = {};
// for (const own of accounts) {
//   if (own.owner === 'Jessica Davis') {
//     accountFor = own;
//   }
// }
// console.log(accountFor);

// // The Some and every method
// // Equality
// console.log(movements.includes(-130));

// // Condition
// console.log(movements.some(mov => mov === -130));
// const anyDeposit = movements.some(mov => mov > 0);
// console.log(anyDeposit);

// // The every method
// console.log(movements.every(mov => mov > 0));
// console.log(account4.movements.every(mov => mov > 0));

// // True/False conditions
// const deposit = mov => mov > 0;
// console.log(movements.some(deposit));
// console.log(movements.every(deposit));
// console.log(movements.filter(deposit));

// // The flat method
// const arr = [
//   [1, 2, 3],
//   [4, 5, 6],
//   [7, 8, 9],
// ];
// console.log(arr.flat());

// const arrDeep = [
//   [1, 2],
//   [3, 4, [5, 6], [7, 8]],
//   [9, [0]],
// ];
// console.log(arrDeep.flat(2));

// const accountBalance = accounts
//   .map(acc => acc.movements)
//   .flat()
//   .reduce((acc, sum) => acc + sum, 0);
// console.log(accountBalance);

// // The flatMap method
// const accountBalance2 = accounts
//   .flatMap(acc => acc.movements)
//   .reduce((acc, sum) => acc + sum, 0);
// console.log(accountBalance2);

// The Sort method // mutates an array
// Strings
// const owners = ['Jonas', 'Zach', 'Adam', 'Martha'];
// console.log(owners.sort()); // works witj strings

// // Numbers
// console.log(movements);
// // console.log(movements.sort()); // needs a callback function

// // return < 0, A before B   (keep order)   negative number
// // return > 0, B before A   (switch order) positive number

// // Ascending order
// // movements.sort((a, b) => {
// //   if (a > b) return 1;
// //   if (a < b) return -1;
// // });
// movements.sort((a, b) => a - b);
// console.log(movements);

// // Descending order
// // movements.sort((a, b) => {
// //   if (a > b) return -1;
// //   if (a < b) return 1;
// // });
// movements.sort((a, b) => b - a);
// console.log(movements);

// const arr = [1, 2, 3, 4, 5, 6, 7];
// console.log(new Array(1, 2, 3, 4, 5, 6, 7));

// // Empty array + fill method
// const x = new Array(7);
// console.log(x);
// x.fill(1, 3, 5);

// console.log(x);
// arr.fill(24, 3, 6);
// console.log(arr);

// // Array.from
// const y = Array.from({ length: 7 }, () => 1);
// console.log(y);

// const z = Array.from({ length: 10 }, (_, i) => i * 2);
// console.log(z);

// const diceRolls = Array.from(
//   { length: 100 },
//   () => Math.trunc(Math.random() * 6) + 1
// );
// console.log(diceRolls);
// console.log(diceRolls.filter(a => a === 6).length);

// // ARRAY METHODS PRACTICE
// // 1
// const bankDepositSum = accounts
//   .flatMap(acc => acc.movements)
//   .filter(mov => mov > 0)
//   .reduce((mov, curr) => mov + curr, 0);

// console.log(bankDepositSum);

// // 2
// // const numDeposit1000 = accounts
// //   .flatMap(acc => acc.movements)
// //   .filter(mov => mov >= 1000).length;
// // console.log(numDeposit1000);
// const numDeposit1000 = accounts
//   .flatMap(acc => acc.movements)
//   .reduce((count, cur) => (cur >= 1000 ? ++count : count), 0);
// // count + 1 === ++count
// console.log(numDeposit1000);

// // let a = 10;
// // console.log(a++);
// // console.log(a);
// // console.log('----------');
// // let b = 10;
// // console.log(++b); // prefix ++ operator
// // console.log(b);

// // 3
// const { deposits, withdrawals } = accounts
//   .flatMap(acc => acc.movements)
//   .reduce(
//     (sums, cur) => {
//       // cur > 0 ? (sums.deposits += cur) : (sums.withdrawals += cur);
//       sums[cur > 0 ? `deposits` : 'withdrawals'] += cur;
//       return sums;
//     },
//     { deposits: 0, withdrawals: 0 }
//   );
// console.log(deposits, withdrawals);

// // 4
// // this is a nice title = This Is a Nice Title
// const convertTitleCase = function (title) {
//   const capitalize = str => str[0].toUpperCase() + str.slice(1);

//   const exceptions = ['a', 'the', 'but', 'and', 'or', 'an', 'in', 'with', 'on'];
//   const titleCase = title
//     .toLowerCase()
//     .split(' ')
//     .map(word => (exceptions.includes(word) ? word : capitalize(word)))
//     .join(' ');
//   return capitalize(titleCase);
// };
// console.log(convertTitleCase('this is a nice title'));
// console.log(convertTitleCase('this is a LONG title but not too long'));
// console.log(convertTitleCase('and here is another title with an EXAMPLE'));

/////////////////////////////////////////////////////
// // CODING CHALLENGE 1
// const checkDogs = function (dogsJulia, dogsKate) {
//   // const copyJulia = dogsJulia.slice(1, 3);
//   const copyJulia = dogsJulia.slice();
//   copyJulia.splice(0, 1);
//   copyJulia.splice(-2);

//   const allDogs = [...copyJulia, ...dogsKate];
//   allDogs.forEach(function (age, i) {
//     if (age >= 3) {
//       console.log(`Dog number ${i + 1} is an adult and is ${age} years old`);
//     } else {
//       console.log(`Dog number ${i + 1} is still a puppy 🐶`);
//     }
//   });
// };

// // Data 1
// // const julia = [3, 5, 2, 12, 7];
// // const kate = [4, 1, 15, 8, 3];
// // // Data 2
// const julia = [9, 16, 6, 8, 3];
// const kate = [10, 5, 6, 1, 4];
// checkDogs(julia, kate);

// CODING CHALLENGE 2
// const data1 = [5, 2, 4, 1, 15, 8, 3];
// const data2 = [16, 6, 10, 5, 6, 1, 4];

// const calcAverageHumanAge = ages => {
//   const dogAge = ages.map(age => (age > 2 ? 16 + age * 4 : 2 * age));
//   const maturedAge = dogAge.filter(age => age > 18);
//   // const avgAdultAge =
//   //   maturedAge.reduce((acc, age) => {
//   //     return acc + age;
//   //   }, 0) / maturedAge.length;
//   const avgAdultAge = maturedAge.reduce(
//     (acc, age, i, arr) => acc + age / arr.length,
//     0
//   );
//   console.log(avgAdultAge);
// };
// calcAverageHumanAge(data2);

// CODING CHALLENGE 3
// const calcAverageHumanAgeArr = ages =>
//   ages
//     .map(age => (age > 2 ? 16 + age * 4 : 2 * age))
//     .filter(age => age > 18)
//     .reduce((acc, age, i, arr) => acc + age / arr.length, 0);
// console.log(calcAverageHumanAgeArr(data1));

// CODING CHALLENGE 4
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

// 1
dogs.forEach(
  arr => (arr.recommendedFood = Math.trunc(arr.weight ** 0.75 * 28))
);
// 2
const dogSarah = dogs.find(dog => dog.owners.includes('Sarah'));
console.log(
  dogSarah.curFood > dogSarah.recommendedFood
    ? `Sarah dog is eating too much`
    : `Sarah dog is eating too little`
);

// 3
const ownersEatTooMuch = dogs
  .filter(dogOwner => dogOwner.curFood > dogOwner.recommendedFood)
  .flatMap(dog => dog.owners);
const ownersEatTooLittle = dogs
  .filter(dogOwner => dogOwner.curFood < dogOwner.recommendedFood)
  .flatMap(dog => dog.owners);
console.log(ownersEatTooLittle);
console.log(ownersEatTooMuch);

// 4
console.log(`${ownersEatTooMuch.join(' and ')}'s dog eat too much`);
console.log(`${ownersEatTooLittle.join(' and ')}'s dog eat too much`);

// 5
console.log(dogs.some(dog => dog.curFood === dog.recommendedFood));

// 6
console.log(
  dogs.some(
    dog =>
      dog.curFood > dog.recommendedFood * 0.9 &&
      dog.curFood < dog.recommendedFood * 1.1
  )
);

// 7
const goodDog = dogs.filter(
  dog =>
    dog.curFood > dog.recommendedFood * 0.9 &&
    dog.curFood < dog.recommendedFood * 1.1
);
console.log(goodDog);

// 8
const dogCopy = dogs
  .slice()
  .sort((a, b) => a.recommendedFood - b.recommendedFood);
console.log(dogCopy);
