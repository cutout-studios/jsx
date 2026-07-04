/** @jsxImportSource @cutout/jsx */

import type { CutoutGeneratorToken } from "@cutout/jsx/tokens";
import type { QualifyingDevelopmentTask } from "./types.ts";

export const render = (
  tasks: QualifyingDevelopmentTask[],
  scores: Record<string, number>,
): CutoutGeneratorToken => {
  return (
    <main>
      {tasks.map((task) => task.prompt(scores))}
    </main>
  );
};
