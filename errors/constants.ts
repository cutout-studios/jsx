import { CutoutErrorCode } from "./types.ts";

export const CONTENT_MAX_SIZE = 100;
export const CONTENT_TRUNCATION_CHARACTER = "…";

export const ERROR_CODE_TRANSLATIONS = {
  [CutoutErrorCode.DATA_UNKNOWN]: "`@cutout/jsx` has encountered unknown data.",
  [CutoutErrorCode.DATA_INSECURE_OP]:
    "`@cutout/jsx` was requested to perform an insecure operation.",
};
