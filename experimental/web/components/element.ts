import { type EmptyShape, V8CallSite } from "@cutout/internal";
import { CutoutError, CutoutErrorCode } from "@cutout/web/errors";
import { relative } from "@std/path";
import { createBrowserElement } from "./browser/element/register.tsx";
import { createEndpoint } from "./endpoint.ts";
import type {
  Type,
  ElementJSX,
  ElementOptions as ElementOptions,
  Endpoint,
} from "./types.ts";

export function createElement<D extends Type>(
  tag: string,
  {
    root = Deno.cwd(),
    ...options
  }: ElementOptions<D>,
): ElementJSX<D> {
  const callSiteFilePath = V8CallSite.getParent()?.getFileName() ??
    undefined;
  const path = callSiteFilePath ? relative(root, callSiteFilePath) : undefined;

  let route: Endpoint<EmptyShape> | undefined;
  if (path) {
    route = createEndpoint(path, {
      render: async () => {
        // TODO(#62): Prod environment
        const { outputFiles, errors } = await Deno.bundle({
          entrypoints: [path],
          format: "esm",
          inlineImports: false,
          minify: false,
          keepNames: true,
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

  return createBrowserElement(tag, { ...options, route });
}
