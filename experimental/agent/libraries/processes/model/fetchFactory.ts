import { createToolCall, type Tool, type ToolCall } from "@cutout/agent/tools";
import { GENERATION_ENDPOINT, Role } from "./constants.ts";
import type { GenerationOptions, Message } from "./types.ts";

type Options = {
  apiRoot: string;
  generation?: GenerationOptions;
  model: string;
  systemPrompt?: string;
  tools: Tool[];
};

type GenerationJSON = {
  frequency_context_size?: number;
  frequency_penalty?: number;
  max_tokens?: number;
  min_p?: number;
  presence_context_size?: number;
  presence_penalty?: number;
  repetition_context_size?: number;
  repetition_penalty?: number;
  temperature?: number;
  top_k?: number;
  top_p?: number;
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
    generation,
  }: Options,
) {
  return async (
    systemMessages: Message[],
    systemPromptOverride?: string,
  ): Promise<Message> => {
    const jsonMessages: MessageJSON[] = systemPromptOverride || systemPrompt
      ? [{ role: Role.SYSTEM, content: systemPromptOverride ?? systemPrompt }]
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
          ...generationOptionsToJSON(generation),
        }),
      },
    );

    const responseJSON = await response.json();

    if (responseJSON.error) {
      throw new Error(responseJSON.error);
    }

    const { choices: [{ message }] } = responseJSON as ResponseJSON;

    const toolCalls = message.tool_calls?.reduce((validCalls, callJSON) => {
      const foundTool = tools.find(({ name }) =>
        callJSON.function.name === name
      );

      if (!foundTool) return validCalls;

      const validParameters = JSON.parse(callJSON.function.arguments);

      return [
        ...validCalls,
        createToolCall(foundTool, validParameters, callJSON.id),
      ];
    }, [] as ToolCall[]);

    return {
      role: Role.MODEL,
      content: message.content?.trim(),
      toolCalls,
    };
  };
}

const generationOptionsToJSON = (
  generation?: GenerationOptions,
): GenerationJSON => {
  if (!generation) return {};

  const { limit, sampling, presence, repetition, frequency } = generation;

  let result: GenerationJSON = {};

  if (limit) {
    result.max_tokens = limit;
  }

  if (sampling) {
    const { temperature, probability, count } = sampling;

    result = {
      ...result,
      temperature,
      min_p: probability?.min,
      top_p: probability?.top,
      top_k: count?.top,
    };
  }

  if (presence) {
    result = {
      ...result,
      presence_penalty: presence?.penalty,
      presence_context_size: presence?.size,
    };
  }

  if (frequency) {
    result = {
      ...result,
      frequency_penalty: frequency?.penalty,
      frequency_context_size: frequency?.size,
    };
  }

  if (repetition) {
    result = {
      ...result,
      repetition_penalty: repetition?.penalty,
      repetition_context_size: repetition?.size,
    };
  }

  return result;
};
