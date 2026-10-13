# typsy

Small, chainable runtime type checks for JavaScript and TypeScript. Typsy has no runtime dependencies and works in Node.js and modern browsers.

## Install

```sh
npm install typsy
```

## Usage

```js
import { typeCheck } from "typsy";

typeCheck("hello").isString().yields(); // true
typeCheck(21).isString().or().isInteger().yields(); // true
typeCheck([]).isArray().and().isEmptyArray().yields(); // true
```

CommonJS is supported too:

```js
const { typeCheck } = require("typsy");
```

For a browser script tag, use the `unpkg` or `jsdelivr` build:

```html
<script src="https://unpkg.com/typsy"></script>
<script>
  typsy.typeCheck(document.body).isHTML().yields();
</script>
```

The package includes type declarations, ESM and CommonJS entry points, source maps, and a browser-ready global build. Node.js 18 or newer is supported. Browser output targets ES2018.

## Checks

Every check returns the same chain and accepts an optional `false` argument to negate only that check.

### Primitives

- `isTrue()`, `isFalse()`
- `isNumber()`, `isFinite()`, `isInteger()`, `isFloat()`, `isNaN()`
- `isString()`, `isEmptyString()`, `isAllWhiteSpace()`
- `isBoolean()`, `isSymbol()`, `isBigInt()`
- `isNull()`, `isUndefined()`

`isNumber()` excludes `NaN`. `isFinite()` and `isFloat()` also exclude positive and negative infinity. `isNaN()` is strict and does not coerce strings.

### Objects and collections

- `isObject()`, `isPlainObject()`, `isEmptyObject()`
- `isArray()`, `isEmptyArray()`, `isFunction()`
- `isDate()`, `isRegExp()`, `isError()`, `isPromise()`
- `isSet()`, `isWeakSet()`, `isMap()`, `isWeakMap()`
- `isCollection()` for plain objects, arrays, maps, weak maps, sets, and weak sets
- `isHTML()` for browser `Element` instances

Browser-only checks safely return `false` when their browser globals are unavailable.

## Chaining

Use `and()` or `or()` between checks:

```js
typeCheck(value).isString().or().isInteger().yields();
typeCheck(value).isArray().and().isEmptyArray().yields();
```

`unless()` toggles negation for following checks and remains independent of `and()` and `or()`. Call it again to turn that negation off:

```js
typeCheck(value)
  .unless()
  .isString()
  .and()
  .isArray()
  .unless()
  .or()
  .isInteger()
  .yields();
```

Passing `false` negates one built-in check:

```js
typeCheck(21).isArray(false).yields(); // true
```

## Custom checks

`check()` accepts a predicate and normalizes its result to a boolean:

```js
const isNegative = (value) => value < 0;

typeCheck(-12).isInteger().and().check(isNegative).yields(); // true
```

## Result callbacks

`yields()` returns the final boolean. It can also call matching success and failure handlers with the original value:

```js
typeCheck(value).isInteger().yields(handleInteger, handleOther);
```

## Development

```sh
npm test
npm run test:coverage
npm run check
npm run package:check
```

`npm run package:check` builds every distribution format and validates the packed npm artifact and its type declarations.
