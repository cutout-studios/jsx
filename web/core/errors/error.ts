import {
  CutoutErrorCode,
  ERROR_CODE_MESSAGES,
  ERROR_CONTEXT_MAX_SIZE,
  ERROR_CONTEXT_MISSING_MESSAGE,
  ERROR_CONTEXT_TRUNCATION_CHARACTER,
  ERROR_GUIDANCE_MISSING_MESSAGE,
  ERROR_STACK_FRAME_INDEX,
  ERROR_STACK_FRAME_PARENT_INDEX,
  ERROR_STACK_OVERWRITTEN_MESSAGE
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
  static getV8CallSite(error?: CutoutError): V8.CallSite | undefined {
    return this.#resolveCallSite(ERROR_STACK_FRAME_INDEX, error);
  }

  static getV8CallSiteParent(error?: CutoutError): V8.CallSite | undefined {
    return this.#resolveCallSite(ERROR_STACK_FRAME_PARENT_INDEX, error);
  }

  static #resolveCallSite(index: number, error?: CutoutError) {
    if (!error) {
      error = new CutoutError();
      index += 1 + 1; // #resolveCallSite (+1) -> getCallSite (+1) -> <target callsite>
    }

    return error.#v8trace?.[index];
  }

  /** The canonical Cutout Error code. */
  code: CutoutErrorCode;
  #context?: unknown;
  #guidance?: string;
  #v8trace?: V8.CallSite[];

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

    // In order to safely populate the internal #v8trace property,
    // we must temporarily overrride V8's internal `Error.prepareStackTrace`.
    //
    // This procedure is safely a no-op in non-V8 environments.
    const V8_Error = Error as typeof Error & {
      prepareStackTrace?: V8.PrepareStackTrace;
    };
    const v8_prepareStackTrace = V8_Error.prepareStackTrace;

    V8_Error.prepareStackTrace = (error: Error, trace: V8.CallSite[]) => {
      if (error instanceof CutoutError) {
        this.#v8trace = trace;
      }

      if (v8_prepareStackTrace) {
        return v8_prepareStackTrace(error, trace);
      }

      return error.name + "\n\t" + ERROR_STACK_OVERWRITTEN_MESSAGE;
    };

    void this.stack;

    V8_Error.prepareStackTrace = v8_prepareStackTrace;
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
