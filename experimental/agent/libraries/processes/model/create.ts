import type { Tool } from "@cutout/agent/tools";
import { mergeReadableStreams } from "@std/streams";

import { LOG_LEVEL } from "../../../constants.env.ts";
import { LOG_ROOT } from "../constants.ts";
import {
  GENERATION_DEFAULT_OPTION_LIMIT,
  GENERATION_DEFAULT_PRESENCE_PENALTY,
  GENERATION_DEFAULT_PROBABILITY_CUTOFF,
  GENERATION_DEFAULT_RESPONSE_LENGTH_LIMIT,
  GENERATION_DEFAULT_TEMPERATURE,
  PROCESS_COMMAND,
  REGISTRY_COMMAND,
} from "./constants.ts";
import { fetchFactory } from "./fetchFactory.ts";
import { getFreePort } from "./getFreePort.ts";
import type { Message } from "./types.ts";

type Options = {
  model: string;
  networking?: {
    host?: string;
    port?: number;
  };
  generation?: {
    systemPrompt?: string;
    responseLimit?: number;
    temperature?: number;
    presencePenalty?: number;
    choiceConstraints?: {
      probabilityCutoff?: number;
      optionLimit?: number;
    };
  };
  logging?: {
    level?: string;
    file?: string;
  };
  tools?: Tool[];
};

type Process = {
  process?: Deno.ChildProcess;
  start: () => void;
  fetch: (messages: Message[], systemPrompt?: string) => Promise<Message>;
  stop: () => void;
};

export const create = (
  {
    model,
    networking: {
      host = "localhost",
      port = getFreePort(),
    } = {},
    tools = [],
    generation: {
      systemPrompt,
      responseLimit: maxResponseLength =
        GENERATION_DEFAULT_RESPONSE_LENGTH_LIMIT,
      temperature = GENERATION_DEFAULT_TEMPERATURE,
      presencePenalty = GENERATION_DEFAULT_PRESENCE_PENALTY,
      choiceConstraints: {
        probabilityCutoff = GENERATION_DEFAULT_PROBABILITY_CUTOFF,
        optionLimit = GENERATION_DEFAULT_OPTION_LIMIT,
      } = {},
    } = {},
    logging: {
      level = LOG_LEVEL,
      file = "model.process.log",
    } = {},
  }: Options,
): Process => {
  const apiRoot = `http://${host}:${port}/v1/`;

  const env = {
    PYTHONUNBUFFERED: "1",
    PYTHONWARNINGS: "ignore",
    HF_HUB_DISABLE_PROGRESS_BARS: "1",
  };

  const modelDownload = new Deno.Command(REGISTRY_COMMAND, {
    args: ["download", model],
    env,
  });

  const modelServer = new Deno.Command(PROCESS_COMMAND, {
    args: [
      "--host",
      host,
      "--port",
      String(port),
      "--max-tokens",
      String(maxResponseLength),
      "--model",
      model,
      "--log-level",
      level,
    ],
    env,
    stdout: "piped",
    stderr: "piped",
  });

  return {
    async start() {
      console.info(
        `%cEnsuring "modelID:${model}" is on your system…`,
        "color: gray;",
      );

      const modelDownloadProcess = modelDownload.spawn();

      await modelDownloadProcess.status;

      console.info(
        `%cServing "modelID:${model}" @ ${apiRoot}`,
        "color: gray;",
      );

      this.process = modelServer.spawn();

      Deno.mkdirSync(LOG_ROOT, { recursive: true });

      const logFile = Deno.openSync(LOG_ROOT + file, {
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
      );
    },
    fetch: fetchFactory({
      model,
      apiRoot,
      tools,
      systemPrompt,
      temperature,
      presencePenalty,
      probabilityCutoff,
      optionLimit,
    }),
    stop() {
      this.process?.kill();
      console.info(
        `%cStopped serving "modelID:${model}" at ${apiRoot}`,
        "color: gray;",
      );
    },
  };
};
