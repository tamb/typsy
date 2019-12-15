import { typeCheck } from "./index";

describe("typeCheck basics", () => {
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

    expect(
      typeCheck(number)
        .unless()
        .isInteger().isUnless
    ).toBe(true);
  });

  test("or works", () => {
    expect(
      typeCheck(12)
        .isString()
        .or()
        .isInteger()
        .yields()
    ).toBe(true);
    expect(
      typeCheck(12)
        .isString()
        .or()
        .isFloat()
        .yields()
    ).toBe(false);
    expect(
      typeCheck(12)
        .isString()
        .or()
        .isInteger()
        .or()
        .isEmptyArray()
        .yields()
    ).toBe(true);
    expect(
      typeCheck(12)
        .isString()
        .or()
        .isFloat()
        .or()
        .isDate()
        .yields()
    ).toBe(false);
    expect(
      typeCheck(12)
        .isString()
        .or()
        .isFloat().isOr
    ).toBe(true);
  });

  test("and works", () => {
    expect(
      typeCheck(new Array())
        .isArray()
        .and()
        .isEmptyArray()
        .yields()
    ).toBe(true);
    expect(
      typeCheck(12)
        .isString()
        .and()
        .isInteger()
        .yields()
    ).toBe(false);
    expect(
      typeCheck(12)
        .isString()
        .and()
        .isFloat()
        .yields()
    ).toBe(false);
    expect(
      typeCheck(12)
        .isString()
        .and()
        .isInteger()
        .and()
        .isEmptyArray()
        .yields()
    ).toBe(false);
    expect(
      typeCheck(12)
        .isString()
        .and()
        .isFloat()
        .and()
        .isDate()
        .yields()
    ).toBe(false);
    expect(
      typeCheck(12)
        .isString()
        .and()
        .isFloat().isAnd
    ).toBe(true);
  });

  test("item field returns variable value", () => {
    expect(typeCheck(15).item).toBe(15);
  });
});

describe("isSet", () => {
  test("Set is a set", () => {
    const x = new Set();
    expect(
      typeCheck(x)
        .isSet()
        .yields()
    ).toBe(true);
  });

  test("Fake Set function yields false", () => {
    function Set() {
      this.constructor = {
        name: "Set"
      };
      return this;
    }

    expect(
      typeCheck(new Set())
        .isSet()
        .yields()
    ).toBe(false);
  });

  test("Fake Set via Object.create yields false", () => {
    const Set = {
      constructor: {
        name: "Set"
      }
    };

    const fake3 = Object.create(Set);

    expect(
      typeCheck(Set)
        .isSet()
        .yields()
    ).toBe(false);
    expect(
      typeCheck(fake3)
        .isSet()
        .yields()
    ).toBe(false);
  });
});

describe("isWeakSet", () => {
  test("WeakSet is a WeakSet", () => {
    const x = new WeakSet();
    expect(
      typeCheck(x)
        .isWeakSet()
        .yields()
    ).toBe(true);
  });

  test("Fake WeakSet function yields false", () => {
    function WeakSet() {
      this.constructor = {
        name: "WeakSet"
      };
      return this;
    }

    expect(
      typeCheck(new WeakSet())
        .isWeakSet()
        .yields()
    ).toBe(false);
  });

  test("Fake WeakSet via Object.create yields false", () => {
    const WeakSet = {
      constructor: {
        name: "WeakSet"
      }
    };

    const fake3 = Object.create(WeakSet);

    expect(
      typeCheck(WeakSet)
        .isWeakSet()
        .yields()
    ).toBe(false);
    expect(
      typeCheck(fake3)
        .isWeakSet()
        .yields()
    ).toBe(false);
  });
});

describe("isMap", () => {
  test("Map is a Map", () => {
    const x = new Map();
    expect(
      typeCheck(x)
        .isMap()
        .yields()
    ).toBe(true);
  });

  test("Fake Map function yields false", () => {
    function Map() {
      this.constructor = {
        name: "Map"
      };
      return this;
    }

    expect(
      typeCheck(new Map())
        .isMap()
        .yields()
    ).toBe(false);
  });

  test("Fake Map via Object.create yields false", () => {
    const Map = {
      constructor: {
        name: "Map"
      }
    };

    const fake3 = Object.create(Map);

    expect(
      typeCheck(Map)
        .isMap()
        .yields()
    ).toBe(false);
    expect(
      typeCheck(fake3)
        .isMap()
        .yields()
    ).toBe(false);
  });
});

describe("isWeakMap", () => {
  test("WeakMap is a WeakMap", () => {
    const x = new WeakMap();
    expect(
      typeCheck(x)
        .isWeakMap()
        .yields()
    ).toBe(true);
  });

  test("Fake WeakMap function yields false", () => {
    function WeakMap() {
      this.constructor = {
        name: "WeakMap"
      };
      return this;
    }

    expect(
      typeCheck(new WeakMap())
        .isWeakMap()
        .yields()
    ).toBe(false);
  });

  test("Fake WeakMap via Object.create yields false", () => {
    const WeakMap = {
      constructor: {
        name: "WeakMap"
      }
    };

    const fake3 = Object.create(WeakMap);

    expect(
      typeCheck(WeakMap)
        .isWeakMap()
        .yields()
    ).toBe(false);
    expect(
      typeCheck(fake3)
        .isWeakMap()
        .yields()
    ).toBe(false);
  });
});

describe("custom checks", () => {
  function isNegative(value) {
    return value < 0;
  }

  test("custom check works", () => {
    expect(
      typeCheck(12)
        .check(isNegative)
        .yields()
    ).toBe(false);
    expect(
      typeCheck(-12)
        .check(isNegative)
        .yields()
    ).toBe(true);
  });

  test("can chain custom check", () => {
    expect(
      typeCheck(12)
        .isInteger()
        .and()
        .check(isNegative)
        .yields()
    ).toBe(false);
    expect(
      typeCheck(-12)
        .isInteger()
        .and()
        .check(isNegative)
        .yields()
    ).toBe(true);
    expect(
      typeCheck(12)
        .isInteger()
        .or()
        .check(isNegative)
        .yields()
    ).toBe(true);
  });
});
