/**
 * Canonical CutoutError error codes.
 */
export enum CutoutErrorCode {
  /** The system has encountered unknown data in an unprocessable way. */
  DATA_UNKNOWN = "DATA_UNKNOWN",

  /** The system attempted to parse data that was corrupted. */
  DATA_CORRUPTED = "DATA_CORRUPTED",

  OPERATION_UNKNOWN = "OPERATION_UNKNOWN",

  /** The system has been instructed to do an operation deemed insecure. */
  OPERATION_INSECURE = "OPERATION_INSECURE",

  /** The system simply could not complete the operation. */
  OPERATION_FAILURE = "OPERATION_FAILURE",

  /** The system was requested to perform a write operation on a readonly value. */
  OPERATION_READONLY = "OPERATION_READONLY",

  /** The system has been instructed to do an operation deemed rendundant.  */
  OPERATION_REDUNDANT = "OPERATION_REDUNDANT",

  HTTP_SERVER_ERROR = 500,

  HTTP_NOT_IMPLEMENTED = 501,
}

export const ERROR_CODE_MESSAGES = {
  [CutoutErrorCode.DATA_UNKNOWN]: "`@cutout/web` has encountered unknown data.",
  [CutoutErrorCode.DATA_CORRUPTED]:
    "`@cutout/web` could not unpack corrupted data.",
  [CutoutErrorCode.OPERATION_UNKNOWN]:
    "`@cutout/web` was requested to perform an unknown operation.",
  [CutoutErrorCode.OPERATION_INSECURE]:
    "`@cutout/web` was requested to perform an insecure operation.",
  [CutoutErrorCode.OPERATION_READONLY]:
    "`@cutout/web` was requested to perform a write operation on a readonly value.",
  [CutoutErrorCode.OPERATION_REDUNDANT]:
    "`@cutout/web` was requested to re-perform an operation unnecessarily.",
  [CutoutErrorCode.OPERATION_FAILURE]:
    "`@cutout/web` was unable to perform the requested operation.",
  [CutoutErrorCode.HTTP_SERVER_ERROR]:
    "`@cutout/web` encountered a generic error while attempting to serve an HTTP resource.",
  [CutoutErrorCode.HTTP_NOT_IMPLEMENTED]:
    "`@cutout/web` HTTP resource not implemented.",
};

export const ERROR_STACK_FRAME_INDEX = 1;
export const ERROR_STACK_FRAME_PARENT_INDEX = 2;

export const ERROR_CONTEXT_MAX_SIZE = 100;
export const ERROR_CONTEXT_TRUNCATION_CHARACTER = "…";
export const ERROR_CONTEXT_MISSING_MESSAGE = "None.";

export const ERROR_GUIDANCE_MISSING_MESSAGE = "Not provided.";
