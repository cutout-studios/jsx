import { dubiousness } from "./rubric/dubiousness.ts";
import { sincerity } from "./rubric/sincerity.ts";
import { specificity } from "./rubric/specificity.ts";
export { render as renderRubricPrompt } from "./rubric/render.tsx";

export { gatherInformation } from "./gatherInformation.tsx";

export * from "./types.ts";

export const messageRubric = {
  dubiousness,
  sincerity,
  specificity,
};
