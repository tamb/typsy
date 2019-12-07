import typeCheck from "./typecheck";

describe("typeCheck function works", () => {
  test("Integer test to return true for Negative and Positive Integer", () => {
    expect(typeCheck(12).isInteger()).toBe(true);
    expect(typeCheck(-12).isInteger()).toBe(true);
  });
  // let x;
  // console.log("Str", typeCheck("hello").isString());
  // console.log("Bool", typeCheck(true).isBoolean());
  // console.log("Flt", typeCheck(1.1).isFloat());
  // console.log("Null", typeCheck(null).isNull());
  // console.log("Obj", typeCheck({}).isObject());
  // console.log("Undf", typeCheck(x).isUndefined());
  // console.log("Arr", typeCheck([1, 2]).isArray());
  // console.log("Empty Arr", typeCheck([]).isEmptyArray());
  // console.log("Empty Str", typeCheck("").isEmptyString());
  // console.log("Neg Int", typeCheck(-12).isNegativeInteger());
  // console.log("Neg Flt", typeCheck(-1.1).isNegativeFloat());
});
