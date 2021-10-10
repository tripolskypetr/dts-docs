import { readFileSync } from "fs";
import * as ts from "typescript";
import { parseEnum, printEnum } from "./enum";
import { EnumDocEntry } from "./types";

test("parse enum", () => {
  const file = "./testdata/enum.d.ts";
  const program = ts.createProgram([file], {});
  const sourceFile = program.getSourceFile(file);
  const checker = program.getTypeChecker();
  const printer = ts.createPrinter({
    newLine: ts.NewLineKind.LineFeed,
    removeComments: true,
  });

  const enums: EnumDocEntry[] = [];
  ts.forEachChild(sourceFile, (node) => {
    if (ts.isEnumDeclaration(node)) {
      enums.push(parseEnum(node, checker, printer, sourceFile));
    }
  });

  const want = [
    {
      name: "Direction",
      documentation: "The direction.",
      type: "typeof Direction",
      raw: `export enum Direction {
    Up = "UP",
    Down = "DOWN",
    Left = "LEFT",
    Right = "RIGHT"
}`,
    },
  ];

  expect(enums.length).toBe(1);
  expect(enums).toEqual(want);
});

test("print enum", () => {
  const got = [
    {
      name: "Direction",
      documentation: "The direction.",
      type: "typeof Direction",
      raw: `export enum Direction {
    Up = "UP",
    Down = "DOWN",
    Left = "LEFT",
    Right = "RIGHT"
}`,
    },
  ];

  const want = readFileSync("./testdata/enum.d.md", "utf-8");

  expect(got.map(printEnum).join("\n")).toEqual(want);
});
