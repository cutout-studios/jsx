/**
 * Canonical CutoutError error codes.
 */
export enum CutoutErrorCode {
  /** The system has encountered unknown data in an unprocessable way. */
  DATA_UNKNOWN = "DATA_UNKNOWN",

  /** The system has been instructed to do an operation deemed insecure. */
  DATA_INSECURE_OP = "DATA_INSECURE_OP",
}

export type CutoutErrorOptions = {
  context?: unknown;
  guidance?: string;
} & ErrorOptions;
