import type { CutoutGeneratorToken } from "@cutout/jsx/tokens";
import { html } from "../format/html/main.ts";
import { CutoutError } from "./error.ts";

function _defaultRender({ code, message, context, guidance }: CutoutError) {
  return (
    <div data-xo-error={code}>
      <h2>{message}</h2>
      <dl>
        <dt>Call Location</dt>
        <dd>{CutoutError.getParentCallSite()?.getFileName() ?? "unknown"}</dd>
        <dt>Context</dt>
        <dd>{context}</dd>
        <dt>Guidance</dt>
        <dd>{guidance}</dd>
      </dl>
    </div>
  );
}

export function toJSX(
  error: CutoutError,
  render: (error: CutoutError) => CutoutGeneratorToken = _defaultRender,
) {
  return render(error);
}

export function toHTML(
  error: CutoutError,
  render: (error: CutoutError) => CutoutGeneratorToken = _defaultRender,
) {
  return html(toJSX(error, render));
}
