import type { CutoutGeneratorToken } from "@cutout/jsx/tokens";
import {
  CONTEXT_MAX_SIZE,
  CONTEXT_MISSING_MESSAGE,
  CONTEXT_TRUNCATION_CHARACTER,
  ERROR_CODE_MESSAGES,
  GUIDANCE_MISSING_MESSAGE,
} from "./constants.ts";
import {
  CutoutErrorCode,
  type CutoutStackFrame,
  CutoutSupportedHTTPCode,
  type V8_CallSite,
  type V8_PrepareStackTrace,
} from "./types.ts";

export {
  CutoutErrorCode,
  type CutoutStackFrame,
  CutoutSupportedHTTPCode,
} from "./types.ts";

type CutoutErrorOptions = {
  render?: (error: CutoutError) => CutoutGeneratorToken;
  context?: unknown;
  guidance?: string;
} & ErrorOptions;

/**
 * A wrapper class for the native Error, that
 * enforces a proper error code and exposes some helpful
 * utilities.
 */
export class CutoutError extends Error {
  // TODO: explain this
  static {
    const _V8_Error = Error as typeof Error & {
      prepareStackTrace?: V8_PrepareStackTrace;
    };
    const _v8_prepareStackTrace = _V8_Error.prepareStackTrace;

    if (_v8_prepareStackTrace) {
      _V8_Error.prepareStackTrace = (error: Error, trace: V8_CallSite[]) => {
        if (error instanceof CutoutError) {
          for (const index in trace) {
            const frame = trace[index];

            error.#frames[index] = {
              type: frame.getTypeName(),
              symbol: frame.getMethodName() || frame.getFunctionName(),
              file: {
                name: frame.getFileName(),
                line: frame.getLineNumber(),
                column: frame.getColumnNumber(),
              },
            };
          }
        } else {
          _v8_prepareStackTrace(error, trace);
        }
      };
    }
  }

  static getParentFrame() {
    return new CutoutError(CutoutErrorCode.DATA_UNKNOWN, {}).parentFrame;
  }

  /** The canonical Cutout Error code. */
  code: CutoutErrorCode;
  render: (error: CutoutError) => CutoutGeneratorToken;
  #frames: CutoutStackFrame[] = [];
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
    {
      guidance,
      context,
      render = ({ code, message, parentFrame, context, guidance }) => {
        return (
          <div data-xo-error={code}>
            <h2>{message}</h2>
            <dl>
              <dt>Call Location</dt>
              <dd>{parentFrame?.file}</dd>
              <dt>Context</dt>
              <dd>{context}</dd>
              <dt>Guidance</dt>
              <dd>{guidance}</dd>
            </dl>
          </div>
        );
      },
      ...options
    }: CutoutErrorOptions,
  ) {
    super(`[${code}]: ${ERROR_CODE_MESSAGES[code]}`, options);

    this.code = code;
    this.render = render;
    this.#context = context;
    this.#guidance = guidance;

    Error.captureStackTrace(this, CutoutError);
    void this.stack;
  }

  get currentFrame(): CutoutStackFrame | undefined {
    if (!this.#frames) {
      return undefined;
    }

    return this.#frames[0];
  }

  get parentFrame(): CutoutStackFrame | undefined {
    if (!this.#frames) {
      return undefined;
    }

    return this.#frames[1];
  }

  /**
   * Additional data specified by the caller that
   * might be relevant in debugging.
   */
  get context(): string {
    if (!this.#context) return CONTEXT_MISSING_MESSAGE;

    const result = typeof this.#context === "object"
      ? JSON.stringify(this.#context)
      : String(this.#context);

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
  get guidance(): string {
    return this.#guidance?.trim() || GUIDANCE_MISSING_MESSAGE;
  }

  toJSX(): CutoutGeneratorToken {
    return this.render(this);
  }
}

export class CutoutHTTPError extends CutoutError {
  httpCode: CutoutSupportedHTTPCode;

  constructor(code: CutoutErrorCode, {
    httpCode = CutoutSupportedHTTPCode.SERVER_ERROR,
    ...options
  }) {
    super(code, options);

    this.httpCode = httpCode;
  }
}
