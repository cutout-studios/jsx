import {
  CutoutErrorCode,
  ERROR_CODE_MESSAGES,
  ERROR_CONTEXT_MAX_SIZE,
  ERROR_CONTEXT_MISSING_MESSAGE,
  ERROR_CONTEXT_TRUNCATION_CHARACTER,
  ERROR_GUIDANCE_MISSING_MESSAGE,
  ERROR_STACK_FRAME_PARENT_INDEX,
} from "./constants.ts";
import type * as V8 from "./v8.ts";

export type CutoutErrorOptions = {
  context?: unknown;
  guidance?: string;
} & ErrorOptions;

/**
 * A wrapper class for the native Error, that
 * enforces a proper error code and exposes some helpful
 * utilities.
 */
export class CutoutError extends Error {
  static {
    const V8_Error = Error as typeof Error & {
      prepareStackTrace?: V8.PrepareStackTrace;
    };
    const v8_prepareStackTrace = V8_Error.prepareStackTrace;

    V8_Error.prepareStackTrace = (error: Error, trace: V8.CallSite[]) => {
      if (error instanceof CutoutError) {
        return trace;
      }

      return v8_prepareStackTrace?.(error, trace);
    };
  }

  static getParentCallSite(): V8.CallSite | undefined {
    const { stack } = new CutoutError();

    if (!stack) return;

    return stack[ERROR_STACK_FRAME_PARENT_INDEX] as unknown as V8.CallSite;
  }

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
    code: CutoutErrorCode = CutoutErrorCode.OPERATION_UNKNOWN,
    { guidance, context, ...options }: CutoutErrorOptions = {},
  ) {
    super(`[${code}] ${ERROR_CODE_MESSAGES[code]}`, options);

    this.code = code;
    this.#context = context;
    this.#guidance = guidance;
  }

  /**
   * Additional context specified by the caller that
   * might be relevant in debugging.
   */
  get context(): string {
    if (!this.#context) return ERROR_CONTEXT_MISSING_MESSAGE;

    const result = typeof this.#context === "object"
      ? JSON.stringify(this.#context)
      : String(this.#context);

    if (result.length > ERROR_CONTEXT_MAX_SIZE) {
      return result.slice(
        0,
        ERROR_CONTEXT_MAX_SIZE - ERROR_CONTEXT_TRUNCATION_CHARACTER.length,
      ) + ERROR_CONTEXT_TRUNCATION_CHARACTER;
    }

    return result;
  }

  /**
   * Guidance provided to the developer to help them troubleshoot.
   */
  get guidance(): string {
    return this.#guidance?.trim() || ERROR_GUIDANCE_MISSING_MESSAGE;
  }
}
