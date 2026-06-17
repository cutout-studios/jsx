/** @jsxImportSource @cutout/jsx */
/** @jsxImportSourceTypes @cutout/web/projections/html */

import { html } from "@cutout/web/projections";

import description from "./description.md" with { type: "text" };

export const definition = {
  type: "function",
  function: {
    name: "quickSearch",
    description,
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "The query to search for, e.g. 'alphabet soup'.",
        },
      },
      required: ["query"],
    },
  },
};

export default async ({ query }: { query: string }): Promise<string> => {
  const cleanQuery = query.trim().replaceAll(/\s+/g, "+");

  const results = await fetch(
    `https://api.duckduckgo.com/?q=${cleanQuery}&format=json`,
  );

  const { Heading, AbstractText, Infobox, RelatedTopics, Results } =
    await results.json();

  const renderInfobox = () => {
    if (!Infobox || !Infobox.content?.length) return;

    return (
      <aside>
        <h2>Quick Search Infobox</h2>
        <dl>
          {Infobox.content.map((
            { label, value }: { label: string; value: unknown },
          ) => (
            <>
              <dt>{label}</dt>
              <dd>{JSON.stringify(value)}</dd>
            </>
          ))}
        </dl>
      </aside>
    );
  };

  const renderRankedSection = (
    title: string,
    list: { Text: string; FirstURL: string }[],
  ) => {
    if (!list?.length) return;

    return (
      <section>
        <h2>{title}</h2>
        <ol>
          {list.map(({ Text, FirstURL }) => {
            if (!Text || !FirstURL) return;

            if (Text.endsWith("...")) {
              Text += "[TRUNCATED]";
            }

            return (
              <li>
                <a href={FirstURL}>{Text}</a>
              </li>
            );
          })}
        </ol>
      </section>
    );
  };

  return html(
    <article>
      <header>
        <h1>Quick Search: "{Heading}"</h1>
      </header>
      <section>
        <h2>Overview</h2>
        <p>{AbstractText}</p>
      </section>
      {renderInfobox()}
      {renderRankedSection("Results", Results)}
      {renderRankedSection(
        "Related Topics",
        RelatedTopics.flatMap((t: { Topics: unknown }) => t.Topics ?? [t]),
      )}
    </article>,
  );
};
