/** @jsxImportSource @cutout/jsx */

import type { QualifyingDevelopmentTask } from "./types.ts";

const displayName = "Brainstorm";

export const brainstorm: QualifyingDevelopmentTask = {
  displayName,
  prompt(scores) {
    if (scores.thoughtStream < 3 && scores.needsDetail < 3) {
      return null;
    }

    if (scores.playfulness < 3 && scores.frustration < 3) {
      return null;
    }

    const flavorAside = null; // TODO

    return (
      <article>
        <section>
          <h1>Goal: {displayName}</h1>
          <h2>Description</h2>
          <p>
            TODO
          </p>
        </section>
        {flavorAside}
      </article>
    );
  },
};
