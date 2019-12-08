import { typeCheck } from "./index";

describe("typeCheck", () => {
  test("Integer test to return true for Negative and Positive Integer.  String is not an Int", () => {
    expect(
      typeCheck(12)
        .isInteger()
        .yields()
    ).toBe(true);
    expect(
      typeCheck(-12)
        .isInteger()
        .yields()
    ).toBe(true);
    expect(
      typeCheck(null)
        .isInteger()
        .yields()
    ).toBe(false);
  });
  test("String to be string and int to be false", () => {
    expect(
      typeCheck("Is string")
        .isString()
        .yields()
    ).toBe(true);
    expect(
      typeCheck(-12)
        .isString()
        .yields()
    ).toBe(false);
  });

  test("Empty String to be true, any characters to be false", () => {
    expect(
      typeCheck("")
        .isEmptyString()
        .yields()
    ).toBe(true);
    expect(
      typeCheck("    ")
        .isEmptyString()
        .yields()
    ).toBe(false);
    expect(
      typeCheck("hey")
        .isEmptyString()
        .yields()
    ).toBe(false);
  });

  test("String with all whitespace is true", () => {
    expect(
      typeCheck("")
        .isAllWhiteSpace()
        .yields()
    ).toBe(true);
    expect(
      typeCheck("    ")
        .isAllWhiteSpace()
        .yields()
    ).toBe(true);
    expect(
      typeCheck("    hey    ")
        .isAllWhiteSpace()
        .yields()
    ).toBe(false);
  });

  test("Booleans are true, booleans as string are false", () => {
    expect(
      typeCheck(false)
        .isBoolean()
        .yields()
    ).toBe(true);
    expect(
      typeCheck(true)
        .isBoolean()
        .yields()
    ).toBe(true);
    expect(
      typeCheck(0)
        .isBoolean()
        .yields()
    ).toBe(false);
    expect(
      typeCheck("false")
        .isBoolean()
        .yields()
    ).toBe(false);
    expect(
      typeCheck("true")
        .isBoolean()
        .yields()
    ).toBe(false);
  });

  test("Only a strict object, not an array, is an object", () => {
    expect(
      typeCheck({})
        .isObject()
        .yields()
    ).toBe(true);
    expect(
      typeCheck(new Array())
        .isObject()
        .yields()
    ).toBe(false);
    expect(
      typeCheck(null)
        .isObject()
        .yields()
    ).toBe(false);
    expect(
      typeCheck("tom")
        .isObject()
        .yields()
    ).toBe(false);
  });

  test("Negative, positive and non-string floats are floats", () => {
    expect(
      typeCheck(2.34)
        .isFloat()
        .yields()
    ).toBe(true);
    expect(
      typeCheck(-2.34)
        .isFloat()
        .yields()
    ).toBe(true);
    expect(
      typeCheck(234)
        .isFloat()
        .yields()
    ).toBe(false);
    expect(
      typeCheck("23.23")
        .isFloat()
        .yields()
    ).toBe(false);
  });

  test("null is null", () => {
    let x;
    expect(
      typeCheck(null)
        .isNull()
        .yields()
    ).toBe(true);
    expect(
      typeCheck("null")
        .isNull()
        .yields()
    ).toBe(false);
    expect(
      typeCheck("")
        .isNull()
        .yields()
    ).toBe(false);
    expect(
      typeCheck(x)
        .isNull()
        .yields()
    ).toBe(false);
  });

  test("undefined is undefined", () => {
    let x;
    expect(
      typeCheck(x)
        .isUndefined()
        .yields()
    ).toBe(true);
    expect(
      typeCheck("undefined")
        .isUndefined()
        .yields()
    ).toBe(false);
    expect(
      typeCheck("")
        .isUndefined()
        .yields()
    ).toBe(false);
    x = 12;
    expect(
      typeCheck(x)
        .isUndefined()
        .yields()
    ).toBe(false);
  });

  test("array is array", () => {
    let x;
    expect(
      typeCheck(x)
        .isArray()
        .yields()
    ).toBe(false);
    expect(
      typeCheck("Array")
        .isArray()
        .yields()
    ).toBe(false);
    expect(
      typeCheck("[]")
        .isArray()
        .yields()
    ).toBe(false);
    x = [];
    expect(
      typeCheck(x)
        .isArray()
        .yields()
    ).toBe(true);
    expect(
      typeCheck(new Array())
        .isArray()
        .yields()
    ).toBe(true);
    x = [1, 2, 3];
    expect(
      typeCheck(x)
        .isArray()
        .yields()
    ).toBe(true);
  });

  test("empty array is true only when empty", () => {
    let x;
    expect(
      typeCheck(x)
        .isEmptyArray()
        .yields()
    ).toBe(false);
    expect(
      typeCheck("Array")
        .isEmptyArray()
        .yields()
    ).toBe(false);
    expect(
      typeCheck([])
        .isEmptyArray()
        .yields()
    ).toBe(true);
    x = [];
    expect(
      typeCheck(x)
        .isEmptyArray()
        .yields()
    ).toBe(true);
    expect(
      typeCheck(new Array())
        .isEmptyArray()
        .yields()
    ).toBe(true);
    x = [1, 2, 3];
    expect(
      typeCheck(x)
        .isEmptyArray()
        .yields()
    ).toBe(false);
  });

  test("function is a function", () => {
    let x;
    expect(
      typeCheck(x)
        .isFunction()
        .yields()
    ).toBe(false);
    expect(
      typeCheck(() => {})
        .isFunction()
        .yields()
    ).toBe(true);
    expect(
      typeCheck(function Tom() {})
        .isFunction()
        .yields()
    ).toBe(true);
    x = () => {};
    expect(
      typeCheck(x)
        .isFunction()
        .yields()
    ).toBe(true);
  });

  test("date is date", () => {
    const x = new Date();
    const dateString = "12-12-2099";
    expect(
      typeCheck(x)
        .isDate()
        .yields()
    ).toBe(true);
    expect(
      typeCheck(dateString)
        .isDate()
        .yields()
    ).toBe(false);
  });

  test("unless works", () => {
    const name = "foobar";
    const number = 234;

    expect(
      typeCheck(name)
        .unless()
        .isString()
        .yields()
    ).toBe(false);
    expect(
      typeCheck(name)
        .unless()
        .isInteger()
        .yields()
    ).toBe(true);

    expect(
      typeCheck(number)
        .unless()
        .isString()
        .yields()
    ).toBe(true);
    expect(
      typeCheck(number)
        .unless()
        .isInteger()
        .yields()
    ).toBe(false);
  });

  // test chaining with or

  // test chaining with and

  // test chaining with unless
});
