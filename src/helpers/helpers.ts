import prompt from "prompt-sync";

const input = prompt();

export const colorToCode = new Map<string, string>([
  ["red", "\x1b[31m"],
  ["green", "\x1b[32m"],
  ["yellow", "\x1b[33m"],
  ["blue", "\x1b[34m"],
  ["magenta", "\x1b[35m"],
  ["cyan", "\x1b[36m"],
  ["white", "\x1b[37m"],
]);

export const resetColor = "\x1b[0m";

export const throwDie = (): number => Math.trunc(Math.random() * 6) + 1;

export const printTable = (rows: string[][]) => {
  rows.forEach((row, i, rows) => {
    let rowText = "";
    row.forEach((cell, j, cells) => {
      rowText += cell;

      if (j < cells.length - 1) {
        rowText += "\t";
        if (cell.length < 5) {
          rowText += "\t";
        }
        if (cell.length < 10) {
          rowText += "\t";
        }
        rowText += "| ";
      }
    });
    console.log(rowText);
    if (i < rows.length - 1) {
      console.log("-".repeat(row.length * 16));
    }
  });
};

type ValidationFunction = (input: string) => boolean;

export const readInput = (
  prompt: string,
  validate: ValidationFunction,
  errorMessage: string,
  autoCompleteValues?: string[]
): string => {
  const value = input({
    ask: prompt,
    autocomplete: (input: string) => {
      if (autoCompleteValues) {
        return autoCompleteValues.filter((v) =>
          v.toLowerCase().startsWith(input.toLowerCase())
        );
      }
      return [];
    },
  });
  if (value === "q" || value === null) {
    console.log("\nGoodbye!");
    process.exit(0);
  }

  if (!validate(value.trim())) {
    console.log("\n\n" + colorToCode.get("red") + errorMessage + resetColor);
    return readInput(prompt, validate, errorMessage, autoCompleteValues);
  }
  return value;
};

export const getNumberFromString = (input: string): number => {
  switch (input.toLowerCase()) {
    case "ones":
      return 1;
    case "twos":
      return 2;
    case "threes":
      return 3;
    case "fours":
      return 4;
    case "fives":
      return 5;
    case "sixes":
      return 6;
    default:
      return -1;
  }
};
