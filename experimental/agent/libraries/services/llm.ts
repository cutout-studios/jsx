import { mergeReadableStreams } from "@std/streams";

const REQUIRED_COMMANDS = ["mlx_lm.server"];
const DEFAULT_MODEL = "mlx-community/Qwen3.6-35B-A3B-mxfp8";
const DEFAULT_MODEL_MAX_TOKENS = 262_144;
const DEFAULT_MODEL_KB_PER_TOKEN = 96;

type LocalLLMService = {
  model: string;
  process?: Deno.ChildProcess;
  apiRoot: string;
  contextLength: number;
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

export const createService = (
  {
    host = "localhost",
    port = getFreePort(),
    maxTokens = chooseMaxContext(
      DEFAULT_MODEL_MAX_TOKENS,
      DEFAULT_MODEL_KB_PER_TOKEN,
    ),
    model = DEFAULT_MODEL,
    logFileName = "mlx_lm.server.log",
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
      "DEBUG"
    ],
    env: {
      PYTHONWARNINGS: "ignore",
      HF_HUB_DISABLE_PROGRESS_BARS: "1",
      PYTHONUNBUFFERED: "1",
    },
    stdout: "piped",
    stderr: "piped",
  });

  return {
    model,
    contextLength: maxTokens,
    apiRoot: `http://${host}:${port}/v1/`,
    start() {
      console.info(
        `%cServing "modelID:${this.model}" @ ${this.apiRoot}`,
        "color: gray;",
      );
      console.info(
        `%c  -> Context Length: ${maxTokens} tokens.`,
        `color: gray;`,
      );

      this.process = command.spawn();

      Deno.mkdirSync("./.output/agent/", { recursive: true });

      const logFile = Deno.openSync("./.output/agent/" + logFileName, {
        create: true,
        append: true,
        write: true,
      });

      mergeReadableStreams(
        this.process.stdout,
        this.process.stderr,
      ).pipeTo(
        new WritableStream<Uint8Array>({
          write: (chunk) => {
            logFile.writeSync(chunk);
          },
          close: () => logFile.close(),
          abort: () => logFile.close(),
        }),
      ).catch(() => {});

      return this.process;
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

function chooseMaxContext(
  supportedTokenCount: number,
  estimatedTokenSizeKB: number,
  memoryOverhead: number = 0.5,
): number {
  const totalSpaceKB = Deno.systemMemoryInfo().total;
  const availableSpace = totalSpaceKB * memoryOverhead;
  const availableTokens = Math.floor(availableSpace / estimatedTokenSizeKB);

  return Math.min(availableTokens, supportedTokenCount);
}

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
