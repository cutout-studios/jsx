import {
  LanguageModel,
  type LanguageModelMessage,
} from "@cutout/agent/processes";
import {
  filterTaskNames,
  messageRubric,
  renderRubricPrompt,
  renderTaskPrompt,
} from "@cutout/agent/tasks";
import { QuickSearch } from "@cutout/agent/tools";
import { rawText } from "@cutout/jsx/projections";

import { callWithSpinner } from "./callWithSpinner.ts";
import { SUPPORTED_TASKS } from "./constants.ts";
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
  generation: {
    limit: 16384,
    sampling: {
      temperature: 0.7,
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
    sampling: {
      temperature: 1,
    },
  },
});

await judge.start();

// Graceful Shutdown
const cleanup = () => {
  agent.stop();
  judge.stop();
};

Deno.addSignalListener("SIGINT", cleanup);
Deno.addSignalListener("SIGTERM", cleanup);

// Chat Loop
while (true) {
  const input = prompt("[input]>");

  if (input === null) {
    cleanup();
    Deno.exit();
  }

  chatLog.push({ role: LanguageModel.Role.USER, content: input.trim() });

  const rubricEntriesOrError = await callWithSpinner(
    "Evaluating",
    () => {
      const judgeCalls: Promise<[string, number]>[] = [];
      for (const [name, definition] of Object.entries(messageRubric)) {
        const promise = new Promise<[string, number]>((resolve) => {
          judge.fetch([], rawText(renderRubricPrompt(definition, input))).then((
            { content },
          ) => {
            const [reasoning, score] = content?.split("[RESULT]") ?? [];

            console.debug("\n", { name, score: Number(score), reasoning });

            resolve([name, Number(score)]);
          });
        });

        judgeCalls.push(promise);
      }

      return Promise.all(judgeCalls);
    },
    { pastTenseLabel: "Evaluated" },
  );

  if (rubricEntriesOrError instanceof Error) {
    console.error(rubricEntriesOrError);
    continue;
  }

  const rubric = Object.fromEntries(rubricEntriesOrError);

  let toolCalls;
  do {
    const chatMessage = await callWithSpinner(
      "Thinking",
      () =>
        agent.fetch(
          chatLog,
          rawText(renderTaskPrompt(SUPPORTED_TASKS, rubric)),
        ),
      { pastTenseLabel: "Thought" },
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
        "[output]> " +
          `(${filterTaskNames(SUPPORTED_TASKS, rubric).join(", ")}) ` +
          chatMessage.content,
      );
    }

    ({ toolCalls } = chatMessage);

    if (!toolCalls) continue;

    for (const call of toolCalls) {
      const content = await callWithSpinner(call.name, call);

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
