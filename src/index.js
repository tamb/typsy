export function typeCheck(item) {
  function handleBool(mod, bool) {
    mod.truths.push(bool);
    if (mod.isOr) {
      mod.returnsTrue = mod.truths.some(item => item === true);
    } else if (mod.isAnd) {
      mod.returnsTrue = mod.truths.every(item => item === true);
    } else if (mod.isUnless) {
      mod.returnsTrue = !bool;
    } else {
      mod.returnsTrue = bool;
    }

    return mod;
  }

  function process(_mod, _bool, _not) {
    return handleBool(_mod, _not === false ? !_bool : _bool);
  }

  const mod = {
    item,
    yields: (trueHandler, falseHandler) => {
      if (mod.returnsTrue && trueHandler) trueHandler(item);
      if (!mod.returnsTrue && falseHandler) falseHandler(item);
      return mod.returnsTrue;
    },
    returnsTrue: false,
    truths: [],
    isOr: false,
    isAnd: false,
    isUnless: false,
    check(checkFunction) {
      const bool = checkFunction(item);
      return handleBool(mod, bool);
    },
    and() {
      mod.isAnd = true;
      mod.isUnless = false;
      mod.isOr = false;
      return mod;
    },
    or() {
      mod.isAnd = false;
      mod.isUnless = false;
      mod.isOr = true;
      return mod;
    },
    unless() {
      mod.isAnd = false;
      mod.isUnless = true;
      mod.isOr = false;
      return mod;
    },
    isTrue(not) {
      const bool = item === true;
      return process(mod, bool, not);
    },
    isFalse(not) {
      const bool = item === false;
      return process(mod, bool, not);
    },
    isInteger(not) {
      const bool = typeof item === "number" && item % 1 === 0;
      return process(mod, bool, not);
    },
    isString(not) {
      const bool = typeof item === "string";
      return process(mod, bool, not);
    },
    isEmptyString(not) {
      const bool = typeof item === "string" && item.length === 0;
      return process(mod, bool, not);
    },
    isAllWhiteSpace(not) {
      const bool = typeof item === "string" && !/\S/.test(item);
      return process(mod, bool, not);
    },
    isBoolean(not) {
      const bool = typeof item === "boolean";
      return process(mod, bool, not);
    },
    isFloat(not) {
      const bool = typeof item === "number" && item % 1 !== 0;
      return process(mod, bool, not);
    },
    isObject(not) {
      const bool =
        typeof item === "object" && item !== null && !Array.isArray(item);
      return process(mod, bool, not);
    },
    isNull(not) {
      const bool = typeof item === "object" && item === null;
      return process(mod, bool, not);
    },
    isUndefined(not) {
      const bool = typeof item === "undefined" && item === undefined;
      return process(mod, bool, not);
    },
    isArray(not) {
      const bool = Array.isArray(item);
      return process(mod, bool, not);
    },
    isEmptyArray(not) {
      const bool = Array.isArray(item) && item.length === 0;
      return process(mod, bool, not);
    },
    isFunction(not) {
      const bool = typeof item === "function";
      return process(mod, bool, not);
    },
    isDate(not) {
      const bool = item instanceof Date;
      return process(mod, bool, not);
    },
    isSet(not) {
      const bool =
        typeof item === "object" &&
        item.constructor.name === "Set" &&
        item instanceof Set;
      return process(mod, bool, not);
    },
    isWeakSet(not) {
      const bool =
        typeof item === "object" &&
        item.constructor.name === "WeakSet" &&
        item instanceof WeakSet;
      return process(mod, bool, not);
    },
    isMap(not) {
      const bool =
        typeof item === "object" &&
        item.constructor.name === "Map" &&
        item instanceof Map;
      return process(mod, bool, not);
    },
    isWeakMap(not) {
      const bool =
        typeof item === "object" &&
        item.constructor.name === "WeakMap" &&
        item instanceof WeakMap;
      return process(mod, bool, not);
    }
  };

  return mod;
}
