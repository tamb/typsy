export type CheckFunction<T> = (item: T) => unknown;
export type YieldHandler<T> = (item: T) => unknown;

export interface TypeChecker<T> {
  readonly item: T;
  readonly returnsTrue: boolean;
  readonly truths: readonly boolean[];
  readonly isOr: boolean;
  readonly isAnd: boolean;
  readonly isUnless: boolean;
  yields(
    trueHandler?: YieldHandler<T>,
    falseHandler?: YieldHandler<T>,
  ): boolean;
  check(checkFunction: CheckFunction<T>): TypeChecker<T>;
  and(): TypeChecker<T>;
  or(): TypeChecker<T>;
  unless(): TypeChecker<T>;
  isTrue(not?: boolean): TypeChecker<T>;
  isFalse(not?: boolean): TypeChecker<T>;
  isNumber(not?: boolean): TypeChecker<T>;
  isFinite(not?: boolean): TypeChecker<T>;
  isInteger(not?: boolean): TypeChecker<T>;
  isFloat(not?: boolean): TypeChecker<T>;
  isString(not?: boolean): TypeChecker<T>;
  isEmptyString(not?: boolean): TypeChecker<T>;
  isAllWhiteSpace(not?: boolean): TypeChecker<T>;
  isBoolean(not?: boolean): TypeChecker<T>;
  isObject(not?: boolean): TypeChecker<T>;
  isPlainObject(not?: boolean): TypeChecker<T>;
  isEmptyObject(not?: boolean): TypeChecker<T>;
  isNull(not?: boolean): TypeChecker<T>;
  isUndefined(not?: boolean): TypeChecker<T>;
  isArray(not?: boolean): TypeChecker<T>;
  isEmptyArray(not?: boolean): TypeChecker<T>;
  isFunction(not?: boolean): TypeChecker<T>;
  isDate(not?: boolean): TypeChecker<T>;
  isSet(not?: boolean): TypeChecker<T>;
  isWeakSet(not?: boolean): TypeChecker<T>;
  isMap(not?: boolean): TypeChecker<T>;
  isWeakMap(not?: boolean): TypeChecker<T>;
  isSymbol(not?: boolean): TypeChecker<T>;
  isNaN(not?: boolean): TypeChecker<T>;
  isBigInt(not?: boolean): TypeChecker<T>;
  isRegExp(not?: boolean): TypeChecker<T>;
  isError(not?: boolean): TypeChecker<T>;
  isPromise(not?: boolean): TypeChecker<T>;
  isHTML(not?: boolean): TypeChecker<T>;
  isCollection(not?: boolean): TypeChecker<T>;
}

const collectionBrandKey = {};

function hasCollectionBrand(
  value: unknown,
  has: (this: object, key: object) => boolean,
): boolean {
  if (
    (typeof value !== "object" && typeof value !== "function") ||
    value === null
  ) {
    return false;
  }

  try {
    has.call(value, collectionBrandKey);
    return true;
  } catch {
    return false;
  }
}

function hasDateBrand(value: unknown): boolean {
  if (typeof value !== "object" || value === null) return false;

  try {
    Date.prototype.getTime.call(value);
    return true;
  } catch {
    return false;
  }
}

function hasRegExpBrand(value: unknown): boolean {
  if (typeof value !== "object" || value === null) return false;

  try {
    RegExp.prototype.exec.call(value, "");
    return true;
  } catch {
    return false;
  }
}

function isObjectLike(value: unknown): value is object {
  return (
    (typeof value === "object" && value !== null) || typeof value === "function"
  );
}

function isPlainObject(value: unknown): boolean {
  if (Object.prototype.toString.call(value) !== "[object Object]") return false;

  const prototype = Object.getPrototypeOf(value);
  return prototype === null || prototype === Object.prototype;
}

function isPromiseLike(value: unknown): boolean {
  if (!isObjectLike(value)) return false;

  try {
    return (
      typeof (value as { then?: unknown }).then === "function" &&
      typeof (value as { catch?: unknown }).catch === "function"
    );
  } catch {
    return false;
  }
}

function isHtmlElement(value: unknown): boolean {
  return (
    typeof Element !== "undefined" &&
    typeof value === "object" &&
    value !== null &&
    value instanceof Element
  );
}

/**
 * Creates a chainable runtime type checker for a value.
 *
 * Passing `false` to a built-in check negates that check. `unless()` toggles
 * negation for all following checks, so it can be combined with `and()` and
 * `or()` and then toggled off with another `unless()`.
 */
