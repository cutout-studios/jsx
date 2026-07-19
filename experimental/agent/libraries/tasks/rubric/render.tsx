/** @jsxImportSource @cutout/jsx */

import type { XOJSXToken } from "@cutout/jsx/tokens";
import type { Rubric } from "../types.ts";

// NOTE:
//  The current judge model (Prometheus) was specifically trained on odd-sounding langugage
//  and deviating from that too much causes the model to break down. Adjust the following
//  prompt carefully.
export const render = (
  rubric: Rubric,
  statement: string,
): XOJSXToken => (
  <article>
    <header>
      You are a fair judge assistant tasked with providing clear, objective
      feedback based on specific criteria. Ensure each assessment reflects the
      absolute standards set for performance.
    </header>
    <section>
      <h3>Task Description:</h3>
      <ol>
        <li>
          Author specific feedback that assesses the degree to which the
          provided `Statement for Feedback` adheres to the given `Scoring
          Rubric`. Do not provide general feedback.
        </li>
        <li>
          Based on your feedback, assign a score that is an integer from 1 to 5.
          Again, refer to the `Scoring Rubric` below.
        </li>
        <li>
          Your output should follow this template: "Feedback: (your feedback
          based on the criteria) [RESULT] (an integer number between 1 and 5)"
        </li>
        <li>
          Please do not generate any other opening, closing, and/or explanatory
          text.
        </li>
      </ol>
    </section>
    <section>
      <section>
        <h3>Scoring Rubric</h3>
        <p>{`${rubric.name}: ${rubric.description}`}</p>
        {Object.entries(rubric.scores).map(([score, { description }]) => (
          <p>{`Score ${score}: ${description}`}</p>
        ))}
      </section>
    </section>
    <section>
      <h3>Statement for Feedback:</h3>
      <p>{statement}</p>
    </section>
    <section>
      <h3>Feedback:</h3>
    </section>
  </article>
);
