import type { CutoutGeneratorToken } from "@cutout/jsx/tokens";
import { relative } from "@std/path";
import { html } from "../format/html/main.ts";
import { CutoutError } from "./error.ts";

/**
 * TODO: document
 *
 * @param error
 * @param render
 * @returns
 */
export function toJSX(
  error: CutoutError,
  render: (error: CutoutError) => CutoutGeneratorToken = _defaultRender,
): CutoutGeneratorToken {
  return render(error);
}

/**
 * TODO: document
 *
 * @param error
 * @param render
 * @returns
 */
export function toHTML(
  error: CutoutError,
  render: (error: CutoutError) => CutoutGeneratorToken = _defaultRender,
): string {
  return html(toJSX(error, render));
}

function _defaultRender({ code, message, context, guidance }: CutoutError) {
  let callLocation = CutoutError.getParentCallSite()?.getFileName();

  if (callLocation) {
    callLocation = relative(Deno.cwd(), callLocation);
  }

  return (
    <div data-xo-error={code}>
      <h2>{message}</h2>
      <dl>
        <dt>Call Location</dt>
        <dd>{callLocation ?? "Unknown."}</dd>
        <dt>Context</dt>
        <dd>{context}</dd>
        <dt>Guidance</dt>
        <dd>{guidance}</dd>
      </dl>
    </div>
  );
}
