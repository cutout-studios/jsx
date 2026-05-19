import type { CutoutGeneratorToken } from "@cutout/jsx/tokens";
import { html } from "@cutout/web/formats";
import { relative } from "@std/path";
import { CutoutError } from "./error.ts";

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
  render: (error: CutoutError) => CutoutGeneratorToken = _defaultRender,
): CutoutGeneratorToken {
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
  render: (error: CutoutError) => CutoutGeneratorToken = _defaultRender,
): string {
  return html(toJSX(error, render));
}

function _defaultRender(error: CutoutError) {
  let callLocation = CutoutError.getV8CallSite(error)?.getFileName();

  if (callLocation) {
    callLocation = relative(Deno.cwd(), callLocation);
  }

  return (
    <div data-xo-error={error.code}>
      <h2>{error.message}</h2>
      <dl>
        <dt>Call Location</dt>
        <dd>{callLocation ?? "Unknown."}</dd>
        <dt>Context</dt>
        <dd>{error.context}</dd>
        <dt>Guidance</dt>
        <dd>{error.guidance}</dd>
      </dl>
    </div>
  );
}
