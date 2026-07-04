/** @jsxImportSource @cutout/jsx */

import type { CutoutGeneratorToken } from "@cutout/jsx/tokens";
import type { Rubric } from "../types.ts";

export const render = (
  rubric: Rubric,
  response: string,
): CutoutGeneratorToken => (
  <article>
    <header>
      You are a fair judge assistant tasked with providing clear, objective
      feedback based on specific criteria, ensuring each assessment reflects the
      absolute standards set for performance.
    </header>
    <section>
      <h3>Task Description:</h3>
      <p>
        An instruction (might include an Input inside it), a response to
        evaluate, a reference answer that gets a score of 5, and a score rubric
        representing a evaluation criteria are given.
      </p>
      <ol>
        <li>
          Write a detailed feedback that assess the quality of the response
          strictly based on the given score rubric, not evaluating in general.
        </li>
        <li>
          After writing a feedback, write a score that is an integer between 1
          and 5. You should refer to the score rubric.
        </li>
        <li>
          The output format should look as follows: "Feedback: (write a feedback
          for criteria) [RESULT] (an integer number between 1 and 5)"
        </li>
        <li>
          Please do not generate any other opening, closing, and explanations.
        </li>
      </ol>
    </section>
    <section>
      <h3>The instruction to evaluate:</h3>
      <p>{rubric.description}</p>
    </section>
    <section>
      <h3>Response to evaluate:</h3>
      <p>{response}</p>
    </section>
    {Object.entries(rubric.examples).flatMap(([score, examples]) => {
      return examples.map((example) => (
        <section>
          <h3>Reference Answer (Score {score})</h3>
          <p>{example}</p>
        </section>
      ));
    })}
    <section>
      <h3>Feedback:</h3>
    </section>
  </article>
);
