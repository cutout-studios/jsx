export function getFreePort() {
  const listener = Deno.listen({ port: 0 });
  const { port } = listener.addr;
  listener.close();
  return port;
}
