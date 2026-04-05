import { CutoutFormatter } from "../types.ts";

export const element: CutoutFormatter<HTMLCollection> = ([, generator]) => {
  const dom = globalThis.document.createDocumentFragment();

  for (const [type, value] of generator) {
    switch (type) {
      // create and append elements for open tags, and skip close tags
    }
  }

  return dom.children;
}
