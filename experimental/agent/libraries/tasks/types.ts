import type { CutoutGeneratorToken } from "@cutout/jsx/tokens";

type NonEmptyArray<T> = [T, ...Array<T>];

export type Rubric = {
  description: string;
  examples: {
    1: NonEmptyArray<string>;
    2?: NonEmptyArray<string>;
    3?: NonEmptyArray<string>;
    4?: NonEmptyArray<string>;
    5: NonEmptyArray<string>;
  };
};

export type QualifyingDevelopmentTask = {
  displayName: string;
  prompt: (scores: Record<string, number>) => CutoutGeneratorToken | null;
};
