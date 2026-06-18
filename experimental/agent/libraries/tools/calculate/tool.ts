import description from "./description.md" with { type: "text" };

// TODO: full expression evaluation (wolfram alpha)

enum CalculatorOperations {
  ADD = "ADD",
  SUBTRACT = "SUBTRACT",
  MULTIPLY = "MULTIPLY",
  DIVIDE = "DIVIDE",
  MODULUS = "MODULUS",
  POWER = "POWER",
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
          description:
            "The operation you wish to execute on the provdided terms.",
          enum: Object.values(CalculatorOperations),
        },
        firstTerm: {
          type: "number",
          description: `
              The first term in the calculation.
              Remember that for commutive operations like addition, 
              the term order does not produce different results:
              but for division, subtraction, etc, the order *does* matter.
            `,
        },
        secondTerm: {
          type: "number",
          description: "The second term in the calculation.",
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
