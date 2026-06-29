import { createToolCall, type Tool, type ToolCall } from "@cutout/agent/tools";
import { GENERATION_ENDPOINT, Role } from "./constants.ts";
import type { Message } from "./types.ts";

type Options = {
  systemPrompt?: string;
  apiRoot: string;
  model: string;
  tools: Tool[];
  temperature: number;
  probabilityCutoff: number;
  optionLimit: number;
  presencePenalty: number;
};

type MessageJSON = {
  role: Role;
  content?: string;
  tool_call_id?: number;
};

type ResponseJSON = {
  choices: {
    message: {
      role: Role;
      content?: string;
      tool_calls?: {
        id: number;
        function: {
          name: string;
          arguments: string; // Serialized JSON
        };
      }[];
    };
  }[];
};

export function fetchFactory(
  {
    systemPrompt,
    apiRoot,
    model,
    tools,
    temperature,
    probabilityCutoff,
    optionLimit,
    presencePenalty,
  }: Options,
) {
  return async (systemMessages: Message[]): Promise<Message> => {
    const jsonMessages: MessageJSON[] = systemPrompt
      ? [{ role: Role.SYSTEM, content: systemPrompt }]
      : [];

    for (const message of systemMessages) {
      jsonMessages.push({
        role: message.role,
        content: message.content,
        tool_call_id: message.toolCallID,
      });
    }

    const response = await fetch(
      apiRoot + GENERATION_ENDPOINT,
      {
        method: "POST",
        body: JSON.stringify({
          model,
          messages: jsonMessages,
          tools: tools.map((tool) => ({
            type: "function",
            function: {
              name: tool.name,
              description: tool.description,
              parameters: {
                type: "object",
                properties: tool.parameters.reduce((schema, parameter) => ({
                  ...schema,
                  [parameter.name]: {
                    type: parameter.type,
                    description: parameter.description,
                  },
                }), {}),
                required: tool.parameters.reduce((required, parameter) => {
                  if (!parameter.required) return required;

                  return [...required, parameter.name];
                }, [] as string[]),
              },
            },
          })),
          temperature,
          top_p: probabilityCutoff,
          top_k: optionLimit,
          presence_penalty: presencePenalty,
        }),
      },
    );

    const { choices: [{ message }] } = (await response.json()) as ResponseJSON;

    const toolCalls = message.tool_calls?.reduce((validCalls, callJSON) => {
      const foundTool = tools.find(({ name }) =>
        callJSON.function.name === name
      );

      if (!foundTool) return validCalls;

      const vaildParameters = JSON.parse(callJSON.function.arguments);

      return [
        ...validCalls,
        createToolCall(foundTool, vaildParameters, callJSON.id),
      ];
    }, [] as ToolCall[]);

    return {
      role: Role.MODEL,
      content: message.content?.trim(),
      toolCalls,
    };
  };
}
