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

  /** The system has been instructed to do an operation deemed rendundant.  */
  OPERATION_REDUNDANT = "OPERATION_REDUNDANT",
}

export enum CutoutSupportedHTTPCode {
  SERVER_ERROR = 500,
  NOT_IMPLEMENTED = 501,
}

export type CutoutErrorOptions = {
  context?: unknown;
  guidance?: string;
  httpCode?: CutoutSupportedHTTPCode;
} & ErrorOptions;
