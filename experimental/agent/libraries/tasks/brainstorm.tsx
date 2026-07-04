/** @jsxImportSource @cutout/jsx */

import type { QualifyingDevelopmentTask } from "./types.ts";

const displayName = "Brainstorming";

export const brainstorm: QualifyingDevelopmentTask = {
  displayName,
  prompt(scores) {
    if (scores.discursiveness < 3 && scores.specifity > 3) {
      return null;
    }

    if (scores.playfulness < 3 && scores.frustration < 3) {
      return null;
    }

    const troubleshootingAside = scores.frustration > 3
      ? (
        <aside>
          CAUTION: The system has flagged this user as frustrated, meaning they
          likely have an issue that requires troubleshooting. Focus on helping
          the user solve their specific problem first. If that problem is
          unclear, request clarification.
        </aside>
      )
      : null;

    return (
      <article>
        <section>
          <h1>Goal: {displayName}</h1>
          <h2>Description</h2>
          <p>
            Provide targeted inspiration to the user, helping them to generate
            new concepts: be it via your available tools, rubber-ducking or
            improvisational techniques.
          </p>
        </section>
        {troubleshootingAside}
      </article>
    );
  },
};
