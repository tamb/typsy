import typeCheck from "./typecheck";

describe("typeCheck", () => {
  test("Integer test to return true for Negative and Positive Integer.  String is not an Int", () => {
    expect(typeCheck(12).isInteger()).toBe(true);
    expect(typeCheck(-12).isInteger()).toBe(true);
    expect(typeCheck(null).isInteger()).toBe(false);
  });
  test("String to be string and int to be false", () => {
    expect(typeCheck("Is string").isString()).toBe(true);
    expect(typeCheck(-12).isString()).toBe(false);
  });

  test("Empty String to be true, any characters to be false", () => {
    expect(typeCheck("").isEmptyString()).toBe(true);
    expect(typeCheck("    ").isEmptyString()).toBe(false);
    expect(typeCheck("hey").isEmptyString()).toBe(false);
  });

  test("String with all whitespace is true", () => {
    expect(typeCheck("").isAllWhiteSpace()).toBe(true);
    expect(typeCheck("    ").isAllWhiteSpace()).toBe(true);
    expect(typeCheck("    hey    ").isAllWhiteSpace()).toBe(false);
  });

  test("Booleans are true, booleans as string are false", () => {
    expect(typeCheck(false).isBoolean()).toBe(true);
    expect(typeCheck(true).isBoolean()).toBe(true);
    expect(typeCheck(0).isBoolean()).toBe(false);
    expect(typeCheck("false").isBoolean()).toBe(false);
    expect(typeCheck("true").isBoolean()).toBe(false);
  });

  test("Only a strict object, not an array, is an object", () => {
    expect(typeCheck({}).isObject()).toBe(true);
    expect(typeCheck(new Array()).isObject()).toBe(false);
    expect(typeCheck(null).isObject()).toBe(false);
    expect(typeCheck("tom").isObject()).toBe(false);
  });

  test("Negative, positive and non-string floats are floats", () => {
    expect(typeCheck(2.34).isFloat()).toBe(true);
    expect(typeCheck(-2.34).isFloat()).toBe(true);
    expect(typeCheck(234).isFloat()).toBe(false);
    expect(typeCheck("23.23").isFloat()).toBe(false);
  });

  test("null is null", () => {
    let x;
    expect(typeCheck(null).isNull()).toBe(true);
    expect(typeCheck("null").isNull()).toBe(false);
    expect(typeCheck("").isNull()).toBe(false);
    expect(typeCheck(x).isNull()).toBe(false);
  });

  test("undefined is undefined", () => {
    let x;
    expect(typeCheck(x).isUndefined()).toBe(true);
    expect(typeCheck("undefined").isUndefined()).toBe(false);
    expect(typeCheck("").isUndefined()).toBe(false);
    x = 12;
    expect(typeCheck(x).isUndefined()).toBe(false);
  });

  test("array is array", () => {
    let x;
    expect(typeCheck(x).isArray()).toBe(false);
    expect(typeCheck("Array").isArray()).toBe(false);
    expect(typeCheck("[]").isArray()).toBe(false);
    x = [];
    expect(typeCheck(x).isArray()).toBe(true);
    expect(typeCheck(new Array()).isArray()).toBe(true);
    x = [1, 2, 3];
    expect(typeCheck(x).isArray()).toBe(true);
  });

  // TODO - empty array, function
});
