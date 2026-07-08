import { Spinner } from "@std/cli/spinner";

import { MS_IO_SECOND } from "./constants.ts";

export async function callWithSpinner<T>(
  label: string,
  func: () => T,
  {
    pastTenseLabel = label,
    color = "gray",
  } = {},
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
