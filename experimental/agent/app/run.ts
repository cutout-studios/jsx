import { Spinner } from "@std/cli/spinner";

import { LLM } from "../libraries/services/module.ts";
import { Calculate, QuickSearch } from "../libraries/tools/module.ts";
import systemPrompt from "./SYSTEM.md" with { type: "text" };

type ChatLog = {
  role: string;
  content: string;
  tool_call_id?: number;
}[];

const llmDependencies = await LLM.getRequiredDependencies();
if (llmDependencies) {
  console.error(
    `Agent requires the following dependencies: "${llmDependencies}". Aborting.`,
  );
  Deno.exit(1);
}

const llmService = LLM.createService();

llmService.start();

const chatLog: ChatLog = [{
  role: "system",
  content: systemPrompt,
}];

while (true) {
  const input = prompt("[input]>");

  if (input === null) break;

  chatLog.push({ role: "user", content: input });

  let hasToolCalls = false;

  do {
    const spinner = new Spinner({ message: "Thinking…", color: "gray" });
    spinner.start();

    let seconds = 1;
    const thinkingInterval = setInterval(() => {
      spinner.message = `Thinking… (${seconds++}s)`;
    }, 1000);

    const response: Response = await fetch(
      llmService.apiRoot + "chat/completions",
      {
        method: "POST",
        body: JSON.stringify({
          model: llmService.model,
          messages: chatLog,
          tools: [
            Calculate.definition,
            QuickSearch.definition,
          ],

          // TODO: per-model/QDT setting
          temperature: 0.7,
          top_p: 0.95, // note to self: don't consider the options making up <5%
          top_k: 20, // note to self: keep the top 20 options
          min_p: 0.0,
          presence_penalty: 1.5,
        }),
      },
    );

    const { choices: [{ message, finish_reason: finishReason }] } =
      await response.json();

    spinner.stop();
    clearInterval(thinkingInterval);
    console.log(
      `%cThought for ${seconds}s.`,
      "color: gray;",
    );

    chatLog.push(message);
    if (message.content && message.content.trim().length) {
      console.log("[output]> " + message.content.trim());
    }

    hasToolCalls = finishReason === "tool_calls";
    for (
      const { id, function: { name, arguments: _arguments } }
        of message.tool_calls ?? []
    ) {
      let content, toolSpinner, toolStart;
      try {
        switch (name) {
          case QuickSearch.definition.function.name: {
            toolStart = performance.now();
            toolSpinner = new Spinner({
              message: `Calling: quickSearch(${_arguments})…`,
              color: "gray",
            });

            toolSpinner.start();
            content = await QuickSearch.call(JSON.parse(_arguments));

            toolSpinner.stop();
            console.log(
              `%cCalled quickSearch(${_arguments}) for ${
                Math.floor(performance.now() - toolStart)
              }ms.`,
              "color: gray;",
            );
            break;
          }
          case Calculate.definition.function.name:
            content = String(await Calculate.call(JSON.parse(_arguments)));
            console.log(
              `%cCalled calculate(${_arguments})`,
              "color: gray;",
            );

            break;
          default:
            content = `Unknown Tool: ${name}`;
        }
      } catch (error) {
        content = `Error: ${(error as Error).message}`;
      } finally {
        toolSpinner?.stop();
      }
      chatLog.push({ role: "tool", tool_call_id: id, content });
    }
  } while (hasToolCalls);
}

llmService.stop();
