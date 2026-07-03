import type { QualifyingDevelopmentTask } from "./types.ts";

export const filterNames = (
  tasks: QualifyingDevelopmentTask[],
  scores: Record<string, number>,
): string[] => {
  return tasks.reduce((names, task) => {
    if (task.prompt(scores) === null) {
      return names;
    }

    return [...names, task.displayName];
  }, [] as string[]);
};
