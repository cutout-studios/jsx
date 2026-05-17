import type { CutoutGeneratorToken } from "@cutout/jsx/tokens";
import { CutoutError } from "@cutout/web/errors";
import { relative } from "@std/path";
import { type Registry, SYSTEM_REGISTRY } from "../base.ts";
import type { ElementEntry, EntryDefinition, ShapeFor } from "../types.ts";
import { registerRoute } from "./route.ts";

export function registerElement<D extends EntryDefinition>(
  tag: string,
  {
    registry = SYSTEM_REGISTRY,
    root = Deno.cwd(),
    render = () => <slot></slot>,
  }: {
    registry?: Registry;
    root?: string;
    render?: (attributes: ShapeFor<D>) => CutoutGeneratorToken;
  } = {},
) {
  const systemTag = `xo-${tag}`;
  const callSiteFilePath = CutoutError.getV8CallSiteParent()?.getFileName() ??
    undefined;
  const path = callSiteFilePath ? relative(root, callSiteFilePath) : undefined;

  if (path) {
    registerRoute(path, {
      render: () => {
        // TODO: Deno.bundle
      },
    });
  }

  registry.define(
    systemTag,
    // TODO: the actual element behavior?
    class extends HTMLElement implements ElementEntry<D> {
      name = systemTag;
      render = render;
    },
  );
}
