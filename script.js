"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

/////////////////////////////////////////////////
/////////////////////////////////////////////////

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = "";
  // splice to copy and chain
  const movs = sort ? movements.splice().sort((a, b) => a - b) : movements;
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${i} ${type}</div>
        <div class="movements__value">${mov}€</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

//? displayMovement(account1.movements);

// const createUserName = function (user) {
//   const userName = user
//     .toLowerCase()
//     .trim()
//     .split(" ")
//     .map((name) => name[0])
//     .join("");
//   return userName;
// };

// // My way
// console.log(createUserName("Steven Thomas Williams"));

// take a closer look that the map function allways going to retun in each itteration

// compute one user name foreach of the account holders in our account array

// we want to modify the object (the element allready exist) not to create a new array

const createUserName = function (accs) {
  // modify the array that we get as an input
  // it is a side effect to change the original account array
  accs.forEach(function (acc) {
    // creating a new property
    acc.username = acc.owner
      .toLowerCase()
      .trim()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};

// My way
createUserName(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc.movements);
  // Display balance
  // calcDisplayBalance(currentAccount.movements);
  // needs to be called with the complete account
  calcDisplayBalance(acc);
  // Display summary
  calcDisplaySummary(acc);
};

// don't rellay on arrady existing data and just use the data here as arguments for your function

// we didn't return anything we simply produce a side effect

// const calcPrintBalance = function (movements) {
//   const balance = movements.reduce((acc, mov) => acc + mov, 0);
//   labelBalance.textContent = `${balance}€`;
// };

// calcPrintBalance(account1.movements);

// do if foreach account

// const calcDisplayBalance = function (movements) {
//   // creating a new property
//   const balance = movements.reduce((acc, mov) => acc + mov, 0);
//   labelBalance.textContent = `${balance}€`;
// };
// want to have access to the balance
// ! (acc) This is like currentAccount and account1 account2
// ! pointing to the same place in the heap
const calcDisplayBalance = function (acc) {
  // creating a new property
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}€`;
};
// calcDisplayBalance(account1.movements);
// console.log(account1);

// take the whole account
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;
  const out = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;
  const interest = acc.movements
    .filter((mov) => mov > 0)
    // %1.2 | each one has it's own interestRate
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      console.log(arr);
      // if the interst >= 1
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}€`;
};

// calcDisplaySummary(account1.movements);

// don't over chaining with huge arrays
// it is a bad practice to chain a method that mutet the original array like the splic and the reverse method

// Event handlers for login
let currentAccount;
btnLogin.addEventListener("click", function (e) {
  //in html the defult behaver for a submet btn is to reloaud the page
  // prevent form submission
  e.preventDefault();
  // both field simulate click
  //! this is not a copy of the object
  //! this is like a anthoer variable that point to the same original object in the memory heap
  // ! like account1 / account2 / account3
  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);
  // check pin
  // convert
  // fix error with optional chaing
  // if (currentAccount && currentAccount.pin === Number(inputLoginPin.value))
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and welcome message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;
    containerApp.style.opacity = "1";
    // clear input fields
    inputLoginUsername.value = inputLoginPin.value = "";
    // lose the blinking
    inputLoginPin.blur();
    // Update account
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  // this alone not helpful
  // const receiverAcc = inputTransferTo.value;
  const receiverAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );
  // lose 100 and add to the receiver 100

  inputTransferAmount.value = inputTransferTo.value = "";
  // if there is not property receiverAcc.username then it will be undefined so false so getout
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    // updateUI
    updateUI(currentAccount);
  }
});

// ! Request a loan

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  // hear the word any then use some
  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= amount * 0.1)
  ) {
    // Add movement
    currentAccount.movements.push(amount);
    // Update UI
    updateUI(currentAccount);
    inputLoanAmount.value = "";
  }
});

// ! Findindex method

// return the fund index not the element itself

// to delete an element in an array we use the splice method
// and the splice method needs an index to delete the element

btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  // check cradintioal
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === inputCloseUsername.value
      // no need to check the pain again
    );

    // indexOf(23)
    // Delete account
    accounts.splice(index, 1);
    // hide UI
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = "";
});

// Tracker
let sortedState = false;

btnSort.addEventListener("click", function (e) {
  e.preventDefault();

  displayMovements(currentAccount.movements, !sortedState);

  // Toggle the sorting state for the next click event
  sortedState = !sortedState;
});
