import { Spinner } from "@std/cli/spinner";

import { MS_IO_SECOND } from "./constants.ts";

type Options = {
  runningLabel: string;
  completionLabel?: string;
  color?: string;
};

export async function callWithSpinner<T>(
  func: () => T,
  {
    runningLabel: label,
    completionLabel: pastTenseLabel = label,
    color = "gray",
  }: Options,
): Promise<T | Error> {
  const spinner = new Spinner({ message: `${label}…`, color });

  let seconds = 1;
  const spinnerInterval = setInterval(() => {
    spinner.message = `${label}… (${seconds++}s)`;
  }, MS_IO_SECOND);

  spinner.start();
  try {
    return await func();
  } catch (error) {
    if (error instanceof Error) {
      return error;
    }

    return new Error(String(error));
  } finally {
    spinner.stop();
    clearInterval(spinnerInterval);
    console.log(
      seconds === 1
        ? `%c${pastTenseLabel}`
        : `%c${pastTenseLabel} for ${seconds}s.`,
      `color: ${color};`,
    );
  }
}
