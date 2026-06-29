import { Spinner } from "@std/cli/spinner";

import { MS_IO_SECOND } from "./constants.ts";

export function callWithSpinner<T>(
  name: string,
  fn: () => T,
  color = "gray",
): T | Error {
  const spinner = new Spinner({ message: `${name}…`, color });

  let seconds = 1;
  const spinnerInterval = setInterval(() => {
    spinner.message = `${name}… (${seconds++}s)`;
  }, MS_IO_SECOND);

  spinner.start();
  try {
    return fn();
  } catch (error) {
    if (error instanceof Error) {
      return error;
    }

    return new Error(String(error));
  } finally {
    spinner.stop();
    clearInterval(spinnerInterval);
    console.log(
      `%${name} for ${seconds}s.`,
      `color: ${color};`,
    );
  }
}
