import type { CutoutGeneratorToken } from "@cutout/jsx/tokens";
import { html } from "@cutout/web/formats";
import type { CutoutError } from "./error.ts";

/**
 * Convert the provided CutoutError into a `@cutout/jsx` IR stream.
 *
 * @param {CutoutError} error The error to render.
 * @param {[(CutoutError): CutoutGeneratorToken]} render
 *  Custom renderer function. Defaults to a system-defined function.
 * @returns The rendered JSX IR.
 */
export function toJSX(
  error: CutoutError,
  render: (error: CutoutError) => GeneratorToken = _defaultRender,
): GeneratorToken {
  return render(error);
}

/**
 * Convert the provided CutoutError into an HTML string.
 *
 * @param {CutoutError} error
 * @param {[(CutoutError): CutoutGeneratorToken]} render
 *  Custom renderer function. Defaults to a system-defined function.
 * @returns The rendered HTML string.
 */
export function toHTML(
  error: CutoutError,
  render: (error: CutoutError) => GeneratorToken = _defaultRender,
): string {
  return html(toJSX(error, render));
}

function _defaultRender(error: CutoutError) {
  let callsite;

  if (error.callsite?.file) {
    let callsiteText = error.callsite.file;

    if (error.callsite.line) {
      callsiteText += `:${error.callsite.line}`
    }

    if (error.callsite.line && error.callsite.column) {
      callsiteText += `:${error.callsite.column}`;
    }

    callsite = (
      <>
        <dt>Callsite</dt>
        <dd>{callsiteText}</dd>
      </>
    );
  }

  return (
    <div data-xo-error={error.code}>
      <h2>{error.message}</h2>
      <dl>
        {callsite}
        <dt>Context</dt>
        <dd>{error.context}</dd>
        <dt>Guidance</dt>
        <dd>{error.guidance}</dd>
      </dl>
    </div>
  );
}

/**
 * @internal
 * This is published! We don't need to re-export it!
 */
type GeneratorToken = CutoutGeneratorToken;
