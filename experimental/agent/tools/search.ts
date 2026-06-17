export const definition = {
  type: "function",
  function: {
    name: "webSearch",
    description: "TODO",
    parameters: [
      {
        name: "query",
        type: "string",
        description: "TODO",
        required: true
      }
    ]
  }
}

export default async ({ query }: { query: string; }) => {
  const results = await fetch(`https://api.duckduckgo.com/?q=${query}&format=json`);

  const resultJSON = await results.json();

  // TODO: format
  return ``;
};
