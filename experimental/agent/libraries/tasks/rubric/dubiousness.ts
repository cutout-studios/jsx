import type { Rubric } from "../types.ts";

export const dubiousness: Rubric = {
  name: "Dubiousness",
  description:
    "The degree to which a statement contains questionable, suspicious, or potentially inaccurate information. A high score suggests research or fact-checking is necessary.",
  scores: {
    1: {
      description:
        "The statement states a plain fact that is either common knowledge, relatively inconsequential, or from the source.",
      examples: [
        "The sun rises in the east.",
        "GitHub: 1 new commit.",
        "I'm feeling happy today.",
      ],
    },
    3: {
      description:
        "The statement contains secondary information, heresay, or other broader claims that, if true, hold some impact beyond the immediate.",
      examples: [
        "I heard that Apple is releasing a new car next year.",
        "Most studies show that coffee is good for you.",
      ],
    },
    5: {
      description:
        "The statement reads as boastful, wildly consequential, or directly in conflict with most common knowledege.",
      examples: [
        "I'm sure I could install those solar panels myself, no problem!",
        "The moon landing was faked in a studio.",
        "I can cure most diseases with just this one secret herb.",
        "Scientists have proven that gravity is actually a hoax.",
      ],
    },
  },
};
