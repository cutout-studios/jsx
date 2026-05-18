import type { CutoutGeneratorToken } from "@cutout/jsx/tokens";
import { CutoutError } from "@cutout/web/errors";
import { relative } from "@std/path";
import { type Registry, SYSTEM_REGISTRY } from "../../base.ts";
import type { ElementEntry, EntryDefinition, ShapeFor } from "../../types.ts";
import { registerRoute } from "../route.ts";
import { BaseElement } from "./base.ts";

export function registerElement<D extends EntryDefinition>(
  tag: string,
  {
    registry = SYSTEM_REGISTRY,
    root = Deno.cwd(),
    render = () => <slot></slot>,
  }: {
    registry?: Registry;
    root?: string;
    render?: (attributes?: ShapeFor<D>) => CutoutGeneratorToken;
  } = {},
) {
  const systemTag = `xo-${tag}`;
  const callSiteFilePath = CutoutError.getV8CallSiteParent()?.getFileName() ??
    undefined;
  const path = callSiteFilePath ? relative(root, callSiteFilePath) : undefined;

  if (path) {
    registerRoute(path, {
      render: async () => {
        // TODO(#): Dev vs. Prod environment
        const { outputFiles } = await Deno.bundle({
          entrypoints: [path],
          format: "esm",
          inlineImports: false,
          minify: true,
          keepNames: false,
          sourcemap: "linked",
          codeSplitting: true,
          packages: "external",
          platform: "browser",
          write: false,
        });

        const result = outputFiles?.find((file) => file.path.endsWith(path))
          ?.text();

        if (!result) {
          throw new CutoutError();
        }

        // TODO(#): Javascript obfuscation
        return result;
      },
    });
  }

  registry.define(
    systemTag,
    // TODO: slightly confused here - what goes static vs. constructor again?
    class extends BaseElement implements ElementEntry<D> {
      static override observedAttributes: string[];
      static override stylesheet: CSSRule[];
      static override attributes: D;
      static override render = render;

      render = render;
      name = systemTag;
    },
  );
}
