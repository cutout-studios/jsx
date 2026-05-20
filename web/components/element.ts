import type { EmptyShape } from "@cutout/common";
import { CutoutError, CutoutErrorCode } from "@cutout/web/errors";
import { relative } from "@std/path";
import { registerBrowserElement } from "./browser/element/register.tsx";
import { registerRoute } from "./route.ts";
import type {
  Definition,
  ElementJSX,
  ElementJSXOptions,
  Route,
} from "./types.ts";

export function registerElement<D extends Definition>(
  tag: string,
  {
    registry,
    root = Deno.cwd(),
    ...options
  }: ElementJSXOptions<D>,
): ElementJSX<D> {
  const callSiteFilePath = CutoutError.getV8CallSiteParent()?.getFileName() ??
    undefined;
  const path = callSiteFilePath ? relative(root, callSiteFilePath) : undefined;

  let route: Route<EmptyShape> | undefined;
  if (path) {
    route = registerRoute(path, {
      registry,
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
