function add(firstNumber, secondNumber) {
    return +firstNumber + +secondNumber;
}

function subtract(firstNumber, secondNumber) {
    return firstNumber - secondNumber;
}

function multiply(firstNumber, secondNumber) {
    return firstNumber * secondNumber;
}

function divide(firstNumber, secondNumber) {
    if (isFinite(firstNumber / secondNumber)) {
        return firstNumber / secondNumber;
    } else {
        return 'Division by 0';
    }
}

function updatePrimaryDisplay(value) {
    primaryDisplay.textContent = Number(value).toLocaleString('en-US');
}

function updateSecondaryDisplay(firstNumber, secondNumber, operator) {
    if (secondNumber) {
        secondaryDisplay.textContent = `${firstNumber}${operator}${secondNumber}=`;
    } else {
        secondaryDisplay.textContent = `${firstNumber}${operator}`;
    }
}

function operate(firstNumber, secondNumber, operator) {
    switch (operator) {
        case '+':
            return add(firstNumber, secondNumber);
        case '-':
            return subtract(firstNumber, secondNumber);
        case '×':
            return multiply(firstNumber, secondNumber);
        case '÷':
            return divide(firstNumber, secondNumber);
    }
}

let firstNumber = secondNumber = '';
let operator = '';
let digitCounter = 0;

function updateNumbers(event) {
    if (!operator) {
        if (digitCounter < 10) {
            firstNumber += event.target.textContent;
            updatePrimaryDisplay(firstNumber);
            digitCounter++;
        }
    } else {
        if (digitCounter < 10) {
            secondNumber += event.target.textContent;
            updatePrimaryDisplay(secondNumber);
            digitCounter++;
        }
    }
}

const primaryDisplay = document.querySelector('.primary');
const secondaryDisplay = document.querySelector('.secondary');
const digits = document.querySelectorAll('.digit');

digits.forEach(digit => digit.addEventListener('click', updateNumbers));