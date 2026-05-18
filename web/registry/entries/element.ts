import type { EmptyShape } from "@cutout/common";
import { CutoutError, CutoutErrorCode } from "@cutout/web/errors";
import { relative } from "@std/path";
import { SYSTEM_REGISTRY } from "../base.ts";
import type { EntryDefinition, RouteEntry } from "../types.ts";
import type { ElementEntryOptions } from "../types.ts";
import { registerBrowserElement } from "./browser/element/register.tsx";
import { registerRoute } from "./route.ts";

export function registerElement<D extends EntryDefinition>(
  tag: string,
  {
    registry = SYSTEM_REGISTRY,
    root = Deno.cwd(),
    ...options
  }: ElementEntryOptions<D> = {},
) {
  const callSiteFilePath = CutoutError.getV8CallSiteParent()?.getFileName() ??
    undefined;
  const path = callSiteFilePath ? relative(root, callSiteFilePath) : undefined;

  let route: RouteEntry<EmptyShape> | undefined;
  if (path) {
    route = registerRoute(path, {
      render: async () => {
        // TODO(#): Dev vs. Prod environment
        const { outputFiles, errors } = await Deno.bundle({
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

        if (errors.length) {
          throw new CutoutError(CutoutErrorCode.OPERATION_FAILURE, {
            cause: errors,
          });
        }

        const result = outputFiles?.find((file) => file.path.endsWith(path))
          ?.text();

        if (!result) {
          throw new CutoutError(CutoutErrorCode.DATA_UNKNOWN);
        }

        // TODO(#): Javascript obfuscation
        return result;
      },
    });
  }

  return registerBrowserElement(tag, { ...options, registry, route });
}
