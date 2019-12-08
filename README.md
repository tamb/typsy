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
