'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2022-10-25T17:01:17.194Z',
    '2022-10-27T23:36:17.929Z',
    '2022-10-28T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2022-10-23T17:01:17.194Z',
    '2022-10-26T23:36:17.929Z',
    '2022-10-27T10:51:36.790Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
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

/////////////////////////////////////////////////
// Functions

const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);
  // console.log(daysPassed);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  // const day = `${date.getDate()}`.padStart(2, 0);
  // const month = `${date.getMonth() + 1}`.padStart(2, 0);
  // const year = date.getFullYear();
  // return `${day}/${month}/${year}`;
  return new Intl.DateTimeFormat(locale).format(date);
};

const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);

    const formattedMov = formatCur(mov, acc.locale, acc.currency);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(incomes, acc.balance, acc.currency);

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(Math.abs(out), acc.balance, acc.currency);

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCur(interest, acc.balance, acc.currency);
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

const startLogOutTimer = function () {
  const tick = () => {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(Math.trunc(time % 60)).padStart(2, 0);

    // In each call, print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;

    // When at 0 seconds, stop timer and log out user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }
    // Decrease 1s
    time--;
  };
  // Set time to 5 minutes
  let time = 120;
  // Call the timer every second
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

///////////////////////////////////////
// Event handlers
let currentAccount, timer;

// // FAKE ALWAYS LOGGED IN
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Display current date and time
    // const now = new Date();
    // const day = `${now.getDate()}`.padStart(2, 0);
    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const year = now.getFullYear();
    // const hour = `${now.getHours()}`.padStart(2, 0);
    // const minute = `${now.getMinutes()}`.padStart(2, 0);
    // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${minute}`;

    // Experimenting with  API
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric', // long or 2-digit
      year: 'numeric', // 2-digit
      // weekday: 'short', // short or narrow
    };
    // const locale = navigator.language;
    // console.log(locale);

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Timer
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);

    // Reset Timer
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () {
      // Add movement
      currentAccount.movements.push(amount);

      // Add loan date
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI
      updateUI(currentAccount);
    }, 4000);

    // Reset Timer
    clearInterval(timer);
    timer = startLogOutTimer();
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
// // Converting and checking numbers
// console.log(0.1 + 0.2);
// console.log(0.1 + 0.2 === 0.3);

// // String to Number
// console.log(Number('23'));
// console.log(+'23');

// // parseInt
// console.log(Number.parseInt('30px', 10)); // redix

// console.log(Number.parseInt(' 2.5rem'));
// console.log(Number.parseFloat(' 2.5rem'));

// // console.log(parseFloat('2.5 rem')); old version js

// // isNaN: checking if value is not a number
// console.log(Number.isNaN(20));
// console.log(Number.isNaN('20'));
// console.log(Number.isNaN(+'20X'));
// console.log(Number.isNaN(20 / 0));

// // isFinite: checking if value is a number
// console.log('------');
// console.log(Number.isFinite(20));
// console.log(Number.isFinite('20'));
// console.log(Number.isFinite(+'20X'));
// console.log(Number.isFinite(20 / 0));

// // isInteger: checking if value is an integer
// console.log('------');
// console.log(Number.isInteger(20));
// console.log(Number.isInteger('20'));
// console.log(Number.isInteger(23.0));
// console.log(Number.isInteger(20 / 0));

// // Math and Rounding
// console.log(Math.sqrt(25));
// console.log(25 ** (1 / 2));
// console.log(8 ** (1 / 3)); // cubic root

// console.log(Math.max(1, 3, 23, 19, 10));
// console.log(Math.max(1, 3, '23', 19, 10)); // Does type coercion
// console.log(Math.max(1, 3, '23px', 19, 10)); // but not parseInt

// console.log(Math.min(1, 3, 23, 19, 10));

// console.log(Math.PI * Number.parseFloat('10px') ** 2);

// console.log(Math.floor(Math.random() * 6) + 1);

// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min) + 1) + min;
// // 0...1 -> 0...(max - min) -> min...max
// // console.log(randomInt(10, 20));

// // Rounding Integers // does type coersion
// console.log(Math.trunc(23.3)); // cuts off tne decimal
// console.log('------');

// console.log(Math.round(23.3)); // rounds to the nearest integer
// console.log(Math.round(23.9));
// console.log('------');

// console.log(Math.ceil(23.3)); // rounds up to the nearest integer
// console.log(Math.ceil(23.9));
// console.log('------');

// console.log(Math.floor(23.3)); // rounds down to the nearest integer
// console.log(Math.floor('23.9'));

// console.log(Math.trunc(-23.3));
// console.log(Math.floor(-23.3));

