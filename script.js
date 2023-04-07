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

let firstNumber = secondNumber = '';
let operator = '';
let digitCounter = 0;

function updateNumbers(event) {
    if (event.target.className === 'key digit') {
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

    if (event.target.id === 'backspace') {
        if (!operator) {
            if (digitCounter > 0) {
                firstNumber = firstNumber.slice(0, -1);
                updatePrimaryDisplay(firstNumber);
                digitCounter--;
            }
        } else {
            if (digitCounter > 0) {
                secondNumber = secondNumber.slice(0, -1);
                updatePrimaryDisplay(secondNumber);
                digitCounter--;
            }
        }
    }
}

function updateOperator(event) {
    if (firstNumber !== '' && secondNumber !== '' && operator !== '') {
        const result = operate(firstNumber, secondNumber, operator);

        if (event.target.textContent !== '=') {
            firstNumber = result.toString();
            secondNumber = '';
            operator = event.target.textContent;
            updatePrimaryDisplay(result);
            updateSecondaryDisplay(firstNumber, secondNumber, operator);
        } else {
            updatePrimaryDisplay(result);
            updateSecondaryDisplay(firstNumber, secondNumber, operator);
            firstNumber = result.toString();
            secondNumber = '';
        }
    } else {
        if (firstNumber === '' && secondNumber === '') {
            firstNumber = '0';
        }

        operator = event.target.textContent;
        updateSecondaryDisplay(firstNumber, secondNumber, operator);
    }

    digitCounter = 0;
}

const primaryDisplay = document.querySelector('.primary');
const secondaryDisplay = document.querySelector('.secondary');
const backspace = document.querySelector('#backspace');
const digits = document.querySelectorAll('.digit');
const operators = document.querySelectorAll('.operator');

backspace.addEventListener('click', updateNumbers);
digits.forEach(digit => digit.addEventListener('click', updateNumbers));
operators.forEach(operator => operator.addEventListener('click', updateOperator));