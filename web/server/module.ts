import "@cutout/internal/polyfill";
import { CutoutRegistry } from "@cutout/web/components";

export class Server {
  registry: CutoutRegistry;

  constructor(registry: CutoutRegistry = new CutoutRegistry()) {
    this.registry = registry;
  }
}
