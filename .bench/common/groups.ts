const SPA = "SPA";
const SSR = "SSR";
const wikipedia = "wikipedia.org home page";
const manyRows = "10K rows";

export enum BenchGroups {
  WIKIPEDIA_SSR = `[${SSR}] ${wikipedia}`,
  WIKIPEDIA_SPA = `[${SPA}] ${wikipedia}`,
  MANY_ROW_SSR = `[${SSR}] ${manyRows}`,
  MANY_ROW_SPA = `[${SPA}] ${manyRows}`,
}
