const DEFAULT_MODEL = "mlx-community/Qwen3.6-35B-A3B-mxfp8";

type LocalLLMService = {
  model: string;
  process?: Deno.ChildProcess;
  apiRoot: string;
  start: () => Deno.ChildProcess;
  stop: () => void;
};

// TODO: actually check the required dependencies
export const getRequiredDependencies = () => {
  // return "mlx_lm";
  return null;
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
        "color: blue;",
      );
      return this.process = command.spawn();
    },
    stop() {
      this.process?.kill();
      console.info(
        `%cStopped serving "modelID:${this.model}" at ${this.apiRoot}`,
        "color: blue;",
      );
    },
  };
};

// ---

function getFreePort() {
  const listener = Deno.listen({ port: 0 });
  const { port } = listener.addr;
  listener.close();
  return port;
}
