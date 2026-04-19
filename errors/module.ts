import { relative } from "@std/path";

import {
  CONTEXT_MAX_SIZE,
  CONTEXT_MISSING_MESSAGE,
  CONTEXT_TRUNCATION_CHARACTER,
  ERROR_CODE_MESSAGES,
  GUIDANCE_MISSING_MESSAGE,
} from "./constants.ts";
import type { CutoutErrorCode, CutoutErrorOptions } from "./types.ts";

export { CutoutErrorCode } from "./types.ts";

/**
 * A wrapper class for the native Error, that
 * enforces a proper error code and exposes some helpful
 * utilities.
 */
export class CutoutError extends Error {
  /** The canonical Cutout Error code. */
  code: CutoutErrorCode;
  #context?: unknown;
  #guidance?: string;

  /**
   * Construct a new CutoutError instance.
   *
   * @example
   * ```ts
   * throw new CutoutError(CutoutErrorCode.DATA_UNKNOWN, {
   *   context: User,
   *   guidance: "The user may not be logged in yet due to a race condition. See Issue #35."
   * });
   * ```
   */
  constructor(
    code: CutoutErrorCode,
    { guidance, context, ...options }: CutoutErrorOptions,
  ) {
    super(`[${code}]: ${ERROR_CODE_MESSAGES[code]}`, options);

    this.code = code;
    this.#context = context;
    this.#guidance = guidance;
  }

  /**
   * The location from which the error occurred, relative
   * to the project root.
   *
   * @example
   * ```
   * "errors/test.ts:7:17"
   * ```
   */
  get callLocation(): string | undefined {
    if (!this.stack) return undefined;

    const [_self, callerFrame] = this.stack.split(/\n\s+at\s/) ?? [];

    if (!callerFrame) return undefined;

    return relative(Deno.cwd(), new URL(callerFrame).pathname);
  }

  /**
   * Additional context specified by the caller that
   * might be relevant in debugging.
   */
  get context(): string {
    if (!this.#context) return CONTEXT_MISSING_MESSAGE;

    const result = String(this.#context);

    if (result.length > CONTEXT_MAX_SIZE) {
      return result.slice(
        0,
        CONTEXT_MAX_SIZE - CONTEXT_TRUNCATION_CHARACTER.length,
      ) + CONTEXT_TRUNCATION_CHARACTER;
    }

    return result;
  }

  /**
   * Guidance provided to the developer to help them troubleshoot.
   */
  get guidance(): string | undefined {
    if (!this.#guidance) return GUIDANCE_MISSING_MESSAGE;

    return this.#guidance.trim();
  }

  /**
   * Useful for reperesenting the entire error object in string form,
   * complete with call location, context, and additional guidance.
   * Provided in Markdown format.
   *
   * @returns The serialized error.
   * @example
   * ```
   * [DATA_UNKNOWN]: \`@cutout/jsx\` has encountered unknown data.
   *   - **Call Location:** errors/test.ts:7:17
   *   - **Context:** None.
   *   - **Guidance:** Not provided.
   * ```
   */
  override toString(): string {
    return [
      this.message,
      `  - **Call Location:** ${this.callLocation}`,
      `  - **Context:** ${this.context}`,
      `  - **Guidance:** ${this.guidance}`,
    ].join("\n");
  }
}
