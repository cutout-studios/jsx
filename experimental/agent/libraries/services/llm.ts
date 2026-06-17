const REQUIRED_COMMANDS = ["mlx_lm.server"];
const DEFAULT_MODEL = "mlx-community/Qwen3.6-35B-A3B-mxfp8";

type LocalLLMService = {
  model: string;
  process?: Deno.ChildProcess;
  apiRoot: string;
  start: () => Deno.ChildProcess;
  stop: () => void;
};

export const getRequiredDependencies = async (): Promise<string | null> => {
  const checks = await Promise.all(
    REQUIRED_COMMANDS.map(async (cmd) =>
      [cmd, await commandExists(cmd)] as const
    ),
  );
  const missing = checks.filter(([, ok]) => !ok).map(([cmd]) => cmd);

  return missing.length ? missing.join(", ") : null;
};

// TODO(#): use @cutout/web
export const createService = (
  {
    host = "localhost",
    port = getFreePort(),
    maxTokens = 65536,
    model = DEFAULT_MODEL,
  } = {},
): LocalLLMService => {
  const command = new Deno.Command("mlx_lm.server", {
    args: [
      "--host",
      host,
      "--port",
      String(port),
      "--max-tokens",
      String(maxTokens),
      "--model",
      model,
      "--log-level",
      "WARNING",
    ],
    env: {
      PYTHONWARNINGS: "ignore",
      HF_HUB_DISABLE_PROGRESS_BARS: "1",
    },
    // TODO(#): send to a log file
    stdout: "piped",
    stderr: "piped",
  });

  return {
    model,
    apiRoot: `http://${host}:${port}/v1/`,
    start() {
      console.info(
        `%cServing "modelID:${this.model}" @ ${this.apiRoot}`,
        "color: gray;",
      );
      return this.process = command.spawn();
    },
    stop() {
      this.process?.kill();
      console.info(
        `%cStopped serving "modelID:${this.model}" at ${this.apiRoot}`,
        "color: gray;",
      );
    },
  };
};

// ---

async function commandExists(cmd: string): Promise<boolean> {
  try {
    await new Deno.Command(cmd, {
      args: ["--help"],
      stdout: "null",
      stderr: "null",
    }).output();

    return true;
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) return false;

    throw error;
  }
}

function getFreePort() {
  const listener = Deno.listen({ port: 0 });
  const { port } = listener.addr;
  listener.close();
  return port;
}
