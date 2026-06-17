import * as LLM from "./llm.ts";
import systemPrompt from "./SYSTEM.md" with { type: "text" };

const service = LLM.createService();

service.start();

const chatLog = [{ role: "system", content: systemPrompt }];

// TODO: improved ux, time spent, timestamps, etc.
while (true) {
  const input = prompt(">>");

  if (input === null) {
    break;
  }

  chatLog.push({ role: "user", content: input });

  const response: Response = await fetch(
    service.apiRoot + "chat/completions",
    {
      method: "POST",
      body: JSON.stringify({ // TODO: Add tools here!
        model: service.model,
        messages: chatLog,
      }),
    },
  );

  const { choices: [{ message }] } = await response.json();

  console.log(message.content);
  chatLog.push(message);
}

service.stop();
