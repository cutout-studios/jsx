import type { Tool } from "@cutout/agent/tools";
import { mergeReadableStreams } from "@std/streams";

import { LOG_LEVEL } from "../../constants.env.ts";

import {
  LOG_ROOT,
  MODEL_GENERATION_DEFAULT_OPTION_LIMIT,
  MODEL_GENERATION_DEFAULT_PRESENCE_PENALTY,
  MODEL_GENERATION_DEFAULT_PROBABILITY_CUTOFF,
  MODEL_GENERATION_DEFAULT_RESPONSE_LENGTH_LIMIT,
  MODEL_GENERATION_DEFAULT_TEMPERATURE,
  MODEL_GENERATION_ENDPOINT,
  MODEL_PROCESS_COMMAND,
  ModelRole,
  REQUIRED_COMMANDS,
} from "./constants.ts";
import type { Message, ToolCall } from "./types.ts";

type LocalModelProcessOptions = {
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
  tools?: Tool<unknown, unknown>[];
};

type LocalModelProcess = {
  process?: Deno.ChildProcess;
  start: () => void;
  fetch: (messages: Message[]) => Promise<Message>;
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

export const createProcess = (
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
        MODEL_GENERATION_DEFAULT_RESPONSE_LENGTH_LIMIT,
      temperature = MODEL_GENERATION_DEFAULT_TEMPERATURE,
      presencePenalty = MODEL_GENERATION_DEFAULT_PRESENCE_PENALTY,
      choiceConstraints: {
        probabilityCutoff = MODEL_GENERATION_DEFAULT_PROBABILITY_CUTOFF,
        optionLimit = MODEL_GENERATION_DEFAULT_OPTION_LIMIT,
      } = {},
    } = {},
    logging: {
      level = LOG_LEVEL,
      file = "model.process.log",
    } = {},
  }: LocalModelProcessOptions,
): LocalModelProcess => {
  const command = new Deno.Command(MODEL_PROCESS_COMMAND, {
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
    env: {
      PYTHONUNBUFFERED: "1",
      PYTHONWARNINGS: "ignore",
      HF_HUB_DISABLE_PROGRESS_BARS: "1",
    },
    stdout: "piped",
    stderr: "piped",
  });

  const apiRoot = `http://${host}:${port}/v1/`;

  return {
    start() { // TODO: inform user that the model is downloading (NTH)
      console.info(
        `%cServing "modelID:${model}" @ ${apiRoot}`,
        "color: gray;",
      );

      this.process = command.spawn();

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
    async fetch(messages: Message[]): Promise<Message> {
      const response = await fetch(
        apiRoot + MODEL_GENERATION_ENDPOINT,
        { // TODO: make sure this can be serialized
          method: "POST",
          body: JSON.stringify({
            model,
            messages: systemPrompt
              ? [
                [{ role: ModelRole.SYSTEM, content: systemPrompt }],
                ...messages,
              ]
              : messages,
            tools, // TODO: needs to be transformed into JSON Schema
            temperature,
            top_p: probabilityCutoff,
            top_k: optionLimit,
            presence_penalty: presencePenalty,
          }),
        },
      );

      // TODO: type the json returning from the api
      const { choices: [{ message }] } = await response.json();

      const toolCalls = message.tool_calls.reduce((validCalls, callJSON) => {
        const foundTool = tools.find(({ name }) => callJSON.name === name);

        if (!foundTool) return validCalls;

        const vaildParameters = JSON.parse(callJSON.function.arguments);

        return [
          ...validCalls,
          Object.assign(() => foundTool(vaildParameters), {
            id: callJSON.id,
            name: callJSON.function.name,
          }),
        ];
      }, [] as ToolCall[]);

      return {
        role: ModelRole.MODEL,
        content: message.content.trim(),
        toolCalls,
      };
    },
    stop() {
      this.process?.kill();
      console.info(
        `%cStopped serving "modelID:${model}" at ${apiRoot}`,
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
