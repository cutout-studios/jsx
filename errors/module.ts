import { relative } from "@std/path";

import {
  CONTENT_MAX_SIZE,
  CONTENT_TRUNCATION_CHARACTER,
  ERROR_CODE_TRANSLATIONS,
} from "./constants.ts";
import type { CutoutErrorCode, CutoutErrorOptions } from "./types.ts";

export { CutoutErrorCode } from "./types.ts";

/**
 * TODO
 */
export class CutoutError extends Error {
  code: CutoutErrorCode;
  #context?: unknown;
  #guidance?: string;

  constructor(
    { code, guidance, context, ...options }: CutoutErrorOptions,
  ) {
    super("Error message overridden by CutoutError.", options);

    this.code = code;
    this.#context = context;
    this.#guidance = guidance;
  }

  override get message(): string {
    return `
      [${this.code}]: ${ERROR_CODE_TRANSLATIONS[this.code]}
        **Location:** ${this.location}
        **Context:** ${this.context ?? "None."}
        **Guidance:** ${this.guidance ?? "Not provided."}
    `.trim();
  }

  get location(): string | undefined {
    const [_self, callerFrame] = this.stack?.split(/\n\s+at\s/) ?? [];

    if (!callerFrame) return undefined;

    return relative(Deno.cwd(), new URL(callerFrame).pathname);
  }

  get context(): string | undefined {
    const result = String(this.#context);

    if (result.length > CONTENT_MAX_SIZE) {
      return result.slice(
        0,
        CONTENT_MAX_SIZE - CONTENT_TRUNCATION_CHARACTER.length,
      ) + CONTENT_TRUNCATION_CHARACTER;
    }

    return result;
  }

  get guidance(): string | undefined {
    return this.#guidance?.trim();
  }
}
