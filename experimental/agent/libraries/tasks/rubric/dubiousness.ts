import type { Rubric } from "../types.ts";

export const dubiousness: Rubric = {
  description:
    "The degree to which a statement is questionable, suspicious, or potentially inaccurate. A high score suggests research or fact-checking is necessary.",
  examples: {
    1: [
      "The sun rises in the east.",
      "GitHub: 1 new commit.",
      "I'm feeling happy today.",
    ],
    3: [
      "I heard that Apple is releasing a new car next year.",
      "Most studies show that coffee is good for you.",
    ],
    5: [
      "I'm sure I could install those solar panels myself, no problem!",
      "The moon landing was faked in a studio.",
      "I can cure most diseases with just this one secret herb.",
      "Scientists have proven that gravity is actually a hoax.",
    ],
  },
};
