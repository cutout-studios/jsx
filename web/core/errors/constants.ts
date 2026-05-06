import { CutoutErrorCode } from "./types.ts";

export const ERROR_CODE_MESSAGES = {
  [CutoutErrorCode.DATA_UNKNOWN]: "`@cutout/web` has encountered unknown data.",
  [CutoutErrorCode.OPERATION_INSECURE]:
    "`@cutout/web` was requested to perform an insecure operation.",
  [CutoutErrorCode.OPERATION_REDUNDANT]:
    "`@cutout/web` was requested to re-perform an operation unnecessarily.",
  [CutoutErrorCode.DATA_CORRUPTED]: "`@cutout/web` could not unpack corrupted data."
};

export const CONTEXT_MAX_SIZE = 100;
export const CONTEXT_TRUNCATION_CHARACTER = "…";
export const CONTEXT_MISSING_MESSAGE = "None.";

export const GUIDANCE_MISSING_MESSAGE = "Not provided.";
