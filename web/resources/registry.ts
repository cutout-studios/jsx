import { type AnyResource, ResourceType } from "./types.ts";

export class ResourceElementRegistry {
  #internalRegistry = new Map<string, AnyResource>();
  #reverseRegistry = new WeakMap<AnyResource, string>();
  #baseRegistry = globalThis.customElements;

  // TODO: make immutable
  define(
    name: string,
    resource: AnyResource,
  ): AnyResource {
    this.#internalRegistry.set(name, resource);
    this.#reverseRegistry.set(resource, name);

    if (resource.type === ResourceType.BROWSER_ELEMENT) {
      this.#baseRegistry.define(name, resource);
    }

    return resource;
  }

  get(name: string): AnyResource | undefined {
    return this.#internalRegistry.get(name);
  }

  getName(resource: AnyResource): string | null {
    return this.#reverseRegistry.get(resource) ?? null;
  }
}

export const SYSTEM_RESOURCE_REGISTRY = new ResourceElementRegistry();
