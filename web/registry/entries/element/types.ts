import type { CutoutGeneratorToken } from "@cutout/jsx/tokens";
import type { Registry } from "../../base.ts";
import type {
  EntryDefinition,
  ShapeFor,
  ShapeValueFor,
  StyleEntry,
} from "../../types.ts";

export type AttributeChangedCallback<
  D extends EntryDefinition,
  K extends keyof D,
> = (
  name: K,
  newValue: ShapeValueFor<D[K]>,
  oldValue: ShapeValueFor<D[K]>,
) => void;

export type Options<D extends EntryDefinition> = {
  definition?: D;
  registry?: Registry;
  render?: (attributes?: ShapeFor<D>) => CutoutGeneratorToken;
  connectedCallback?: () => void;
  attributeChangedCallback?: AttributeChangedCallback<D, keyof D>;
  disconnectedCallback?: () => void;
  root?: string;
  stylesheet?: StyleEntry[];
};
