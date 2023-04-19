const DISPLAY_CAPACITY = 10;

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

function handleKeyboard(event) {
    let key = event.key;

    // Prevents Quick Find from being activated in Firefox
    if (event.key === '/') {
        event.preventDefault();
    }

    if (event.key === 'Enter') key = '=';

    const selectedKey = document.querySelector(`div[data-key='${key}']`);

    selectedKey.style.filter = 'brightness(130%)';
    setTimeout(() => selectedKey.removeAttribute('style'), 200);

    selectedKey.click();
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
    if (Number.parseFloat(secondNumber) === 0) {
        return 'Division by 0';
    } else {
        return firstNumber / secondNumber;
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
    if (!isFinite(value)) {
        primaryDisplay.textContent = value;
    } else {
        let stringNumber = value.toString();
        let trimedNumber = stringNumber;

        if (trimedNumber.includes('-')) {
            trimedNumber = trimedNumber.slice(1);
        }

        if (trimedNumber.includes('.')) {
            trimedNumber = trimedNumber.replace('.', '');
        }

        if (trimedNumber.length > DISPLAY_CAPACITY) {
            primaryDisplay.textContent = Number.parseFloat(
                value.toLocaleString('en-US')).toExponential(2);
        } else {
            if (stringNumber.includes('.')) {
                const positionOfDecimalPoint = stringNumber.indexOf('.');
                const integerPart = stringNumber.slice(0, positionOfDecimalPoint);
                const decimalPart = stringNumber.slice(positionOfDecimalPoint + 1);
        
                if (decimalPart) {
                    primaryDisplay.textContent = Number.parseInt(
                        integerPart).toLocaleString('en-US') + '.' + decimalPart;
                } else {
                    primaryDisplay.textContent = Number.parseInt(
                        integerPart).toLocaleString('en-US') + '.';
                }
            } else {
                primaryDisplay.textContent = Number.parseInt(value).toLocaleString('en-US');
            }
        }
    }
}

function updateSecondaryDisplay(firstNumber, secondNumber, operator) {
    if (firstNumber === '0.') {
        firstNumber = '0';
        updatePrimaryDisplay(firstNumber);
    }

    if (firstNumber.length > DISPLAY_CAPACITY) {
        firstNumber = Number.parseFloat(firstNumber).toExponential(2);
    }

    if (secondNumber) {
        secondaryDisplay.textContent = `${firstNumber} ${operator} ${secondNumber} =`;
    } else {
        secondaryDisplay.textContent = `${firstNumber} ${operator}`;
    }
}

function updateNumbers(event) {
    if (event.target.className === 'key digit') {
        if (!operator) {
            if (digitCounter < DISPLAY_CAPACITY) {
                firstNumber += event.target.textContent;
                updatePrimaryDisplay(firstNumber);
                digitCounter++;
            }
        } else {
            if (digitCounter < DISPLAY_CAPACITY) {
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
                firstNumber = '0.';
                digitCounter = 1;
            }

            if (!firstNumber.includes('.') && digitCounter < DISPLAY_CAPACITY) {
                firstNumber += '.';
            }
            
            updatePrimaryDisplay(firstNumber);
        } else {
            if (!secondNumber) {
                secondNumber = '0.';
                digitCounter = 1;
            }

            if (!secondNumber.includes('.') && digitCounter < DISPLAY_CAPACITY) {
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

let fakeSecondNumber = '';
function updateOperator(event) {
    let result;

    // In a situation with the pattern: {operator}
    if (event.target.textContent !== '=') {
        if (!firstNumber) {
            firstNumber = '0';
            updatePrimaryDisplay(firstNumber);
        }

        updateSecondaryDisplay(firstNumber, secondNumber, event.target.textContent);
        fakeSecondNumber = firstNumber;

        // In a situation with the pattern: {firstNumber}{operator}{secondNumber}{operator}
        if (firstNumber && secondNumber) {
            result = operate(firstNumber, secondNumber, operator);

            if (!isFinite(result)) {
                resetCalculator();
                updatePrimaryDisplay(result);
            } else {
                firstNumber = result.toString();
                fakeSecondNumber = result.toString();
                secondNumber = '';
                updatePrimaryDisplay(result);
                operator = event.target.textContent;
                updateSecondaryDisplay(firstNumber, secondNumber, operator);
            }
        }
        
        operator = event.target.textContent;
    } else {// In a situation with the pattern: {firstNumber}{operator}{secondNumber}=
        if (firstNumber && secondNumber) {
            result = operate(firstNumber, secondNumber, operator);

            if (!isFinite(result)) {
                resetCalculator();
                updatePrimaryDisplay(result);
            } else {
                updatePrimaryDisplay(result);
                updateSecondaryDisplay(firstNumber, secondNumber, operator);
                firstNumber = result.toString();
                secondNumber = '';
                operator = event.target.textContent;
            }
        }

        // In a situation with the pattern: {firstNumber}{operator}=
        if (firstNumber && operator !== '=') {
            if (secondNumber) {
                secondNumber = '';
            }

            if (!fakeSecondNumber) {
                fakeSecondNumber = firstNumber;
            }

            result = operate(firstNumber, fakeSecondNumber, operator);

            if (!isFinite(result)) {
                resetCalculator();
                updatePrimaryDisplay(result);
            } else {
                updatePrimaryDisplay(result);
                updateSecondaryDisplay(firstNumber, fakeSecondNumber, operator);
                firstNumber = result.toString();
            }
        }
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
window.addEventListener('keydown', handleKeyboard);
clear.addEventListener('click', resetCalculator);
backspace.addEventListener('click', updateNumbers);
decimalPoint.addEventListener('click', updateNumbers);
percent.addEventListener('click', updateNumbers);
sign.addEventListener('click', updateNumbers);
digits.forEach(digit => digit.addEventListener('click', updateNumbers));
operators.forEach(operator => operator.addEventListener('click', updateOperator));