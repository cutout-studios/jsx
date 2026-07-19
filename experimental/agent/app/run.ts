import {
  LanguageModel,
  type LanguageModelMessage,
} from "@cutout/agent/processes";
import { messageRubric, renderRubricPrompt } from "@cutout/agent/tasks";
import { QuickSearch } from "@cutout/agent/tools";
import { rawText } from "@cutout/jsx/projections";
import type { CutoutJSXToken } from "@cutout/jsx/tokens";
import { load } from "@std/dotenv";

import { LOG_LEVEL } from "../constants.env.ts";
import { callWithSpinner } from "./callWithSpinner.ts";
import { JUDGE_RESULT_TAG, SUPPORTED_TASKS } from "./constants.ts";
import { evaluateSystem } from "./evaluateSystem.ts";
import { renderAgentSystemPrompt } from "./renderAgentSystemPrompt.tsx";

await load({ export: true });

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
  generation: {
    limit: 16384,
    sampling: {
      temperature: 0.3,
      probability: {
        top: 0.95,
      },
      count: {
        top: 20,
      },
    },
    presence: {
      penalty: 1.5,
    },
    repetition: {
      penalty: 1.3,
    },
  },
});

await agent.start();

const judge = LanguageModel.create({
  model: judgeModel,
  logging: {
    file: "judge.log",
  },
  generation: {
    repetition: {
      penalty: 1.5,
    },
  },
});

await judge.start();

const gracefulShutdown = () => {
  agent.stop();
  judge.stop();
  Deno.exit();
};

Deno.addSignalListener("SIGINT", gracefulShutdown);
Deno.addSignalListener("SIGTERM", gracefulShutdown);

// Chat Loop
while (true) {
  const input = prompt("[input]>");

  if (input === null) {
    gracefulShutdown();
    break;
  }

  const rubricEntriesOrError = await callWithSpinner(
    async () => {
      const judgeCalls = [];
      for (const [name, definition] of Object.entries(messageRubric)) {
        const { content } = await judge.fetch(
          [],
          rawText(renderRubricPrompt(definition, input)),
        );
        const [evaluation, score] = content?.split(JUDGE_RESULT_TAG) ?? [];

        if (isNaN(Number(score))) {
          judgeCalls.push([name, 0, evaluation]);
        } else {
          judgeCalls.push([name, Number(score), evaluation]);
        }
      }

      return judgeCalls;
    },
    { runningLabel: "Evaluating", completionLabel: "Evaluated" },
  );

  if (rubricEntriesOrError instanceof Error) {
    console.error(rubricEntriesOrError);
    continue;
  }

  if (LOG_LEVEL === "DEBUG") {
    console.debug(rubricEntriesOrError);
  }

  const rubric = Object.fromEntries(rubricEntriesOrError);

  const taskPrompts: CutoutJSXToken[] = [];
  const taskNames = [];
  for (const potentialTask of SUPPORTED_TASKS) {
    const renderedPrompt = potentialTask.prompt(rubric);
    if (renderedPrompt) {
      taskPrompts.push(renderedPrompt);
      taskNames.push(potentialTask.displayName);
    }
  }

  if (!taskNames.length) {
    console.log(
      "%cYour request was not deemed a valid QDT. Please try again.",
      "color: red;",
    );
    continue;
  }

  console.log(`%cSelected QDT(s): ${taskNames.join(", ")}.`, "color: gray;");

  chatLog.push({ role: LanguageModel.Role.USER, content: input.trim() });

  let toolCalls;
  do {
    const chatMessage = await callWithSpinner(
      () => agent.fetch(chatLog, rawText(renderAgentSystemPrompt(taskPrompts))),
      { runningLabel: "Thinking", completionLabel: "Thought" },
    );

    if (chatMessage instanceof Error) {
      console.error(
        `%cAn error occured while processing your request: ${chatMessage.message}`,
        "color: red;",
      );
      break;
    }

    chatLog.push(chatMessage);
    if (chatMessage.content && chatMessage.content.length) {
      console.log(
        "[output]> " + chatMessage.content,
      );
    }

    ({ toolCalls } = chatMessage);

    if (!toolCalls) continue;

    for (const call of toolCalls) {
      const content = await callWithSpinner(call, { runningLabel: call.name });

      if (content instanceof Error) {
        console.error(
          `%cAn error occured while invoking the tool: ${content.message}`,
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
