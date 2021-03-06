"use strict";

const prettier = require("../../tests_config/require_prettier");
const runPrettier = require("../runPrettier");

test("allows custom parser provided as object", () => {
  const output = prettier.format("1", {
    parser(text) {
      expect(text).toEqual("1");
      return {
        type: "Literal",
        value: 2,
        raw: "2"
      };
    }
  });
  expect(output).toEqual("2");
});

test("allows usage of prettier's supported parsers", () => {
  const output = prettier.format("foo ( )", {
    parser(text, parsers) {
      expect(typeof parsers.babylon).toEqual("function");
      const ast = parsers.babylon(text);
      ast.program.body[0].expression.callee.name = "bar";
      return ast;
    }
  });
  expect(output).toEqual("bar();\n");
});

describe("allows passing a string to resolve a parser", () => {
  runPrettier("./custom-parsers/", [
    "./custom-rename-input.js",
    "--parser",
    "./custom-rename-parser"
  ]).test({
    status: 0
  });
});
