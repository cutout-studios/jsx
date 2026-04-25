import { CutoutErrorCode } from "./types.ts";

export const ERROR_CODE_MESSAGES = {
  [CutoutErrorCode.DATA_UNKNOWN]: "`@cutout/jsx` has encountered unknown data.",
  [CutoutErrorCode.DATA_INSECURE_OP]:
    "`@cutout/jsx` was requested to perform an insecure operation.",
};

export const CONTEXT_MAX_SIZE = 100;
export const CONTEXT_TRUNCATION_CHARACTER = "…";
export const CONTEXT_MISSING_MESSAGE = "None.";

export const GUIDANCE_MISSING_MESSAGE = "Not provided.";
