import description from "./description.md" with { type: "text" };

enum CalculatorOperations {
  ADD = "ADD",
  SUBTRACT = "SUBTRACT",
  MULTIPLY = "MULTIPLY",
  DIVIDE = "DIVIDE",
  MODULUS = "MODULUS",
  POWER = "POWER"
}

export const definition = {
  type: "function",
  function: {
    name: "calculate",
    description,
    parameters: {
      type: "object",
      properties: {
        operation: {
          type: "string",
          description: "TODO",
          enum: Object.values(CalculatorOperations)
        },
        firstTerm: {
          type: "number",
          description: "TODO"
        },
        secondTerm: {
          type: "number",
          description: "TODO"
        },
      },
      required: ["operation", "firstTerm", "secondTerm"],
    },
  },
};

export default (
  { operation, firstTerm, secondTerm }: {
    operation: CalculatorOperations;
    firstTerm: number;
    secondTerm: number;
  },
): number => {
  switch (operation) {
    case CalculatorOperations.ADD:
      return firstTerm + secondTerm;
    case CalculatorOperations.SUBTRACT:
      return firstTerm - secondTerm;
    case CalculatorOperations.MULTIPLY:
      return firstTerm * secondTerm;
    case CalculatorOperations.DIVIDE:
      if (secondTerm === 0) {
        throw new Error("Cannot divide by zero.");
      }

      return firstTerm / secondTerm;
    case CalculatorOperations.MODULUS:
      if (secondTerm === 0) {
        throw new Error("Cannot mod by zero.");
      }

      return firstTerm % secondTerm;
    case CalculatorOperations.POWER:
      return firstTerm ** secondTerm;
  }
};
