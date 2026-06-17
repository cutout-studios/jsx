import * as LLM from "./llm.ts";
import systemPrompt from "./SYSTEM.md" with { type: "text" };
import search, { definition as searchToolDefinition } from "./tools/search.ts";

const service = LLM.createService();

service.start();

const chatLog = [{ role: "system", content: systemPrompt }];

while (true) {
  const input = prompt(">>");

  if (input === null) {
    break;
  }

  chatLog.push({ role: "user", content: input });

  let hasToolCalls = false;

  do {
    const response: Response = await fetch(
      service.apiRoot + "chat/completions",
      {
        method: "POST",
        body: JSON.stringify({
          model: service.model,
          messages: chatLog,
          tools: [
            searchToolDefinition,
          ],
        }),
      },
    );

    const { choices: [{ message, finish_reason: finishReason }] } =
      await response.json();

    console.log(message.content.trim());
    chatLog.push(message);

    hasToolCalls = finishReason === "tool_calls";
    for (
      const { function: { name, arguments: _arguments } }
        of message.tool_calls ?? []
    ) {
      let content;
      switch (name) {
        case searchToolDefinition.function.name:
          console.log(`%csearch(${_arguments});`, "color: blue;");
          content = await search(JSON.parse(_arguments));
          break;
        default:
          continue;
      }

      chatLog.push({ role: "tool", content });
    }
  } while (hasToolCalls);
}

service.stop();
