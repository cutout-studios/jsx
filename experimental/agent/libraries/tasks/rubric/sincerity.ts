import type { Rubric } from "../types.ts";

export const sincerity: Rubric = {
  description:
    "How sincere or genuine the message is. A low score suggests a sarcastic, ironic, or joking tone, while a high score indicates a sincere or heartfelt tone.",
  examples: {
    1: [
      "That's a real masterpiece",
      "Yes, because I believe murder is okay 🙄",
      "LMAO",
      "Oh, I'm *so* sorry for your loss... of the game.",
    ],
    3: [
      "Wow, you finally showed up! We missed you.",
    ],
    5: [
      "Thank you so much for your help, I really appreciate it.",
      "I am really sorry about that.",
    ],
  },
};
