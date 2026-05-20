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
 * this is our main recourse.
 */
export class V8CallSite extends Error {
  /** Expose the current call site information. */
  static get(index: number = CALLSITE_INDEX): CallSite | undefined {
    return this.#resolveCallSite(index);
  }

  /** Alias for getting the call site of the this caller's parent. */
  static getParent(): CallSite | undefined {
    return this.get(CALLSITE_PARENT_INDEX + 1); // (+1 to account for this callsite)
  }

  static #resolveCallSite(index: number) {
    const error = new V8CallSite();

    index += 1 + 1; // #resolveCallSite (+1) -> getCallSite (+1) -> <target callsite>

    return error.#callStack?.[index];
  }

  constructor() {
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
        this.#callStack = trace;
      }

      if (v8_prepareStackTrace) {
        return v8_prepareStackTrace(error, trace);
      }

      return error.name + "\n\t" + CALLSITE_OVERWRITTEN_MESSAGE;
    };

    void this.stack;

    V8_Error.prepareStackTrace = v8_prepareStackTrace;
  }

  #callStack?: CallSite[];
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
  getEvalLineOffset(): number;
}
