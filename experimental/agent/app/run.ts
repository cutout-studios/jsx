import {
  LanguageModel,
  type LanguageModelMessage,
} from "@cutout/agent/processes";
import {
  filterTasks,
  messageRubric,
  renderRubricPrompt,
  renderTaskPrompt,
} from "@cutout/agent/tasks";
import { QuickSearch } from "@cutout/agent/tools";

import { callWithSpinner } from "./callWithSpinner.ts";
import { evaluateSystem } from "./evaluateSystem.ts";

// Evaluate System
let agentModel, judgeModel;
try {
  ({ agentModel, judgeModel } = await evaluateSystem());
} catch (error) {
  console.error(`%c${String(error)}`, "color: red;");
  Deno.exit(1);
}

// Initialize Model Runners
const chatLog: LanguageModelMessage[] = [];
const agent = LanguageModel.create({
  model: agentModel,
  logging: {
    file: "agent.log",
  },
  tools: [QuickSearch],
});

await agent.start();

const judge = LanguageModel.create({
  model: judgeModel,
  logging: {
    file: "judge.log",
  },
  generation: {
    temperature: 1,
  },
});

await judge.start();

// Chat Loop
while (true) {
  const input = prompt("[input]>");

  if (input === null) break;

  chatLog.push({ role: LanguageModel.Role.USER, content: input.trim() });

  const rubricEntriesOrError = await callWithSpinner(
    "Evaluating",
    () => {
      const judgeCalls: Promise<[string, number]>[] = [];
      for (const [name, definition] of Object.entries(messageRubric)) {
        const promise = new Promise<[string, number]>((resolve) => {
          judge.fetch([], renderRubricPrompt(name, definition)).then((result) =>
            resolve([name, Number(result.content?.split("[RESULT]")[1])])
          );
        });

        judgeCalls.push(promise);
      }

      return Promise.all(judgeCalls);
    },
  );

  if (rubricEntriesOrError instanceof Error) {
    console.error("");
    continue;
  }

  const rubric = Object.fromEntries(rubricEntriesOrError);

  let toolCalls;
  do {
    const chatMessage = await callWithSpinner(
      "Thinking",
      () => agent.fetch(chatLog, renderTaskPrompt(rubric)),
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
      console.log(
        "[output]> " + `(${filterTasks(rubric).join(", ")})` +
          chatMessage.content,
      );
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

      chatLog.push({
        role: LanguageModel.Role.TOOL,
        toolCallID: call.id,
        content: String(content),
      });
    }
  } while (toolCalls);
}

// Graceful Shutdown
Deno.addSignalListener("SIGTERM", () => {
  agent.stop();
  judge.stop();
});
