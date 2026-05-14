export interface CallSite {
  getMethodName(): string | null;
  getFileName(): string | null;
  getLineNumber(): number | null;
  getColumnNumber(): number | null;
  getFunctionName(): string | null;
  getTypeName(): string | null;
  isNative(): boolean;
  isEval(): boolean;
  getEvalOrigin(): string | undefined;
  isToplevel(): boolean;
  getEvalLineOffset(): number;
}

export type PrepareStackTrace = (
  error: Error,
  frames: CallSite[],
) => unknown;
