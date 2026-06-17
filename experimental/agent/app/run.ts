import { Spinner } from "@std/cli/spinner";

import { LLM } from "../libraries/services/module.ts";
import { QuickSearch } from "../libraries/tools/module.ts";
import systemPrompt from "./SYSTEM.md" with { type: "text" };

const llmDependencies = await LLM.getRequiredDependencies();
if (llmDependencies) {
  console.error(
    `Agent requires the following dependencies: ${llmDependencies}. Aborting.`,
  );
  Deno.exit(1);
}

const llmService = LLM.createService();

llmService.start();

const chatLog = [{
  role: "system",
  content: systemPrompt,
  tool_call_id: undefined,
}];

while (true) {
  const input = prompt("[input]>");

  if (input === null) break;

  chatLog.push({ role: "user", content: input, tool_call_id: undefined });

  let hasToolCalls = false;

  do {
    const spinStart = performance.now();
    const spinner = new Spinner({ message: "Thinking…", color: "gray" });
    spinner.start();

    const response: Response = await fetch(
      llmService.apiRoot + "chat/completions",
      {
        method: "POST",
        body: JSON.stringify({
          model: llmService.model,
          messages: chatLog,
          tools: [
            QuickSearch.definition,
          ],
        }),
      },
    );

    const { choices: [{ message, finish_reason: finishReason }] } =
      await response.json();

    spinner.stop();
    console.log(
      `%cThought for ${Math.round(performance.now() - spinStart)}ms.`,
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
