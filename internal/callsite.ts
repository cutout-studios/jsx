import {
  CALLSITE_INDEX,
  CALLSITE_OVERWRITTEN_MESSAGE,
  CALLSITE_PARENT_INDEX,
} from "./constants.ts";

/**
 * @internal
 *
 * The only alternative to extracting callsite information is
 * requesting that the developer manually pass around import.meta.
 *
 * At present, to enable per-component routing in a buildless-but-seamless way,
 * this is the main recourse.
 */
export class V8CallSite extends Error implements CallSite {
  /** Alias for getting the call site of the this caller's parent. */
  static getParent(): V8CallSite | undefined {
    return new V8CallSite(CALLSITE_PARENT_INDEX + 1); // (+1 to account for this callsite)
  }

  constructor(frameIndex: number = CALLSITE_INDEX) {
    super();

    // In order to safely populate the internal #callStack property,
    // we must temporarily overrride V8's internal `Error.prepareStackTrace`.
    //
    // This procedure is safely a no-op in non-V8 environments.
    const V8_Error = Error as typeof Error & {
      prepareStackTrace?: PrepareStackTrace;
    };
    const v8_prepareStackTrace = V8_Error.prepareStackTrace;

    V8_Error.prepareStackTrace = (error: Error, trace: CallSite[]) => {
      if (error instanceof V8CallSite) {
        this.#callsite = trace[frameIndex];
      }

      if (v8_prepareStackTrace) {
        return v8_prepareStackTrace(error, trace);
      }

      return error.name + "\n\t" + CALLSITE_OVERWRITTEN_MESSAGE;
    };

    void this.stack;

    V8_Error.prepareStackTrace = v8_prepareStackTrace;
  }

  // TODO: More concise way to do this?
  getMethodName(): string | null {
    return this.#callsite?.getMethodName() ?? null;
  }
  getFileName(): string | null {
    return this.#callsite?.getFileName() ?? null;
  }
  getLineNumber(): number | null {
    return this.#callsite?.getLineNumber() ?? null;
  }
  getColumnNumber(): number | null {
    return this.#callsite?.getColumnNumber() ?? null;
  }
  getFunctionName(): string | null {
    return this.#callsite?.getFunctionName() ?? null;
  }
  getTypeName(): string | null {
    return this.#callsite?.getTypeName() ?? null;
  }
  isNative(): boolean {
    return this.#callsite?.isNative() ?? false;
  }
  isEval(): boolean {
    return this.#callsite?.isEval() ?? false;
  }
  getEvalOrigin(): string | undefined {
    return this.#callsite?.getEvalOrigin();
  }
  isToplevel(): boolean {
    return this.#callsite?.isToplevel() ?? false;
  }

  #callsite?: CallSite;
}

/** @internal */
type PrepareStackTrace = (error: Error, frames: CallSite[]) => unknown;

/** @internal */
interface CallSite {
  getMethodName(): string | null;
  getFileName(): string | null;
  getLineNumber(): number | null;
  getColumnNumber(): number | null;
  getFunctionName(): string | null;
  getTypeName(): string | null;
  isNative(): boolean;
  isEval(): boolean;
  getEvalOrigin(): string | undefined;
  isToplevel(): boolean;
}
