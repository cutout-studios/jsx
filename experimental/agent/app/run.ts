import {
  LanguageModel,
  type LanguageModelMessage,
  LanguageModelRole,
} from "@cutout/agent/processes";
import { QuickSearch } from "@cutout/agent/tools";
import { Spinner } from "@std/cli/spinner";

import { CHAT_MODEL, SCORE_MODEL } from "../constants.env.ts";

// TODO: detect system requirements (ram, apple silicon)

const modelDependencies = await LanguageModel.getRequiredDependencies();
if (modelDependencies) {
  console.error(
    `Agent requires the following dependencies: "${modelDependencies}". Aborting.`,
  );
  Deno.exit(1);
}

// Chat
const chatLog: LanguageModelMessage[] = [];
const chatProcess = LanguageModel.createProcess({
  model: CHAT_MODEL,
  tools: [QuickSearch], // TODO: fix. "createTool" or something.
});

chatProcess.start();

// Score
const scoreProcess = LanguageModel.createProcess({
  model: SCORE_MODEL,
  monitoring: {
    logFileName: "score.log",
  },
  generation: {
    temperature: 1
  }
});

scoreProcess.start();

while (true) {
  const input = prompt("[input]>");

  if (input === null) break;

  // TODO: get scores, determine valid tasks

  chatLog.push({ role: LanguageModelRole.USER, content: input.trim() });

  let toolCalls;
  do { // TODO: handle error
    const chatMessage = await callWithSpinner(
      "Thinking",
      () => chatProcess.fetch(chatLog),
    );

    chatLog.push(chatMessage);
    if (chatMessage.content && chatMessage.content.length) {
      console.log("[output]> " + chatMessage.content);
    }

    ({ toolCalls } = chatMessage);

    if (!toolCalls) continue;

    for (const call of toolCalls) {
      chatLog.push({
        role: LanguageModelRole.TOOL,
        toolCallID: call.id,
        content: await callWithSpinner(call.name, call),
      });
    }
  } while (toolCalls);
}

chatProcess.stop();
scoreProcess.stop();

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
