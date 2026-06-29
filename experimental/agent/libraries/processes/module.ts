import { Role } from "./model/constants.ts";
import { create } from "./model/create.ts";
import { getMissingDependencies } from "./model/getMissingDependencies.ts";
export type { Message as LanguageModelMessage } from "./model/types.ts";

export const LanguageModel = {
  Role,
  create,
  getMissingDependencies,
};
