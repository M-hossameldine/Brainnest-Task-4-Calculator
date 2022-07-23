// display
const DisplayEquationInput = document.querySelector('.equation');
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

// equations parts
let operandOne; // save the first number value = null;
let operandTwo = null;
let operator = null;
let totalResult = null;

// clear equation input when app fires for first time
setDisplayEqationValue('');

/********************** Event Listeners ***********************/

// listen for number digit click
DigitBtns.forEach((digit) => {
  digit.addEventListener(
    'click',
    enterDigitHandler.bind(null, digit.innerHTML.trim())
  );
});

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

/* to calculate a single equation step
 * args: [num: number, num2: number, operation: ADD | SUB | MULT | DIV]
 * return: number | null, null if the provided args are wrong
 */
function calculationStep(operation, num1, num2) {
  let result = null;
  num1 = +num1;
  num2 = +num2;

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
  return result;
}

function setDisplayEqationValue(value) {
  DisplayEquationInput.value = value;
  DisplayEquationInput.setAttribute('value', value);
}

function getDisplayEqationValue() {
  const numValue = DisplayEquationInput.getAttribute('value');
  console.log('get input value', numValue);
  return numValue;
}

function getResult() {
  // const result = DisplayResultDiv.textContent;
  const result = totalResult;
  return result;
}

function showResult(result) {
  console.log('showResult', result);
  totalResult = result; // save the result
  DisplayResultDiv.textContent = result; // display the result
}

function enterDigitHandler(digit) {
  // from number value
  const prevInputValue = DisplayEquationInput.getAttribute('value');
  const newInputValue = prevInputValue ? prevInputValue + digit : digit;

  // set equation input value
  setDisplayEqationValue(newInputValue);
  // console.log('new value', DisplayEquationInput.getAttribute('value'));
}

function enterOperationHandler(operation) {
  const currentDisplayNum = DisplayEquationInput.getAttribute('value');
  if (!currentDisplayNum && !totalResult) return; // make sure first operand is not empty
  // console.log('operation display value', currentDisplayNum);

  // save the operation
  console.log('operation key', operation);
  operator = operation;

  if (currentDisplayNum) {
    // save the first operand
    operandOne = currentDisplayNum;
  } else if (totalResult) {
    // save the first operand
    operandOne = totalResult;
  }

  // clear display equation to be ready for the
  setDisplayEqationValue('');
}

// is fired when equal button is pressed
function calculateEquationHandler() {
  let result;

  if (operandOne && operator) {
    operandTwo = getDisplayEqationValue();
    result = calculationStep(operator, operandOne, operandTwo);
  } else {
    return;
  }

  showResult(result);

  setDisplayEqationValue('');
}
