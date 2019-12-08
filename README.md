# typsy

Simple, chainable type-checking for JavaScript

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

typeCheck(x)
  .isString()
  .yields(); // true
typeCheck(x)
  .isInteger()
  .yields(); // false
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
isNegativeFloat();
isObject();
isNull();
isUndefined();
isArray();
isEmptyArray();
isFunction();
isDate();
```

## methods

```js
and();
or();
unless();
```
