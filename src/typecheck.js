export default function typeCheck(item) {
    return {
      item,
      isInteger: () => typeof item === "number" && item % 1 === 0,
      isNegativeInteger: () =>
        typeof item === "number" && item % 1 === 0 && item < 0,
      isString: () => typeof item === "string",
      isEmptyString: () => typeof item === "string" && item.length === 0,
      isBoolean: () => typeof item === "boolean",
      isFloat: () => typeof item === "number" && item % 1 !== 0,
      isNegativeFloat: () =>
        typeof item === "number" && item % 1 !== 0 && item < 0,
      isObject: () => typeof item === "object" && item !== null,
      isNull: () => typeof item === "object" && item === null,
      isUndefined: () => typeof item === "undefined" && item === undefined,
      isArray: () => Array.isArray(item),
      isEmptyArray: () => Array.isArray(item) && item.length === 0
    };
  }
  let x;
  console.log("Int", typeCheck(12).isInteger());
  console.log("Str", typeCheck("hello").isString());
  console.log("Bool", typeCheck(true).isBoolean());
  console.log("Flt", typeCheck(1.1).isFloat());
  console.log("Null", typeCheck(null).isNull());
  console.log("Obj", typeCheck({}).isObject());
  console.log("Undf", typeCheck(x).isUndefined());
  console.log("Arr", typeCheck([1, 2]).isArray());
  console.log("Empty Arr", typeCheck([]).isEmptyArray());
  console.log("Empty Str", typeCheck("").isEmptyString());
  console.log("Neg Int", typeCheck(-12).isNegativeInteger());
  console.log("Neg Flt", typeCheck(-1.1).isNegativeFloat());