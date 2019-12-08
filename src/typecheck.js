export default function typeCheck(item) {
  function handleBool(mod, bool) {
    mod.truths.push(bool);
    if (mod.isOr) {
      mod.isTrue = mod.truths.some(item => item === true);
    } else if (mod.isAnd) {
      mod.isTrue = mod.truths.every(item => item === true);
    } else if (mod.isUnless) {
      mod.isTrue = !bool;
    } else {
      mod.isTrue = bool;
    }

    return mod;
  }

  const mod = {
    item,
    isTrue: false,
    yields: () => mod.isTrue,
    truths: [],
    isOr: false,
    isAnd: false,
    isUnless: false,
    and: () => {
      mod.isAnd = true;
      mod.isUnless = false;
      mod.isOr = false;
      return mod;
    },
    or: () => {
      mod.isAnd = false;
      mod.isUnless = false;
      mod.isOr = true;
      return mod;
    },
    unless: () => {
      mod.isAnd = false;
      mod.isUnless = true;
      mod.isOr = false;
      return mod;
    },
    isInteger: () => {
      const bool = typeof item === "number" && item % 1 === 0;
      return handleBool(mod, bool);
    },
    isString: () => {
      const bool = typeof item === "string";
      return handleBool(mod, bool);
    },
    isEmptyString: () => {
      const bool = typeof item === "string" && item.length === 0;
      return handleBool(mod, bool);
    },
    isAllWhiteSpace: () => {
      const bool = typeof item === "string" && !/\S/.test(item);
      return handleBool(mod, bool);
    },
    isBoolean: () => {
      const bool = typeof item === "boolean";
      return handleBool(mod, bool);
    },
    isFloat: () => {
      const bool = typeof item === "number" && item % 1 !== 0;
      return handleBool(mod, bool);
    },
    isNegativeFloat: () => {
      const bool = typeof item === "number" && item % 1 !== 0 && item < 0;
      return handleBool(mod, bool);
    },
    isObject: () => {
      const bool =
        typeof item === "object" && item !== null && !Array.isArray(item);
      return handleBool(mod, bool);
    },
    isNull: () => {
      const bool = typeof item === "object" && item === null;
      return handleBool(mod, bool);
    },
    isUndefined: () => {
      const bool = typeof item === "undefined" && item === undefined;
      return handleBool(mod, bool);
    },
    isArray: () => {
      const bool = Array.isArray(item);
      return handleBool(mod, bool);
    },
    isEmptyArray: () => {
      const bool = Array.isArray(item) && item.length === 0;
      return handleBool(mod, bool);
    },
    isFunction: () => {
      const bool = typeof item === "function";
      return handleBool(mod, bool);
    }
  };

  return mod;
}
