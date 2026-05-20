/**
 * Canonical CutoutError error codes.
 */
export enum ErrorCode {
  DATA_UNKNOWN = "DATA_UNKNOWN",
  DATA_CORRUPTED = "DATA_CORRUPTED",
  OPERATION_UNKNOWN = "OPERATION_UNKNOWN",
  OPERATION_INSECURE = "OPERATION_INSECURE",
  OPERATION_FAILURE = "OPERATION_FAILURE",
  OPERATION_READONLY = "OPERATION_READONLY",
  OPERATION_REDUNDANT = "OPERATION_REDUNDANT",
  HTTP_SERVER_ERROR = 500,
  HTTP_NOT_IMPLEMENTED = 501,
}

export const ERROR_STACK_FRAME_INDEX = 0;
export const ERROR_STACK_FRAME_PARENT_INDEX = 1;
export const ERROR_STACK_OVERWRITTEN_MESSAGE =
  "`Error.prepareStackTrace` overwritten by `@cutout/web`.";

export const ERROR_CONTEXT_MAX_SIZE = 100;
export const ERROR_CONTEXT_TRUNCATION_CHARACTER = "…";
export const ERROR_CONTEXT_MISSING_MESSAGE = "None.";

export const ERROR_GUIDANCE_MISSING_MESSAGE = "Not provided.";

const MODULE_NAME = "`@cutout/web`";

export const ERROR_CODE_MESSAGES = {
  [ErrorCode.DATA_UNKNOWN]: `${MODULE_NAME} has encountered unknown data.`,
  [ErrorCode.DATA_CORRUPTED]:
    `${MODULE_NAME} failed to unpack data due to corruption.`,
  [ErrorCode.OPERATION_UNKNOWN]:
    `${MODULE_NAME} was requested to perform an unknown operation.`,
  [ErrorCode.OPERATION_INSECURE]:
    `${MODULE_NAME} was requested to perform an insecure operation.`,
  [ErrorCode.OPERATION_READONLY]:
    `${MODULE_NAME} was requested to perform a write operation on a readonly value.`,
  [ErrorCode.OPERATION_REDUNDANT]:
    `${MODULE_NAME} was requested to re-perform an operation unnecessarily.`,
  [ErrorCode.OPERATION_FAILURE]:
    `${MODULE_NAME} failed to perform the requested operation.`,
  [ErrorCode.HTTP_SERVER_ERROR]:
    `${MODULE_NAME} encountered a server error while attempting to serve an HTTP resource.`,
  [ErrorCode.HTTP_NOT_IMPLEMENTED]:
    `${MODULE_NAME} the requested HTTP resource is not implemented.`,
};
