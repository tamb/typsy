export default function typeCheck(item) {
  return {
    item,
    isInteger: () => typeof item === "number" && item % 1 === 0,
    isString: () => typeof item === "string",
    isEmptyString: () => typeof item === "string" && item.length === 0,
    isAllWhiteSpace: () => typeof item === "string" && !/\S/.test(item),
    isBoolean: () => typeof item === "boolean",
    isFloat: () => typeof item === "number" && item % 1 !== 0,
    isObject: () =>
      typeof item === "object" && item !== null && !Array.isArray(item),
    isNull: () => typeof item === "object" && item === null,
    isUndefined: () => typeof item === "undefined" && item === undefined,
    isArray: () => Array.isArray(item),
    isEmptyArray: () => Array.isArray(item) && item.length === 0,
    isFunction: () => typeof item === "function"
  };
}
