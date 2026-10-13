import vm from "node:vm";
import { describe, expect, it, vi } from "vitest";

import { typeCheck } from "../src/index";

const yields = (value: unknown, check: keyof ReturnType<typeof typeCheck>) => {
  const checker = typeCheck(value);
  const method = checker[check] as (not?: boolean) => typeof checker;
  return method.call(checker).yields();
};

describe("primitive checks", () => {
  it.each([
    ["isTrue", true, true],
    ["isTrue", 1, false],
    ["isFalse", false, true],
    ["isFalse", 0, false],
    ["isNumber", 1, true],
    ["isNumber", Number.NaN, false],
    ["isNumber", "1", false],
    ["isFinite", -1.5, true],
    ["isFinite", Number.POSITIVE_INFINITY, false],
    ["isInteger", -12, true],
    ["isInteger", 12.2, false],
    ["isFloat", -12.2, true],
    ["isFloat", 12, false],
    ["isFloat", Number.POSITIVE_INFINITY, false],
    ["isString", "", true],
    ["isString", 12, false],
    ["isEmptyString", "", true],
    ["isEmptyString", " ", false],
    ["isAllWhiteSpace", "", true],
    ["isAllWhiteSpace", " \n\t", true],
    ["isAllWhiteSpace", " text ", false],
    ["isBoolean", false, true],
    ["isBoolean", "false", false],
    ["isNull", null, true],
    ["isNull", undefined, false],
    ["isUndefined", undefined, true],
    ["isUndefined", null, false],
    ["isSymbol", Symbol("value"), true],
    ["isSymbol", "symbol", false],
    ["isNaN", Number.NaN, true],
    ["isNaN", "not a number", false],
    ["isBigInt", BigInt(1), true],
    ["isBigInt", 1, false],
  ] as const)("%s returns %s for %j", (check, value, expected) => {
    expect(yields(value, check)).toBe(expected);
  });

  it("negates an individual check only when false is passed", () => {
    expect(typeCheck(3).isInteger(false).yields()).toBe(false);
    expect(typeCheck("3").isInteger(false).yields()).toBe(true);
    expect(typeCheck(3).isInteger(true).yields()).toBe(true);
  });
});

describe("object checks", () => {
  it("distinguishes objects, plain objects, and empty objects", () => {
    expect(
      typeCheck({}).isObject().isPlainObject().isEmptyObject().yields(),
    ).toBe(true);
    expect(
      typeCheck(Object.create(null)).isPlainObject().isEmptyObject().yields(),
    ).toBe(true);
    expect(typeCheck({ value: 1 }).isEmptyObject().yields()).toBe(false);
    expect(typeCheck([]).isObject().yields()).toBe(false);
    expect(typeCheck(new Date()).isObject().isPlainObject().yields()).toBe(
      false,
    );
    expect(
      typeCheck(null).isObject().isPlainObject().isEmptyObject().yields(),
    ).toBe(false);
  });

  it("checks arrays and functions", () => {
    expect(typeCheck([]).isArray().and().isEmptyArray().yields()).toBe(true);
    expect(typeCheck([1]).isArray().and().isEmptyArray().yields()).toBe(false);
    expect(
      typeCheck(() => undefined)
        .isFunction()
        .yields(),
    ).toBe(true);
    expect(typeCheck({}).isFunction().yields()).toBe(false);
  });

  it("uses built-in brands for dates and regular expressions", () => {
    expect(typeCheck(new Date("invalid")).isDate().yields()).toBe(true);
    expect(typeCheck(/value/).isRegExp().yields()).toBe(true);
    expect(
      typeCheck({ [Symbol.toStringTag]: "RegExp" })
        .isRegExp()
        .yields(),
    ).toBe(false);
  });

  it("checks errors and promises", () => {
    expect(typeCheck(new TypeError("nope")).isError().yields()).toBe(true);
    expect(
      typeCheck({ name: "Error", message: "nope" }).isError().yields(),
    ).toBe(false);
    expect(typeCheck(Promise.resolve()).isPromise().yields()).toBe(true);
    expect(
      typeCheck({ then() {}, catch() {} })
        .isPromise()
        .yields(),
    ).toBe(true);
    expect(
      typeCheck({ then() {} })
        .isPromise()
        .yields(),
    ).toBe(false);

    const throwingThen = Object.defineProperty({}, "then", {
      get() {
        throw new Error("getter failed");
      },
    });
    expect(typeCheck(throwingThen).isPromise().yields()).toBe(false);
  });
});

