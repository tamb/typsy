var typeCheck = require("./../dist/index.development").typeCheck;
let sentence = "The answer is ";

function trueHandler(checkedValue) {
  sentence += checkedValue;
}

function falseHandler(checkedValue) {
  sentence += `NOT ${checkedValue}`;
}

typeCheck("CLEAR")
  .isString()
  .yields(trueHandler, falseHandler);

typeCheck(21)
  .isString()
  .yields(trueHandler, falseHandler);

typeCheck(21)
  .isString(false)
  .yields(trueHandler, falseHandler);

console.log(sentence);
