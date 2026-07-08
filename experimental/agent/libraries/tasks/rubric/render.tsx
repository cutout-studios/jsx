/** @jsxImportSource @cutout/jsx */

import type { CutoutGeneratorToken } from "@cutout/jsx/tokens";
import type { Rubric } from "../types.ts";

export const render = (
  rubric: Rubric,
  statement: string,
): CutoutGeneratorToken => (
  <article>
    <header>
      You are a fair judge assistant tasked with providing a clear, objective
      evaluation based on specific criteria. Ensure your evaluation of the
      included `Statement to Evaluate` reflects the `Scoring Rubric`.
    </header>
    <section>
      <h3>Task Description:</h3>
      <ol>
        <li>
          Author a specific evaluation that assesses the degree to which the
          provided `Statement to Evaluate` adheres to the given `Scoring
          Rubric`. Do not provide a general evaluation.
        </li>
        <li>
          Based on your evaluation, assign a score that is an integer from 1 to
          5. Again, refer to the `Scoring Rubric` below.
        </li>
        <li>
          Your output should follow this template: "Evaluation: (your evaluation
          based on the criteria) [RESULT] (your assigned score)"
        </li>
        <li>
          Please do not generate any other opening, closing, and/or explanatory
          text.
        </li>
      </ol>
    </section>
    <section>
      <h3>Scoring Rubric</h3>
      <p>{rubric.name}: {rubric.description}</p>
      <ol>
        {Object.entries(rubric.scores).map(
          ([score, { description }]) => {
            return (
              <li>
                <b>Score {score}:</b> {description}
              </li>
            );
          },
        )}
      </ol>
    </section>
    <section>
      <h3>The Statement to Evaluate:</h3>
      <p>{statement}</p>
    </section>
    <section>
      <h3>Evaluation:</h3>
    </section>
  </article>
);
