import { LanguageModel } from "@cutout/agent/processes";

import {
  MEMORY_LIMIT,
  MEMORY_TOLERANCE,
  MEMORY_WARNING,
} from "../constants.env.ts";
import { BYTES_TO_GB } from "./constants.ts";

export const systemChecks = async () => {
  if (Deno.build.target !== "aarch64-apple-darwin") {
    throw new Error(
      `\`@cutout/agent\` currently supports only Apple Silicon. Aborting.`,
    );
  }

  // TODO: set models based on available memory
  let { total: availableMemory } = Deno.systemMemoryInfo();

  availableMemory /= BYTES_TO_GB;
  availableMemory *= MEMORY_TOLERANCE;

  if (availableMemory < MEMORY_LIMIT) {
    throw new Error(
      `Your system RAM is too low to run the \`@cutout/agent\` - you must have at least ${MEMORY_LIMIT}GB available. Aborting.`,
    );
  }

  if (availableMemory < MEMORY_WARNING) {
    console.warn(
      `%cYour system RAM is under the recommended threshold of ${MEMORY_WARNING}GB. You may experience performance degredation.`,
      "color: yellow;",
    );
  }

  const modelDependencies = await LanguageModel.getMissingDependencies();
  if (modelDependencies) {
    throw new Error(
      `Agent requires the following dependencies: "${modelDependencies}". Aborting.`,
    );
  }
};
