import { LanguageModel } from "@cutout/agent/processes";
import {
  MEMORY_BREAKPOINTS,
  MODEL_AGENT,
  MODEL_JUDGE,
} from "../constants.env.ts";
import { BYTES_TO_GB } from "./constants.ts";

export const evaluateSystem = async (): Promise<
  { agentModel: string; judgeModel: string }
> => {
  if (Deno.build.target !== "aarch64-apple-darwin") {
    throw new Error(
      `\`@cutout/agent\` currently supports only Apple Silicon. Aborting.`,
    );
  }

  const missingDependencies = await LanguageModel.getMissingDependencies();
  if (missingDependencies) {
    throw new Error(
      `Agent requires the following dependencies: "${missingDependencies}". Aborting.`,
    );
  }

  const totalMemory = Deno.systemMemoryInfo().total / BYTES_TO_GB;

  let machineTier = 0;
  for (const breakpoint of MEMORY_BREAKPOINTS) {
    if (totalMemory < breakpoint) {
      machineTier++;
    } else {
      break;
    }
  }

  if (machineTier === MEMORY_BREAKPOINTS.length) {
    throw new Error(
      `Your system RAM is too low to run the \`@cutout/agent\` - you must have a minimum of ${
        MEMORY_BREAKPOINTS.at(-1)
      }GB installed. Aborting.`,
    );
  }

  return {
    agentModel: MODEL_AGENT[machineTier],
    judgeModel: MODEL_JUDGE[machineTier],
  };
};
