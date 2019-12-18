export function typeCheck(item) {
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
    isInteger() {
      const bool = typeof item === "number" && item % 1 === 0;
      return handleBool(mod, bool);
    },
    isString() {
      const bool = typeof item === "string";
      return handleBool(mod, bool);
    },
    isEmptyString() {
      const bool = typeof item === "string" && item.length === 0;
      return handleBool(mod, bool);
    },
    isAllWhiteSpace() {
      const bool = typeof item === "string" && !/\S/.test(item);
      return handleBool(mod, bool);
    },
    isBoolean() {
      const bool = typeof item === "boolean";
      return handleBool(mod, bool);
    },
    isFloat() {
      const bool = typeof item === "number" && item % 1 !== 0;
      return handleBool(mod, bool);
    },
    isObject() {
      const bool =
        typeof item === "object" && item !== null && !Array.isArray(item);
      return handleBool(mod, bool);
    },
    isNull() {
      const bool = typeof item === "object" && item === null;
      return handleBool(mod, bool);
    },
    isUndefined() {
      const bool = typeof item === "undefined" && item === undefined;
      return handleBool(mod, bool);
    },
    isArray() {
      const bool = Array.isArray(item);
      return handleBool(mod, bool);
    },
    isEmptyArray() {
      const bool = Array.isArray(item) && item.length === 0;
      return handleBool(mod, bool);
    },
    isFunction() {
      const bool = typeof item === "function";
      return handleBool(mod, bool);
    },
    isDate() {
      const bool = item instanceof Date;
      return handleBool(mod, bool);
    },
    isSet() {
      const bool =
        typeof item === "object" &&
        item.constructor.name === "Set" &&
        item instanceof Set;
      return handleBool(mod, bool);
    },
    isWeakSet() {
      const bool =
        typeof item === "object" &&
        item.constructor.name === "WeakSet" &&
        item instanceof WeakSet;
      return handleBool(mod, bool);
    },
    isMap() {
      const bool =
        typeof item === "object" &&
        item.constructor.name === "Map" &&
        item instanceof Map;
      return handleBool(mod, bool);
    },
    isWeakMap() {
      const bool =
        typeof item === "object" &&
        item.constructor.name === "WeakMap" &&
        item instanceof WeakMap;
      return handleBool(mod, bool);
    },
    isComment() {
      const bool = item === Node.COMMENT_NODE;
      return handleBool(mod, bool);
    },
    isElement() {
      const bool = item === Node.ELEMENT_NODE;
      return handleBool(mod, bool);
    },
    isTextNode() {
      const bool = item === Node.TEXT_NODE;
      return handleBool(mod, bool);
    },
    isDocFragment() {
      const bool = item === Node.DOCUMENT_FRAGMENT_NODE;
      return handleBool(mod, bool);
    },
    isDocument() {
      const bool = item === Node.DOCUMENT_NODE;
      return handleBool(mod, bool);
    },
    isDocType() {
      const bool = item === Node.DOCUMENT_TYPE_NODE;
      return handleBool(mod, bool);
    },
    isElementType(type) {
      const bool = item.nodeName === type.trim().toUpperCase();
      return handleBool(mod, bool);
    },
    isNodeList() {
      const bool = NodeList.prototype.isPrototypeOf(item);
      return handleBool(mod, bool);
    },
    isElementCollection() {
      const bool = HTMLCollection.prototype.isPrototypeOf(item);
      return handleBool(mod, bool);
    },
    isElementCollectionOf(type) {
      const bool = item.every(el => el.nodeName === type.trim().toUpperCase());
      return handleBool(mod, bool);
    }
  };

  return mod;
}