export function typeCheck<T>(item: T): TypeChecker<T> {
  const state = {
    returnsTrue: false,
    truths: [] as boolean[],
    isOr: false,
    isAnd: false,
    isUnless: false,
  };

  function handleBool(bool: unknown): TypeChecker<T> {
    const result = state.isUnless ? !bool : Boolean(bool);
    state.truths.push(result);

    if (state.isOr) {
      state.returnsTrue = state.truths.some((truth) => truth);
    } else if (state.isAnd) {
      state.returnsTrue = state.truths.every((truth) => truth);
    } else {
      state.returnsTrue = result;
    }

    return checker;
  }

  function process(bool: boolean, not?: boolean): TypeChecker<T> {
    return handleBool(not === false ? !bool : bool);
  }

  const checker: TypeChecker<T> = {
    item,
    get returnsTrue() {
      return state.returnsTrue;
    },
    get truths() {
      return state.truths;
    },
    get isOr() {
      return state.isOr;
    },
    get isAnd() {
      return state.isAnd;
    },
    get isUnless() {
      return state.isUnless;
    },
    yields(trueHandler, falseHandler) {
      if (state.returnsTrue && trueHandler) trueHandler(item);
      if (!state.returnsTrue && falseHandler) falseHandler(item);
      return state.returnsTrue;
    },
    check(checkFunction) {
      return handleBool(checkFunction(item));
    },
    and() {
      state.isAnd = true;
      state.isOr = false;
      return checker;
    },
    or() {
      state.isAnd = false;
      state.isOr = true;
      return checker;
    },
    unless() {
      state.isUnless = !state.isUnless;
      return checker;
    },
    isTrue(not) {
      return process(item === true, not);
    },
    isFalse(not) {
      return process(item === false, not);
    },
    isNumber(not) {
      return process(typeof item === "number" && !Number.isNaN(item), not);
    },
    isFinite(not) {
      return process(typeof item === "number" && Number.isFinite(item), not);
    },
    isInteger(not) {
      return process(typeof item === "number" && Number.isInteger(item), not);
    },
    isFloat(not) {
      return process(
        typeof item === "number" &&
          Number.isFinite(item) &&
          !Number.isInteger(item),
        not,
      );
    },
    isString(not) {
      return process(typeof item === "string", not);
    },
    isEmptyString(not) {
      return process(typeof item === "string" && item.length === 0, not);
    },
    isAllWhiteSpace(not) {
      return process(typeof item === "string" && !/\S/.test(item), not);
    },
    isBoolean(not) {
      return process(typeof item === "boolean", not);
    },
    isObject(not) {
      return process(
        typeof item === "object" && item !== null && !Array.isArray(item),
        not,
      );
    },
    isPlainObject(not) {
      return process(isPlainObject(item), not);
    },
    isEmptyObject(not) {
      return process(
        isPlainObject(item) && Object.keys(item as object).length === 0,
        not,
      );
    },
    isNull(not) {
      return process(item === null, not);
    },
    isUndefined(not) {
      return process(item === undefined, not);
    },
    isArray(not) {
      return process(Array.isArray(item), not);
    },
    isEmptyArray(not) {
      return process(Array.isArray(item) && item.length === 0, not);
    },
    isFunction(not) {
      return process(typeof item === "function", not);
    },
    isDate(not) {
      return process(hasDateBrand(item), not);
    },
    isSet(not) {
      return process(hasCollectionBrand(item, Set.prototype.has), not);
    },
    isWeakSet(not) {
      return process(hasCollectionBrand(item, WeakSet.prototype.has), not);
    },
    isMap(not) {
      return process(hasCollectionBrand(item, Map.prototype.has), not);
    },
    isWeakMap(not) {
      return process(hasCollectionBrand(item, WeakMap.prototype.has), not);
    },
    isSymbol(not) {
      return process(typeof item === "symbol", not);
    },
    isNaN(not) {
      return process(typeof item === "number" && Number.isNaN(item), not);
    },
    isBigInt(not) {
      return process(typeof item === "bigint", not);
    },
    isRegExp(not) {
      return process(hasRegExpBrand(item), not);
    },
    isError(not) {
      return process(
        isObjectLike(item) &&
          Object.prototype.toString.call(item) === "[object Error]",
        not,
      );
    },
    isPromise(not) {
      return process(isPromiseLike(item), not);
    },
    isHTML(not) {
      return process(isHtmlElement(item), not);
    },
    isCollection(not) {
      const result =
        isPlainObject(item) ||
        Array.isArray(item) ||
        hasCollectionBrand(item, Map.prototype.has) ||
        hasCollectionBrand(item, WeakMap.prototype.has) ||
        hasCollectionBrand(item, Set.prototype.has) ||
        hasCollectionBrand(item, WeakSet.prototype.has);
      return process(result, not);
    },
  };

  return checker;
}
