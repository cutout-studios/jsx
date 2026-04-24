const escapedCharacters = new Map([
  ["&", "&amp;"],
  ["<", "&lt;"],
  [">", "&gt;"],
  ["'", "&#39;"],
  ['"', "&quot;"],
]);

const escapeCharacterRegex = /[&<>'"]/g;

/**
 * A utility for escaping raw HTML.
 * @param html The raw HTML.
 * @returns The escaped HTML.
 * @example
 *
 * ```ts
 * const unsafeHtml = "<div>hello</div>";
 * const safeHtml = escapeHtml(unsafeHtml); // returns "&lt;div&gt;hello&lt;/div&gt;"
 * ```
 */
export const escape = (html: string): string => {
  return html.replace(
    escapeCharacterRegex,
    (char) => escapedCharacters.get(char) as string,
  );
};
