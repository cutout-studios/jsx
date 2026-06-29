import { REQUIRED_COMMANDS } from "./constants.ts";
import { hasCommand } from "./hasCommand.ts";

export const getMissingDependencies = async (): Promise<string | null> => {
  const checks = await Promise.all(
    REQUIRED_COMMANDS.map(async (cmd) => [cmd, await hasCommand(cmd)] as const),
  );
  const missing = checks.filter(([, ok]) => !ok).map(([cmd]) => cmd);

  return missing.length ? missing.join(", ") : null;
};
