// error
const ErrorContainer = document.querySelector('.error');
// display
const DisplayEquationDiv = document.querySelector('.equation');
const DisplayResultDiv = document.querySelector('.result');
// extra-actions
const BackspaceBtn = document.querySelector('.actions__backspace');
const ClearDisplayBtn = document.querySelector('.actions__clear-display');
// main actions
const OperationBtns = document.querySelectorAll('.actions__operation');
const EquationEqualsBtn = document.querySelector('.actions__equal');
// numbers
const DigitBtns = document.querySelectorAll('.numbers__digit');
const FloatPointBtn = document.querySelector('.numbers__float-point');

// map operators
const operatorList = {
  DIV: '/',
  MULT: '*',
  SUB: '-',
  ADD: '+',
};

// equations parts
let operandOne = null; // save the first number value = null;
let operator = null;
let isWaitingSecondValue = false;
let isNewOperation = true;
let totalResult = 0;
let totalEquation = '';
// clear equation input when app fires for first time
setEquation('');

/********************** Event Listeners ***********************/

// listen to keybaord
document.addEventListener('keydown', keyboardHandler);

// listen for number digit click
DigitBtns.forEach((digit) => {
  digit.addEventListener(
    'click',
    enterDigitHandler.bind(null, digit.innerHTML.trim())
  );
});

// listen to float point click
FloatPointBtn.addEventListener('click', floatPointHandler);

// listen for operation clicks
OperationBtns.forEach((operation, index) => {
  const operationKey = operation.getAttribute('data-operation');

  operation.addEventListener(
    'click',
    enterOperationHandler.bind(null, operationKey)
  );
});

// listen for equal button click
EquationEqualsBtn.addEventListener('click', calculateEquationHandler);

// listen to clear button press
ClearDisplayBtn.addEventListener('click', clearDisplayHandler);

// listen to backspace btn press
BackspaceBtn.addEventListener('click', backspaceHandler);

function showError(message) {
  ErrorContainer.textContent = message;
  ErrorContainer.classList.add('show');
  setTimeout(() => {
    ErrorContainer.classList.remove('show');
  }, 4000);
}

function roundToTwoDecimals(number) {
  return Math.round(+number * 100) / 100;
}
/* to calculate a single equation step
 * args: [num: number, num2: number, operation: ADD | SUB | MULT | DIV]
 * return: number | null, null if the provided args are wrong
 */

function calculationStep(operation, num1, num2) {
  let result = null;
  num1 = +num1;
  num2 = +num2;

  if (operation === 'DIV' && num2 === 0) {
    showError('Cannot divide by zero');
    return null;
  }

  switch (operation.toUpperCase()) {
    case 'ADD':
      result = num1 + num2;
      break;
    case 'SUB':
      result = num1 - num2;
      break;
    case 'MULT':
      result = num1 * num2;
      break;
    case 'DIV':
      result = num1 / num2;
      break;
    default:
      result = null;
  }

  // alert(result);
  return roundToTwoDecimals(result);
}

function setEquation(equation) {
  totalEquation = '';
  DisplayEquationDiv.textContent = equation;
}

function setResult(result) {
  console.log('setResult', result);
  totalResult = result; // save the result
  DisplayResultDiv.textContent = result; // display the result
}

function getResult() {
  // const result = DisplayResultDiv.textContent;
  const result = totalResult;
  return result;
}

/******************* Handlers ********************/
function keyboardHandler(event) {
  const numberList = '0123456789';
  const operationList = '/*-+';
  console.log(event.keyCode);
  if (numberList.includes(event.key)) {
    console.log(event.key);
    enterDigitHandler(event.key);
  } else if (operationList.includes(event.key)) {
    let operation = '';

    switch (event.key) {
      case '/':
        operation = 'DIV';
        break;
      case '*':
        operation = 'MULT';
        break;
      case '-':
        operation = 'SUB';
        break;
      case '+':
        operation = 'ADD';
        break;
    }

    enterOperationHandler(operation);
  } else if (event.key === '.') {
    floatPointHandler();
  } else if (event.key === '=') {
    calculateEquationHandler();
  } else if (event.keyCode === 8) {
    backspaceHandler();
  }
}

function enterDigitHandler(digit) {
  // case this is the first digit in the second operand
  if (isWaitingSecondValue) {
    // set totalResult to 0 (let the previous displayed value)
    totalResult = 0;
    // allow using operators
    isWaitingSecondValue = false;
  }

  // clear display for
  if (isNewOperation) {
    isNewOperation = false;
    setResult(0);
    if (!operator) setEquation('');
  }

  // form number value
  const newResultValue = totalResult !== 0 ? `${totalResult}${digit}` : digit; //remove unnecessary zero on the left

  // set result value
  setResult(newResultValue);
}

function floatPointHandler() {
  let result = getResult().toString();
  isNewOperation = false;

  console.log('float point initial result', result);
  console.log('float point initial result type', typeof result);
  if (result && result.includes('.')) return;

  result += '.';
  setResult(result);
}

function enterOperationHandler(operation) {
  // set equation to new finalResult + operation
  let equation = totalResult + ' ' + operatorList[operation];

  // in case use changed his mind and wanted another operation
  if (isWaitingSecondValue) {
    operator = operation; // update operator with the new alternative value value

    setEquation(equation);
    return;
  }

  isWaitingSecondValue = true;

  // case there were previous operation
  if (operator && operandOne && totalResult) {
    // calculate previous operation
    const newTotalResult = calculationStep(operator, operandOne, totalResult);
    if (newTotalResult) {
      // set finalResult and DisplayResult to the newValue
      setResult(newTotalResult);
      // set equation to new finalResult + operation
      setEquation(equation);
      // replace old operation with the new one
      operator = operation;
    }
  }

  // set operandOne with the totalResult value
  operandOne = totalResult;
  // set equation with the totalResult vlaue + operation
  setEquation(equation);
  // save the operation
  operator = operation;
}

// is fired when equal button is pressed
function calculateEquationHandler() {
  // console.log({ operandOne, operator, totalResult });
  if (!operandOne || !operator || !totalResult) return;

  let result;

  result = calculationStep(operator, operandOne, totalResult);

  if (result) {
    const equation = `${operandOne} ${operatorList[operator]} ${totalResult} =`;
    setEquation(equation);

    setResult(result);
    operandOne = null;
    operator = null;

    isNewOperation = true;
  }

  // console.log('equal final state', {
  //   operandOne,
  //   operator,
  //   totalResult,
  //   isNewOperation,
  // });
}

// reset calcultor to initial values
function clearDisplayHandler() {
  operandOne = null;
  operator = null;
  isWaitingSecondValue = false;
  isNewOperation = true;

  setEquation('');
  setResult(0);

  console.log('clear final state', {
    operandOne,
    operator,
    totalResult,
    isNewOperation,
  });
}

function removeLastCharacter(num) {
  const result = num.toString().slice(0, num.length - 1);
  return result;
}

function backspaceHandler() {
  const resultValue = getResult();
  if (isWaitingSecondValue || +resultValue === 0) return; // cancel backspace effect if operaion btn was the last pressed one

  let newResultValue = 0;

  if (+resultValue % 1 === 0) {
    newResultValue =
      +resultValue > -10 && +resultValue < 10
        ? 0
        : removeLastCharacter(resultValue);
  } else {
    newResultValue = removeLastCharacter(resultValue);
  }

  setResult(newResultValue);
}
