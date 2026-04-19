/**
 * TODO
 */
export enum CutoutErrorCode {
  DATA_UNKNOWN = "DATA_UNKNOWN",
  DATA_INSECURE_OP = "DATA_INSECURE_OP",
}

export type CutoutErrorOptions = {
  code: CutoutErrorCode;
  context?: unknown;
  guidance?: string;
} & ErrorOptions;
