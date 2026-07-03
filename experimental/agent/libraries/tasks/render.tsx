/** @jsxImportSource @cutout/jsx */

import type { QualifyingDevelopmentTask } from "./types.ts";

export const render = (
  tasks: QualifyingDevelopmentTask[],
  scores: Record<string, number>,
) => {
  return (
    <main>
      {tasks.map((task) => task.prompt(scores))}
    </main>
  );
};
