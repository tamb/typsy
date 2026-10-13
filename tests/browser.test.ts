// @vitest-environment happy-dom

import { describe, expect, it } from "vitest";

import { typeCheck } from "../src/index";

describe("browser compatibility", () => {
  it("recognizes HTML elements", () => {
    const element = document.createElement("div");

    expect(typeCheck(element).isHTML().yields()).toBe(true);
    expect(typeCheck(document.createTextNode("text")).isHTML().yields()).toBe(
      false,
    );
  });

  it("safely rejects element-like objects", () => {
    expect(typeCheck({ tagName: "DIV" }).isHTML().yields()).toBe(false);
    expect(typeCheck(null).isHTML().yields()).toBe(false);
  });
});
