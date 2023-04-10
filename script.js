let firstNumber, secondNumber;
let operator;
let digitCounter;

function resetCalculator() {
    firstNumber = secondNumber = '';
    operator = '';
    digitCounter = 0;
    updatePrimaryDisplay('0');
    updateSecondaryDisplay(firstNumber, secondNumber, operator);
}

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
    if (typeof value !== 'string') {
        value = value.toString();
    }

    if (value.includes('.')) {
        const positionOfDecimalPoint = value.indexOf('.');
        const integerPart = value.slice(0, positionOfDecimalPoint);
        const decimalPart = value.slice(positionOfDecimalPoint + 1);

        if (decimalPart) {
            primaryDisplay.textContent = Number(integerPart).toLocaleString('en-US') + '.' + decimalPart;
        } else {
            primaryDisplay.textContent = Number(integerPart).toLocaleString('en-US') + '.';
        }
    } else {
        primaryDisplay.textContent = Number(value).toLocaleString('en-US');
    }
}

function updateSecondaryDisplay(firstNumber, secondNumber, operator) {
    if (secondNumber) {
        secondaryDisplay.textContent = `${firstNumber}${operator}${secondNumber}=`;
    } else {
        secondaryDisplay.textContent = `${firstNumber}${operator}`;
    }
}

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

    let digit;
    if (event.target.id === 'backspace') {
        if (!operator) {
            if (firstNumber.length > 0) {
                digit = firstNumber.charAt(firstNumber.length - 1);
                firstNumber = firstNumber.slice(0, -1);
                updatePrimaryDisplay(firstNumber);
                if (digit !== '.') {
                    digitCounter--;
                }
            }
        } else {
            if (secondNumber.length > 0) {
                digit = firstNumber.charAt(secondNumber.length - 1);
                secondNumber = secondNumber.slice(0, -1);
                updatePrimaryDisplay(secondNumber);
                if (digit !== '.') {
                    digitCounter--;
                }
            }
        }
    }

    if (event.target.id === 'decimal') {
        if (!operator) {
            if (!firstNumber) {
                firstNumber = '0' + '.';
            }

            if (!firstNumber.includes('.') && digitCounter < 10) {
                firstNumber += '.';
            }
            
            updatePrimaryDisplay(firstNumber);
        } else {
            if (!secondNumber) {
                secondNumber = '0' + '.';
            }

            if (!secondNumber.includes('.') && digitCounter < 10) {
                secondNumber += '.';
            }

            updatePrimaryDisplay(secondNumber);
        }
    }

    if (event.target.id === 'percent') {
        if (operator && operator !== '=') {
            if (secondNumber) {
                secondNumber = secondNumber / 100;
                updatePrimaryDisplay(secondNumber);
            } else {
                secondNumber = firstNumber / 100;
                updatePrimaryDisplay(secondNumber);
            }
        } else {
            resetCalculator();
        }
    }

    if (event.target.id === 'sign') {
        if (!operator) {
            if (firstNumber) {
                firstNumber = -firstNumber;
                updatePrimaryDisplay(firstNumber);
            }
        } else {
            if (secondNumber) {
                secondNumber = -secondNumber;
                updatePrimaryDisplay(secondNumber);
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
const clear = document.querySelector('#clear');
const backspace = document.querySelector('#backspace');
const decimalPoint = document.querySelector('#decimal');
const percent = document.querySelector('#percent');
const sign = document.querySelector('#sign');
const digits = document.querySelectorAll('.digit');
const operators = document.querySelectorAll('.operator');

window.addEventListener('load', resetCalculator);
clear.addEventListener('click', resetCalculator);
backspace.addEventListener('click', updateNumbers);
decimalPoint.addEventListener('click', updateNumbers);
percent.addEventListener('click', updateNumbers);
sign.addEventListener('click', updateNumbers);
digits.forEach(digit => digit.addEventListener('click', updateNumbers));
operators.forEach(operator => operator.addEventListener('click', updateOperator));