export async function commandExists(cmd: string): Promise<boolean> {
  try {
    await new Deno.Command(cmd, {
      args: ["--help"],
      stdout: "null",
      stderr: "null",
    }).output();

    return true;
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) return false;

    throw error;
  }
}
