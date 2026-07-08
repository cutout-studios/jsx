/** @jsxImportSource @cutout/jsx */

import type { QualifyingDevelopmentTask } from "./types.ts";

const displayName = "Gathering Information";

export const gatherInformation: QualifyingDevelopmentTask = {
  displayName,
  prompt(scores) {
    if (
      scores.sincerity < 3 || (scores.dubiousness < 3 && scores.specificity > 3)
    ) {
      return null;
    }

    const dubiousAside = scores.dubiousness === 5
      ? (
        <aside>
          CAUTION: The system has flagged the statement as highly dubious. Focus
          specifically on validating the claims made.
        </aside>
      )
      : null;

    return (
      <article>
        <section>
          <h1>Goal: {displayName}</h1>
          <h2>Description</h2>
          <p>
            Provide the user with elucidating information surrounding their most
            recent statement.
          </p>
        </section>
        {dubiousAside}
        <section>
          <h2>Requirements</h2>
          <ul>
            <li>
              Principally, you must use whatever appropriate search tools you
              have available to you. Take note of the hyperlinks returned from
              the tool(s) and include them inline with your final report.
            </li>
            <li>
              If this is the first "{displayName}" task in the chain, remind the
              user to visit your provided links to verify the information you
              found.
            </li>
            <li>
              Only if your search tools fail you, inform the user that you
              couldn't find anything on the subject and take your best guess.
              It's critical you preface this output with a hedging statement,
              like "My training data suggests..." or "I'm not really sure, but I
              think that..." to tip off the user that what follows may be
              hallucinatory.
            </li>
          </ul>
        </section>
      </article>
    );
  },
};
