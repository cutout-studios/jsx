/** @jsxImportSource @cutout/jsx */

import { rawText } from "@cutout/jsx/projections";
import { create } from "./create.ts";
import type { Tool } from "./types.ts";

export const QuickSearch: Tool = create({
  name: "QuickSearch",
  parameters: [{
    name: "query",
    type: String,
    description: "The query to search for, e.g. 'alphabet soup'.",
    required: true,
  }],
  description: rawText(
    <article>
      <section>
        <h1>DuckDuckGo Quick Search</h1>
      </section>
      <section>
        <h2>Overview</h2>
        <p>
          Look up a quick factual summary or definition of a topic via
          DuckDuckGo Instant Answers. Returns an HTML document containing an
          overview, results, and related topics with linsk.
        </p>
      </section>
      <section>
        <h2>Best Practices</h2>
        <ul>
          <li>
            Quick Search will only return results on an exact match. Long
            queries will likely come back empty. Ideally stick to single proper
            nouns.
          </li>
          <li>
            Faster and lighter than other search methods. Prefer this tool for
            shallow reference checks and disambiguation.
          </li>
          <li>
            Queries are case-sensitive. Use title case when relevent, like to
            refer to a proper noun.
          </li>
          <li>
            Does NOT support common search operators. Provied a more specific
            query (e.g. "alphabetic writing system" versus just "alphabet") to
            ensure relevant results.
          </li>
        </ul>
      </section>
    </article>,
  ),
  async handler({ query }): Promise<string> {
    if (typeof query !== "string") {
      return "Invaild Tool Call: `query` is not a string.";
    }

    const cleanQuery = query.trim().replaceAll(/\s+/g, "+");

    const results = await fetch(
      `https://api.duckduckgo.com/?q=${cleanQuery}&format=json`,
    );

    const { Heading, AbstractText, Infobox, RelatedTopics, Results } =
      await results.json();

    if (
      !Heading && !AbstractText && !Infobox && !RelatedTopics.length &&
      !Results.length
    ) {
      return rawText(
        <article>
          DuckDuckGo returned an empty response. Try a shorter query: ideally a
          single proper noun.
        </article>,
      );
    }

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

    return rawText(
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
  },
});