describe("collection checks", () => {
  it.each([
    [new Set(), "isSet"],
    [new WeakSet(), "isWeakSet"],
    [new Map(), "isMap"],
    [new WeakMap(), "isWeakMap"],
  ] as const)("recognizes %s", (value, check) => {
    expect(yields(value, check)).toBe(true);
  });

  it("does not throw for null, primitives, null prototypes, or branded fakes", () => {
    const fake = { constructor: { name: "Set" } };

    for (const value of [
      null,
      undefined,
      1,
      "Map",
      Object.create(null),
      fake,
    ]) {
      expect(() =>
        typeCheck(value).isSet().isMap().isWeakSet().isWeakMap(),
      ).not.toThrow();
      expect(
        typeCheck(value)
          .isSet()
          .or()
          .isMap()
          .or()
          .isWeakSet()
          .or()
          .isWeakMap()
          .yields(),
      ).toBe(false);
    }
  });

  it("recognizes collections from another JavaScript realm", () => {
    const foreignMap = vm.runInNewContext("new Map()") as unknown;
    const foreignSet = vm.runInNewContext("new Set()") as unknown;

    expect(typeCheck(foreignMap).isMap().yields()).toBe(true);
    expect(typeCheck(foreignSet).isSet().yields()).toBe(true);
  });

  it.each([
    [{}, true],
    [[], true],
    [new Map(), true],
    [new WeakMap(), true],
    [new Set(), true],
    [new WeakSet(), true],
    [new Date(), false],
    [/value/, false],
    [null, false],
    ["value", false],
  ])("classifies %j as a collection: %s", (value, expected) => {
    expect(typeCheck(value).isCollection().yields()).toBe(expected);
  });
});

describe("logical chaining", () => {
  it("supports or chains", () => {
    expect(typeCheck(12).isString().or().isInteger().yields()).toBe(true);
    expect(typeCheck(12).isString().or().isFloat().yields()).toBe(false);
  });

  it("supports and chains", () => {
    expect(typeCheck([]).isArray().and().isEmptyArray().yields()).toBe(true);
    expect(typeCheck([1]).isArray().and().isEmptyArray().yields()).toBe(false);
  });

  it("keeps unless independent from and/or and allows it to be toggled", () => {
    const result = typeCheck(12)
      .unless()
      .isString()
      .and()
      .isFloat()
      .unless()
      .and()
      .isInteger();

    expect(result.isUnless).toBe(false);
    expect(result.isAnd).toBe(true);
    expect(result.truths).toEqual([true, true, true]);
    expect(result.yields()).toBe(true);
  });

  it("exposes current state without allowing it to drift from results", () => {
    const checker = typeCheck(12).isString().or().isInteger();

    expect(checker.item).toBe(12);
    expect(checker.isOr).toBe(true);
    expect(checker.isAnd).toBe(false);
    expect(checker.returnsTrue).toBe(true);
    expect(checker.truths).toEqual([false, true]);
  });
});

describe("custom checks and callbacks", () => {
  it("supports custom checks and normalizes truthy results", () => {
    expect(
      typeCheck(-1)
        .check((value) => value < 0)
        .yields(),
    ).toBe(true);
    expect(
      typeCheck("value")
        .check(() => "truthy")
        .yields(),
    ).toBe(true);
    expect(
      typeCheck("value")
        .check(() => "")
        .yields(),
    ).toBe(false);
  });

  it("calls only the matching callback with the checked item", () => {
    const onTrue = vi.fn();
    const onFalse = vi.fn();

    const result = typeCheck(21).isInteger().yields(onTrue, onFalse);

    expect(result).toBe(true);
    expect(onTrue).toHaveBeenCalledOnce();
    expect(onTrue).toHaveBeenCalledWith(21);
    expect(onFalse).not.toHaveBeenCalled();
  });

  it("calls the false callback for a failed check", () => {
    const onTrue = vi.fn();
    const onFalse = vi.fn();

    typeCheck("value").isInteger().yields(onTrue, onFalse);

    expect(onTrue).not.toHaveBeenCalled();
    expect(onFalse).toHaveBeenCalledWith("value");
  });
});

describe("Node compatibility", () => {
  it("returns false for HTML checks when browser globals are unavailable", () => {
    expect(globalThis.Element).toBeUndefined();
    expect(typeCheck(null).isHTML().yields()).toBe(false);
    expect(typeCheck({ tagName: "DIV" }).isHTML().yields()).toBe(false);
  });
});
