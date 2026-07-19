import type { XOJSXToken } from "@cutout/jsx/tokens";

type NonEmptyArray<T> = [T, ...Array<T>];

export type Rubric = {
  name: string;
  description: string;
  scores: {
    1: {
      description: string;
      examples: NonEmptyArray<string>;
    };
    2?: {
      description: string;
      examples: NonEmptyArray<string>;
    };
    3?: {
      description: string;
      examples: NonEmptyArray<string>;
    };
    4?: {
      description: string;
      examples: NonEmptyArray<string>;
    };
    5: {
      description: string;
      examples: NonEmptyArray<string>;
    };
  };
};

export type QualifyingDevelopmentTask = {
  displayName: string;
  prompt: (scores: Record<string, number>) => XOJSXToken | null;
};