// // Rounding decimals
// console.log((2.7).padStart(0)); // returns a string
// console.log((2.7).padStart(3));
// console.log((2.345).padStart(2));
// console.log(+(2.345).padStart(2));

// // The Remainder operator
// console.log(5 % 2);
// console.log(8 % 3);

// console.log(6 % 2);
// console.log(7 % 2);

// const isEven = n => n % 2 === 0;
// console.log(isEven(8));
// console.log(isEven(28));
// console.log(isEven(83));

// labelBalance.addEventListener('click', function () {
//   [...document.querySelectorAll('.movements__row')].forEach(function (row, i) {
//     if (i % 2 === 0) row.style.backgroundColor = 'Orangered';
//   });
// });

// // Numeric Separator
// const diameter = 287_460_000_000; // 287,460, 000, 000
// console.log(diameter);

// const price = 345_00;
// console.log(price);

// const transferFee1 = 15_00;
// const transferFee2 = 1_500;

// console.log(Number('23_000')); // does not work with string
// console.log(parseInt('23_400'));

// Working with BigInt // numbers are represented internally as 64 bits, 53 to store numbers
// console.log(2 ** 53 - 1);
// console.log(Number.MAX_SAFE_INTEGER);
// console.log(2 ** 53 + 1);
// console.log(2 ** 53 + 2);
// console.log(2 ** 53 + 3);
// console.log(2 ** 53 + 4);

// console.log(3948450930293940595049n);
// console.log(BigInt(394845093029394));

// // Operators
// console.log(10000n + 10000n);
// console.log(100_00n + 100_00n);

// const huge = 242342215434443123343n;
// const num = 23;
// console.log(huge * BigInt(num));

// //Exceptions
// console.log(20n > 15);
// console.log(20n === 20);
// console.log(20n == 20);
// console.log(typeof 20n);
// console.log(20n == '20');

// console.log(huge + ' is REALLY BIG');

// // division
// console.log(10n / 3n); // cuts off the decimal part
// console.log(10 / 3);

// Date and Time
// Create a date
// const now = new Date();
// console.log(now);
// console.log(new Date('OCTOBER 29, 2022'));
// console.log(new Date(account1.movementsDates[0]));
// console.log(new Date(2037, 10, 19, 15, 23, 5)); // y, m, d, h, m, s
// console.log(new Date(2037, 10, 31));

// console.log(new Date(0));
// console.log(new Date(3 * 24 * 60 * 60 * 1000));

// // Working with Dates methods
// const future = new Date(2037, 10, 19, 15, 23, 5);
// console.log(future);
// console.log(future.getFullYear());
// console.log(future.getMonth());
// console.log(future.getDate());
// console.log(future.getDay());
// console.log(future.getHours());
// console.log(future.getMinutes());
// console.log(future.getSeconds());
// console.log(future.getTime());
// console.log(future.toISOString());
// console.log(future.toDateString());
// console.log(future.toLocaleString());
// console.log(future.toUTCString());
// console.log(future.toString());
// console.log(future.toTimeString());
// console.log(new Date(2142253385000));
// console.log(Date.now());

// future.setFullYear(2040);
// console.log(future);

// // Date operators
// const future = new Date(2037, 10, 19, 15, 23, 5);
// console.log(+future);

// const calcDaysPassed = (date1, date2) =>
//   Math.abs(date2 - date1) / (1000 * 60 * 60 * 24);

// const days1 = calcDaysPassed(new Date(2037, 3, 4), new Date(2037, 3, 14));
// console.log(days1);

//
const num = 3884754.23;
const options = {
  style: 'currency', // unit or percent or curremcy
  unit: 'celsius',
  currency: 'EUR',
  // useGrouping: false, // prints without separator
};
console.log('US:', new Intl.NumberFormat('en-US', options).format(num));
console.log('GERMANY:', new Intl.NumberFormat('de-DE', options).format(num));
console.log('SYRIA:', new Intl.NumberFormat('ar-SY', options).format(num));
console.log(
  navigator.language,
  new Intl.NumberFormat(navigator.language, options).format(num)
);

// Timer
//setTimeout
// const ingredients = ['olives', 'spinach'];
// const pizzaTimer = setTimeout(
//   (ing1, ing2) => console.log(`Here is your pizza with ${ing1} and ${ing2}`),
//   5000,
//   ...ingredients
// );
// console.log('waiting---');

// if (ingredients.includes('spinach')) clearTimeout(pizzaTimer);

// setInterval
// setInterval(() => {
//   const now = new Date();
//   const hour = `${now.getHours()}`.padStart(2, 0);
//   const min = `${now.getMinutes()}`.padStart(2, 0);
//   const sec = `${now.getSeconds()}`.padStart(2, 0);

//   console.log(`${hour}:${min}:${sec}`);
// }, 1000);
