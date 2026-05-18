import { CutoutError } from "@cutout/web/errors";
import { relative } from "@std/path";
import { SYSTEM_REGISTRY } from "../../base.ts";
import type { EntryDefinition } from "../../types.ts";
import { registerRoute } from "../route.ts";
import { registerBrowserElement } from "./browser/register.ts";
import type { Options } from "./types.ts";

export function registerElement<D extends EntryDefinition>(
  tag: string,
  {
    registry = SYSTEM_REGISTRY,
    root = Deno.cwd(),
    ...options
  }: Options<D> = {},
) {
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

  registerBrowserElement(tag, { ...options, registry });
}
