/**
 * Canonical CutoutError error codes.
 */
export enum CutoutErrorCode {
  /** The system has encountered unknown data in an unprocessable way. */
  DATA_UNKNOWN = "DATA_UNKNOWN",

  /** The system attempted to parse data that was corrupted. */
  DATA_CORRUPTED = "DATA_CORRUPTED",

  /** The system has been instructed to do an operation deemed insecure. */
  OPERATION_INSECURE = "OPERATION_INSECURE",

  /** The system simply could not complete the operation. */
  OPERATION_FAILURE = "OPERATION_FAILURE",

  /** The system was requested to perform a write operation on a readonly value. */
  OPERATION_READONLY = "OPERATION_READONLY",

  /** The system has been instructed to do an operation deemed rendundant.  */
  OPERATION_REDUNDANT = "OPERATION_REDUNDANT",
}

export enum CutoutSupportedHTTPCode {
  SERVER_ERROR = 500,
  NOT_IMPLEMENTED = 501,
}

export type CutoutStackFrame = {
  type: string | null;
  symbol: string | null;
  file: {
    name: string | null;
    line: number | null;
    column: number | null;
  };
};

export interface V8_CallSite {
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

export type V8_PrepareStackTrace = (
  error: Error,
  frames: V8_CallSite[],
) => unknown;