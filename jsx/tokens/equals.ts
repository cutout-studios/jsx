import type { ValidToken } from "./types.ts";

export const equals = (
  [token1type, token1value]: ValidToken,
  [token2type, token2value]: ValidToken,
): boolean => {
  return token1type === token2type && token1value === token2value;
};
