import {
  LanguageModel,
  type LanguageModelMessage,
  LanguageModelRole,
} from "@cutout/agent/processes";
import { QuickSearch } from "@cutout/agent/tools";
import { Spinner } from "@std/cli/spinner";

import { MODEL_CHAT, MODEL_SCORE } from "../constants.env.ts";
import { systemChecks } from "./checks.ts";

try {
  await systemChecks();
} catch (error) {
  console.error(`%c${String(error)}`, "color: red;");

  Deno.exit(1);
}

// Chat
const chatLog: LanguageModelMessage[] = [];
const chatProcess = LanguageModel.createProcess({
  model: MODEL_CHAT,
  tools: [QuickSearch], // TODO: "createTool" or something.
});

chatProcess.start();

// Score
const scoreProcess = LanguageModel.createProcess({
  model: MODEL_SCORE,
  logging: {
    file: "score.log",
  },
  generation: {
    temperature: 1,
  },
});

scoreProcess.start();

while (true) {
  const input = prompt("[input]>");

  if (input === null) break;

  // TODO: actual scoring system

  chatLog.push({ role: LanguageModelRole.USER, content: input.trim() });

  let toolCalls;
  do {
    const chatMessage = await callWithSpinner(
      "Thinking",
      () => chatProcess.fetch(chatLog),
    );

    if (chatMessage instanceof Error) {
      console.error(
        `%cAn Error occured while processing your request: ${chatMessage.message}`,
        "color: red;",
      );
      continue;
    }

    chatLog.push(chatMessage);
    if (chatMessage.content && chatMessage.content.length) {
      console.log("[output]> " + chatMessage.content);
    }

    ({ toolCalls } = chatMessage);

    if (!toolCalls) continue;

    for (const call of toolCalls) {
      const content = await callWithSpinner(call.name, call);

      if (content instanceof Error) {
        console.error(
          `%cAn Error occured while invoking the tool: ${content.message}`,
          "color: red;",
        );
        continue;
      }

      // TODO: "createTool" or something.
      chatLog.push({
        role: LanguageModelRole.TOOL,
        toolCallID: call.id,
        content,
      });
    }
  } while (toolCalls);
}

Deno.addSignalListener("SIGTERM", () => {
  chatProcess.stop();
  scoreProcess.stop();
});

// ---
const MS_IN_SECOND = 1000;
function callWithSpinner<T>(
  name: string,
  fn: () => T,
  color = "gray",
): T | Error {
  const spinner = new Spinner({ message: `${name}…`, color });

  let seconds = 1;
  const spinnerInterval = setInterval(() => {
    spinner.message = `${name}… (${seconds++}s)`;
  }, MS_IN_SECOND);

  spinner.start();
  try {
    return fn();
  } catch (error) {
    if (error instanceof Error) {
      return error;
    }

    return new Error(String(error));
  } finally {
    spinner.stop();
    clearInterval(spinnerInterval);
    console.log(
      `%${name} for ${seconds}s.`,
      `color: ${color};`,
    );
  }
}
