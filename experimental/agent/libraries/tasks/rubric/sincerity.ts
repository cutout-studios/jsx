import type { Rubric } from "../types.ts";

export const sincerity: Rubric = {
  name: "Sincerity",
  description: "How sincere, genuine, or at-face-value the statement is.",
  scores: {
    1: {
      description:
        "The statement is aggressively sarcastic, ironic, or joking.",
      examples: [
        "That's a real masterpiece you got there",
        "Yes, because I believe murder is okay 🙄",
        "LMAO",
        "Oh, I'm *so* sorry for your loss... of the game.",
      ],
    },
    3: {
      description:
        "The statement is either plain or ambiguous in its potential for sardonics",
      examples: [
        "Good timing.",
        "That's interesting.",
        "Wow, you finally showed up! We missed you.",
      ],
    },
    5: {
      description: "The statement is deeply sincere, even heartfelt.",
      examples: [
        "Thank you so much for your help, I really appreciate it.",
        "I am really sorry about that.",
      ],
    },
  },
};
