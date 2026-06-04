import type { CutoutGeneratorToken } from "@cutout/jsx/tokens";
import { html } from "@cutout/web/projections";
import type { CutoutError, CutoutErrorCallsite } from "./error.ts";

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
  return (
    <div data-xo-error={error.code}>
      <h2>{error.message}</h2>
      <dl>
        {_defaultRenderCallsite(error.callsite)}
        <dt>Context</dt>
        <dd>{error.context}</dd>
        <dt>Guidance</dt>
        <dd>{error.guidance}</dd>
      </dl>
    </div>
  );
}

function _defaultRenderCallsite(
  callsite:
    | CutoutErrorCallsite
    | undefined,
) {
  if (!callsite?.file) return;

  let callsiteText = callsite.file;

  if (callsite.line) {
    callsiteText += `:${callsite.line}`;
  }

  if (callsite.line && callsite.column) {
    callsiteText += `:${callsite.column}`;
  }

  return (
    <>
      <dt>Callsite</dt>
      <dd>{callsiteText}</dd>
    </>
  );
}

/**
 * @internal
 * This is published! We don't need to re-export it!
 */
type GeneratorToken = CutoutGeneratorToken;
