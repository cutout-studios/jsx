import type { EmptyShape } from "@cutout/internal";
import { CutoutError, CutoutErrorCode } from "@cutout/web/errors";
import { relative } from "@std/path";
import { registerBrowserElement } from "./browser/element/register.tsx";
import { registerRoute } from "./route.ts";
import type {
  Definition,
  ElementJSX,
  ElementOptions as ElementOptions,
  Route,
} from "./types.ts";

/**
 * Registers an Element in the given component registry,
 * returning a function that can be used to invoke that Element via JSX.
 *
 * @param {string} tag The desired element tag for use in HTML. Must be unique.
 * @param {ElementOptions} options Options for configuring the Element generation.
 * @returns {ElementJSX} The generated Elements' JSX function.
 */
export function registerElement<D extends Definition>(
  tag: string,
  {
    registry,
    root = Deno.cwd(),
    ...options
  }: ElementOptions<D>,
): ElementJSX<D> {
  const callSiteFilePath = CutoutError.getV8CallSiteParent()?.getFileName() ??
    undefined;
  const path = callSiteFilePath ? relative(root, callSiteFilePath) : undefined;

  let route: Route<EmptyShape> | undefined;
  if (path) {
    route = registerRoute(path, {
      registry,
      render: async () => {
        // TODO(#62): Dev vs. Prod environment
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

        return result;
      },
    });
  }

  return registerBrowserElement(tag, { ...options, registry, route });
}
