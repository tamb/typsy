# typsy

Simple, chainable runtime type-checking for JavaScript

## install

```js
npm install --save typsy
```

## import

```js
// myfile.js
import { typeCheck } from "typsy";
```

## use

```js
const x = "This is a string";

typeCheck(x).isString().yields(); // true

typeCheck(x).isInteger().yields(); // false

typeCheck(x).isString().or().isInteger().yields(); // true
```

## the almighty `yields`

`yields()` returns whether the check is true or not. It must be called at the end to return `true` or `false`

## checks

```js
isInteger();
isString();
isEmptyString();
isAllWhiteSpace();
isBoolean();
isFloat();
isObject();
isNull();
isUndefined();
isArray();
isEmptyArray();
isFunction();
isDate();
isSet();
isWeakSet();
isMap();
isWeakMap();
```

## methods

```js
and();
or();
unless();
```

## custom checks
Use the `check` function to insert a custom check function.

```js
  function isNegative(value){
    return value < 0;
  }
  
  typeCheck(12).check(isNegative).yields(); // false
  typeCheck(-12).check(isNegative).yields(); // true
  

  typeCheck(12).isInteger().and().check(isNegative).yields(); // false
  typeCheck(-12).isInteger().and().check(isNegative).yields(); // true
  typeCheck(12).isInteger().or().check(isNegative).yields(); // true
```
## yields callbacks

`yields` accepts a truth-handler and false-handler function respectively
Both callbacks use the typeChecked value as its argument.
This is especially useful for logging.
```js
function myTrueCallback(){};

function myFalseCallback(){};

typeCheck(21).isInteger().yields(myTrueCallback, myFalseCallback); // returns true & myTrueCallback is fired
typeCheck("toot").isInteger().yields(myTrueCallback, myFalseCallback); // returns false & myFalseCallback is fired
```

with the `yields` callback you can even shorten your code:
```js
// instead of 
if(typeCheck(21).isInteger().yields()){
  handleTrue(21);
} else {
  handleFalse(21)
}
// you can use this!
typeCheck(21).isInteger().yields(handleTrue, handleFalse);
```

## neat recipes
```js
myFunction(typeCheck(myVariable).isInteger().or().isString().yields()? myVariable : 1);
```
