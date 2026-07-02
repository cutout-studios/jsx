/** @jsxImportSource @cutout/jsx */

import type { QualifyingDevelopmentTask } from "./types.ts";

const displayName = "Gather Information";

export const informationGathering: QualifyingDevelopmentTask = {
  displayName,
  prompt(scores) {
    if (
      scores.sincerity < 3 && scores.dubiousness < 3 && scores.needsDetail < 3
    ) {
      return null;
    }

    const dubiousAside = scores.dubiousness === 5
      ? (
        <aside>
          CAUTION: The system has flagged this message as highly dubious. You
          should focus on providing information surrounding this claim.
        </aside>
      )
      : null;

    return (
      <article>
        <section>
          <h1>Goal: {displayName}</h1>
          <h2>Description</h2>
          <p>
            TODO
          </p>
        </section>
        {dubiousAside}
        <section>
          <h2>WIP: Requirements</h2>
          <ul>
            <li>Primarily: use your search tool.</li>
            <li>Annotate your report with links.</li>
            <li>
              Secondarily, prefix your non-search data with "I heard" or "I
              guess"
            </li>
            <li>
              If this is the first "Information Gathering" task, remind the user
              to visit the links to verify.
            </li>
          </ul>
        </section>
      </article>
    );
  },
};
